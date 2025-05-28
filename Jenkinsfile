@Library ('folio_jenkins_shared_libs') _


pipeline {

  environment {
    folioPlatform = 'platform-complete'
    folioHostname = "${env.folioPlatform}-${env.CHANGE_ID}-${env.BUILD_NUMBER}"
    ec2Group = "platform_complete_${env.CHANGE_ID}_${env.BUILD_NUMBER}"
    npmConfig = 'jenkins-npm-folio'
    sshKeyId = '11657186-f4d4-4099-ab72-2a32e023cced'
    folioRegistry = 'http://folio-registry.aws.indexdata.com'
    releaseOnly = 'true'
    okapiUrl = "http://${env.folioHostname}.aws.indexdata.com:9130"
    folioUrl = "http://${env.folioHostname}.aws.indexdata.com"
    projUrl = "https://github.com/folio-org/${env.folioPlatform}"
    tenant = 'diku'
  }

  options {
    timeout(60)
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  agent {
    node {
      label 'jenkins-agent-java17'
    }
  }

  stages {
    stage('Setup') {
      steps {
        sendNotifications 'STARTED'
        script {
          currentBuild.displayName = "#${env.BUILD_NUMBER}-${env.JOB_BASE_NAME}"
          // These two variable are set by Github Branch Source plugin
          echo "Origin branch: $env.CHANGE_BRANCH"
          echo "Target branch: $env.CHANGE_TARGET"

          def lastCommit = sh(returnStatus: true,
                              script: "git log -1 | grep '.*\\[CI SKIP\\].*'")

          if (lastCommit == 0) {
              echo "CI SKIP detected.  Aborting build"
              env.skipBuild = 'true'
          }
        }
      }
    }

    stage('Do Build') {
       when {
         anyOf {
           expression { env.skipBuild != 'true' }
           environment name:  'JOB_NAME', value: 'Automation/build-platform-complete-snapshot'
         }
       }

       stages {
         stage('Build Stripes Platform') {
           steps {
             // the tenant and okapi url are irrelevant here.
             buildStripesPlatform('https://localhost:9130','diku')
           }
         }

         stage('Check Interface Dependencies') {
           steps {
             script {
               echo "Creating okapi preseed module list."
               sh 'jq -s \'.[0]=([.[]]|flatten)|.[0]\' stripes-install.json install-extras.json > install-pre.json'
               def installPreJson = readFile('./install-pre.json')
               platformDepCheck('diku',installPreJson)
               echo 'Removing Okapi version from install.json'
               sh 'sed -i \'s/okapi-.*"/okapi"/\' install.json'
               sh 'cat install.json'
               echo 'Generating backend dependency list to okapi-install.json'
               sh 'jq \'map(select(.id | test(\"mod-\"; \"i\")))\' install.json > okapi-install.json'
               sh 'cat okapi-install.json'
               echo "Append edge modules to final stripes-install.json."
               sh 'mv stripes-install.json stripes-install-pre.json'
               sh 'jq \'map(select(.id | test(\"edge-\"; \"i\")))\' install.json > install-edge.json'
               sh 'jq -s \'.[0]=([.[]]|flatten)|.[0]\' stripes-install-pre.json install-edge.json > stripes-install.json'
               sh 'cat stripes-install.json'
             }
           }
         }

/*
 *       stage('Build FOLIO Instance') {
 *         when {
 *           changeRequest()
 *         }
 *         steps {
 *           // build FOLIO instance
 *           buildPlatformInstance(env.ec2Group,env.folioHostname,env.tenant)
 *           script { 
 *             def pr_comment = pullRequest.comment("Instance available at $env.folioUrl")
 *           }
 *
 *         }
 *       }
 */

        stage('Publish NPM Package') {
          when {
            buildingTag()
          }
          steps {
            withCredentials([string(credentialsId: 'jenkins-npm-folioci',variable: 'NPM_TOKEN')]) {
              withNPM(npmrcConfig: env.npmConfig) {
                // clean up generated artifacts before publishing
                sh 'rm -rf ci artifacts output bundle node_modules ModuleDescriptors'
                // don't include these in package
                sh 'rm -rf yarn.lock install.json stripes-install.json okapi-install.json'
                sh 'npm publish'
              }
            }
          }
        }

      }    //end 'do buid' stage
    }     // end inner stages
  }      // end outter stages

  post {
    always {
      sendNotifications currentBuild.result
    }
  }
}
