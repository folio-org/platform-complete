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
        sh 'git add yarn.lock'
        sh 'git commit -m "Update yarn.lock (CI)"'
        sshGitPush(origin: env.origin, branch: env.BRANCH_NAME)
      }
    }
  } // end stages

  post {
    always {
      sendNotifications currentBuild.result
    }
  }
}

