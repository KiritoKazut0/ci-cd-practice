pipeline{
    agent any 

    stages{
        stage('clone repository'){
            steps {
                git branch: 'main', url : "https://github.com/KiritoKazut0/ci-cd-practice.git"
                echo 'clone repository succefully'
            }
        }

        stage('checkout repository'){
          steps{
              sh 'ls -la'
          }
        }
    }

}