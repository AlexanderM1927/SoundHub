pipeline {
    agent any
    options {
        disableConcurrentBuilds()
    }
    stages {
        stage('Frontend prepare') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                withCredentials([file(credentialsId: 'envsoundhub-front', variable: 'ENV_FILE')]) {
                    sh 'cp -u "\$ENV_FILE" ./front/.env'
                }
                dir('./front') {
                    sh 'npm install'
                    sh 'icongenie generate -m pwa -i ./public/logo.png'
                }
            }
        }
        stage('Frontend build') {
            tools {
                nodejs 'node-14.16.1'
            }
            steps {
                dir('./front') {
                    sh 'quasar build -m pwa'
                    sh 'chown -R jenkins:jenkins ./dist/pwa'
                    sh 'rsync -a ./dist/pwa/. /var/lib/jenkins/workspace/soundhub/back/public'
                }
            }
        }
        stage('Backend prepare and build') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                withCredentials([file(credentialsId: 'envsoundhub', variable: 'ENV_FILE')]) {
                    sh 'cp -u "\$ENV_FILE" ./back/.env'
                }
                dir('./back') {
                    sh 'npm install'
                    sh 'npx sequelize-cli db:migrate'
                    sh 'npx sequelize-cli db:seed:all'
                    sh 'cp -r ./config /var/lib/jenkins/workspace/soundhub/back/dist'
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                dir('./back') {
                    sh 'export JENKINS_NODE_COOKIE=dontKillMeSoundhub; NODE_ENV=production pm2 start ecosystem.config.cjs'
                }
            }
        }
    }
}
