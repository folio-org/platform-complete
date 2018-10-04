@Library ('folio_jenkins_shared_libs') _

pipeline {

  parameters {
    booleanParam(name: 'DEBUG_TEST',
                 defaultValue: false,
                 description: 'Enable integration test debugging')
    string(name: 'OKAPI_URL',
           defaultValue: 'http://folio-snapshot-stable.aws.indexdata.com:9130',
           description: 'Okapi URL')
  }

  environment {
    tenant = "platform_core_${env.BRANCH_NAME}_${env.BUILD_NUMBER}"
    npmConfig = 'jenkins-npm-folio'
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
        buildStripesPlatform(params.OKAPI_URL,env.tenant)
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

