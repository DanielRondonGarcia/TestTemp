### **Analysis and Initial Configuration**

1. **Understanding the Project and Requirements:**
   - The project consists of unit tests written in JavaScript using Jest to validate the functionality of `Client.js`.  
   - The source code is hosted on GitHub, and my goal was to automate the process of running tests using Jenkins.

2. **Repository Location:**
   - I haved to know where is the code, but didnt find it, so I created a new repository named `TestTemp` to simulate the project.
   - I configured Jenkins to check out the code from the main branch (`main`).

---

### **Jenkinsfile Configuration**

#### **Pipeline Declaration**

- I used the declarative syntax of Jenkinsfile to define the pipeline.
- The `pipeline` block specifies that any Jenkins agent can execute the stages.

   ```groovy
   pipeline {
       agent any
   ```

#### **Pipeline Options**

- I added some important options:
  - **`preserveStashes`**: Keeps stashes for up to 5 consecutive builds.
  - **`skipDefaultCheckout(true)`**: Prevents the automatic checkout of the repository, as I perform it manually in the `Setup` stage.
  - **`disableConcurrentBuilds()`**: Ensures that Jenkins does not run multiple builds concurrently for the same pipeline, avoiding resource conflicts.

   ```groovy
       options {
           preserveStashes buildCount: 5
           skipDefaultCheckout(true)
           disableConcurrentBuilds()
       }
   ```

#### **Pipeline Stages**

1. **Stage `Setup`: Environment Preparation**

   - Cleans the workspace using `cleanWs()`.
   - Configures the repository directory as a safe location for Git operations (this is necessary in Jenkins to avoid security warnings about unknown directories).
   - Performs the checkout of the code from the `main` branch, using `GitHubDaniel` credentials for authentication.

   ```groovy
   stage('Setup') {
       steps {
           cleanWs()
           sh 'git config --global --add safe.directory /var/jenkins_home/workspace/TestTemp'
           checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'GitHubDaniel', url: 'https://github.com/DanielRondonGarcia/TestTemp.git']])
       }
   }
   ```

2. **Stage `HelloWorld`: Verify the Execution Environment**

   - This stage runs in a Docker container using the `node:20-alpine` image.  
   - It verifies the installed Node.js version to ensure the environment is correctly set up.

   ```groovy
   stage('HelloWorld') {
       agent {
           docker {
               image 'node:20-alpine'
               reuseNode true
           }
       }
       steps {
           sh 'node --version'
       }
   }
   ```

3. **Stage `Install Dependencies`: Install Node.js Dependencies**

   - This stage also runs in a Docker container with the `node:20-alpine` image.  
   - It executes `npm install` to install the project dependencies.

   ```groovy
   stage('Install Dependencies') {
       agent {
           docker {
               image 'node:20-alpine'
               reuseNode true
           }
       }
       steps {
           sh 'npm install'
       }
   }
   ```

4. **Stage `Run Tests`: Execute Jest Tests**

   - This stage runs in a Docker container with the `node:20-alpine` image, similar to previous stages.
   - It executes the tests using the `npm run test:ci` command, which is configured in the `package.json` to generate the JUnit report.
   - Once the tests are completed, the JUnit report (`junit.xml`) is published using Jenkins' JUnit plugin.

   ```groovy
   stage('Run Tests') {
       agent {
           docker {
               image 'node:20-alpine'
               reuseNode true
           }
       }
       steps {
           sh 'npm run test:ci'
       }
       post {
           always {
               junit 'junit.xml'
           }
       }
   }
   ```

#### **Post Actions**

- Regardless of whether the build succeeds or fails, the workspace is cleaned up at the end of each build to maintain a clean environment for future executions.

   ```groovy
   post {
       always {
           cleanWs(cleanWhenNotBuilt: false,
                   deleteDirs: true,
                   disableDeferredWipeout: true,
                   notFailBuild: true)
       }
   }
   ```

