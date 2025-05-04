@Library ('folio_jenkins_shared_libs') _


// Jenkinsfile  – prints all env vars (sorted)
// Works in either a Multibranch Pipeline or a single branch job.

pipeline {
    agent any        // run on the default agent the job picks

    options {
        // Show timestamps so you know when it ran (optional)
        timestamps()
    }

    stages {
        stage('Dump environment') {
            steps {
                // `printenv` lists everything.  `sort` just makes it easier to read.
                // Redirect to both console and a file.
                sh '''
                    echo "=== BEGIN ENV DUMP ==="
                    printenv | sort | tee env_dump.txt
                    echo "=== END ENV DUMP ==="
                '''
            }
        }
    }

    post {
        // Archive the file so you can download it even if console masking hides ****
        always {
            archiveArtifacts artifacts: 'env_dump.txt', onlyIfSuccessful: false
        }
    }
}
