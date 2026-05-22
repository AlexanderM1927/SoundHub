pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        NODE_OPTIONS = "--max-old-space-size=1536"
        JENKINS_NODE_COOKIE = "dontKillMeSoundhub"
        SOUNDHUB_APP_DIR = "/var/www/apps/soundhub/back"
    }

    stages {
        stage('Backend prepare and build') {
            tools {
                nodejs 'node-21.11.1'
            }

            steps {
                withCredentials([file(credentialsId: 'envsoundhub', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./back/.env'
                    sh 'cp "$ENV_FILE" ./back/.env'
                }

                dir('./back') {
                    sh '''
                    set -e

                    echo "[backend] Installing dependencies..."
                    npm ci

                    echo "[backend] Building..."
                    npm run build

                    echo "[backend] Copying config into dist..."
                    rm -rf ./dist/config
                    cp -r ./config ./dist/config
                    '''
                }
            }
        }

        stage('Frontend prepare') {
            tools {
                nodejs 'node-21.11.1'
            }

            steps {
                withCredentials([file(credentialsId: 'envsoundhub-front', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./front/.env'
                    sh 'cp "$ENV_FILE" ./front/.env'
                }

                dir('./front') {
                    sh '''
                    set -e

                    echo "[frontend] Installing dependencies..."
                    npm ci

                    echo "[frontend] Generating icons..."
                    npx icongenie generate -m pwa -i ./public/logo.png
                    '''
                }
            }
        }

        stage('Frontend build') {
            tools {
                nodejs 'node-14.16.1'
            }

            steps {
                dir('./front') {
                    sh '''
                    set -e

                    echo "[frontend] Building Quasar PWA..."
                    quasar build -m pwa

                    echo "[frontend] Copying PWA into backend public..."
                    rm -rf ../back/public
                    mkdir -p ../back/public
                    rsync -az --delete ./dist/pwa/ ../back/public/
                    '''
                }
            }
        }

        stage('Deploy') {
            tools {
                nodejs 'node-21.11.1'
            }

            steps {
                dir('./back') {
                    sh '''
                    set -e

                    echo "[deploy] Deploying SoundHub to $SOUNDHUB_APP_DIR..."

                    mkdir -p "$SOUNDHUB_APP_DIR"

                    rsync -az --delete \
                      --exclude node_modules \
                      ./ "$SOUNDHUB_APP_DIR/"

                    echo "[deploy] Syncing dependencies..."
                    rsync -az --delete ./node_modules "$SOUNDHUB_APP_DIR/"

                    cd "$SOUNDHUB_APP_DIR"

                    echo "[deploy] Running migrations..."
                    npx sequelize-cli db:migrate

                    echo "[deploy] Running seeds..."
                    npx sequelize-cli db:seed:all || true

                    echo "[deploy] Restarting PM2..."
                    NODE_ENV=production pm2 startOrReload ecosystem.config.cjs --update-env

                    pm2 save
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            tools {
                nodejs 'node-21.11.1'
            }

            steps {
                sh '''
                set -e

                echo "[verify] PM2 list..."
                pm2 list

                echo "[verify] Checking SoundHub..."
                pm2 list | grep SoundHubBackend

                echo "[verify] Local HTTP check..."
                curl -I --max-time 10 http://127.0.0.1:8003 || true
                '''
            }
        }
    }
}