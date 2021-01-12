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
        sendNotifications 'STARTED'
        script {
          currentBuild.displayName = "#${env.BUILD_NUMBER}-${env.JOB_BASE_NAME}"
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

         // If stripes build is successful, update yarn.lock and commit
         stage('Update Branch Install Artifacts') {
           when { 
             anyOf {
               environment name:  'JOB_NAME', value: 'Automation/build-platform-complete-snapshot'
               branch 'snapshot'
             }
           }
           steps {
             script {
               def installFiles = ['stripes-install.json',
                                   'okapi-install.json',
                                   'install.json',
                                   'yarn.lock']

               sh "git checkout $env.branch"
               sh 'git add yarn.lock'

               for (int i = 0; i < installFiles.size(); i++) {
                sh "git add ${env.WORKSPACE}/${installFiles[i]}"
               } 

               def commitStatus = sh(returnStatus: true, 
                                     script: 'git commit -m "[CI SKIP] Updating install files"')

               if ( commitStatus == 0 ) {
                 sshGitPush(origin: env.origin, branch: env.branch)
               }
               else {
                 echo "No changes to artifacts"
               }
             }
           }
         }

         stage('Publish Snapshot NPM') {
           when {
             buildingTag()
           }
           steps {
             // clean up any generated stuff from CI
             sh 'rm -rf bundle output artifacts ci node_modules ModuleDescriptors'
             sh 'rm -rf yarn.lock install.json stripes-install.json okapi-install.json'

             withCredentials([string(credentialsId: env.npmConfig,variable: 'NPM_TOKEN')]) {
               withNPM(npmrcConfig: env.npmConfig) {
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

