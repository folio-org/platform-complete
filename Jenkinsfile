@Library ('folio_jenkins_shared_libs') _

pipeline {

  environment {
    origin = 'platform-complete'
    branch = 'snapshot'
    folioRegistry = 'http://folio-registry.aws.indexdata.com'
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
        // the tenant and okapi url are irrelevant here. 
        buildStripesPlatform('https://folio-snapshot-okapi.aws.indexdata.com','diku')
      }
    }

    stage('Test Interface Dependencies') {
      steps { 
        script {
          def stripesInstallJson = readFile('./stripes-install.json')
          platformDepCheck('diku',stripesInstallJson)
      }
    }

    // If stripes build is successful, update yarn.lock and commit
    stage('Commit yarn.lock') {
      when { 
        anyOf {
          environment name:  'JOB_NAME', value: 'Automation/build-platform-complete-snapshot'
          branch 'snapshot'
        }
      }
      steps {
        sh "git checkout $env.branch"
        sh 'git add yarn.lock'
        script { 
          def commitStatus = sh(returnStatus: true, 
                                script: 'git commit -m "FOLIO CI: Update yarn.lock"')
          if ( commitStatus == 0 ) {
            sshGitPush(origin: env.origin, branch: env.branch)
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

