pipeline {
    agent any
    environment {
        IMAGE_NAME = 'your-image-name'
        CONTAINER_NAME = 'your-container-name'
        HOST_PORT = '8081'
    }
    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/janardhan19-git/jenkins-repo.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh '''
                # List files to verify we have the repository content
                echo "Files in the build directory:"
                ls -la
                
                # Build the Docker image using the current directory (with the cloned repo)
                docker build -t $IMAGE_NAME:latest .
                '''
            }
        }
        
        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }
        
        stage('Deploy New Container') {
            steps {
                sh '''
                docker run -d --name $CONTAINER_NAME -p $HOST_PORT:80 $IMAGE_NAME:latest
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Container is running at http://localhost:$HOST_PORT"
                docker ps | grep $CONTAINER_NAME
                echo "Container logs:"
                docker logs $CONTAINER_NAME
                '''
            }
        }
    }
}
