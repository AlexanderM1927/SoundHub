pipeline {
    agent any
    stages {
        stage('Frotend') {
            tools {
                nodejs 'soundhub-front'
            }
            steps {
                dir('./front') {
                    sh 'pwd'
                    sh 'npm install'
                    sh 'pwd'
                    sh 'quasar build -m pwa'
                    sh 'mv -n ./dist/pwa /var/lib/jenkins/workspace/soundhub/back/public'
                }
            }
        }
        stage('Backend') {
            tools {
                nodejs 'soundhub-back'
            }
            steps {
                dir('./back') {
                    sh 'pwd'
                    sh 'npm install'
                    sh 'pwd'
                    sh 'npx sequelize-cli db:migrate'
                    sh 'npx sequelize-cli db:seed:all'
                    sh 'npm run build'
                    sh 'npm run start'
                }
            }
        }
    }
}