pipeline {
    agent any
    stages {
        stage('Frotend') {
            tools {
                nodejs 'soundhub-front'
            }
            steps {
                dir('./front') {
                    sh 'npm install'
                    sh 'quasar build -m pwa'
                    sh 'cp -r ./dist/pwa /var/lib/jenkins/workspace/soundhub/back/public'
                }
            }
        }
        stage('Backend') {
            tools {
                nodejs 'soundhub-back'
            }
            steps {
                dir('./back') {
                    sh 'npm install'
                    sh 'npx sequelize-cli db:migrate'
                    sh 'npx sequelize-cli db:seed:all'
                    sh 'cp -r ./config /var/lib/jenkins/workspace/soundhub/back/dist'
                    sh 'npm run build'
                    sh 'pm2 stop all'
                    sh 'pm2 start ./dist/server.js'
                    sh ''
                }
            }
        }
    }
}