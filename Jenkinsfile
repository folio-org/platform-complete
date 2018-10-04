@Library ('folio_jenkins_shared_libs') _

pipeline {

  environment {
    origin = 'platform-complete'
  }

  options {
    timeout(30)
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  agent {
    node {
      label 'jenkins-slave-all'
    }
  }

  stages {
    stage('Setup') {
      steps {
        script {
          currentBuild.displayName = "#${env.BUILD_NUMBER}-${env.JOB_BASE_NAME}"
        }
        sendNotifications 'STARTED'
      }
    }

    stage('Build Stripes Platform') {
      steps {
         sh 'yarn install'
         sh 'yarn build ./output'
      }
    }

    stage('Commit yarn.lock') {
      steps {
        sh "git checkout ${env.BRANCH_NAME}"
        sh 'git add yarn.lock'
        script { 

          def commitStatus = sh(returnStatus: true, 
                                script: 'git commit -m "Update yarn.lock (FOLIO CI)"').trim()
          if (commitStatus = 0) { 
            sshGitPush(origin: env.origin, branch: env.BRANCH_NAME)
          }
          else {
            echo "No changes to yarn.lock file"
          }

        }
      }
    }
  } // end stages

  post {
    always {
      sendNotifications currentBuild.result
    }
  }
}

