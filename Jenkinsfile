pipeline {
    agent any
    
    parameters {
        string(name: 'EC2_IP', defaultValue: '', description: 'IP de la instancia EC2')
        string(name: 'CREDENTIAL_ID', defaultValue: '', description: 'ID de la clave SSH en Jenkins')
    }
    
    stages {
        stage('conected ec2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: params.CREDENTIAL_ID,
                        keyFileVariable: 'SSH_KEY_FILE',
                        usernameVariable: 'EC2_USER'
                    )
                ]) {
                    sh '''
                        chmod 600 "$SSH_KEY_FILE"
                        ssh-keygen -f "/var/lib/jenkins/.ssh/known_hosts" -R "''' + params.EC2_IP + '''" || true
                        ssh -i "$SSH_KEY_FILE" -o StrictHostKeyChecking=no "$EC2_USER"@"''' + params.EC2_IP + '''" << 'ENDSSH'
set -e
echo "Conectado a EC2"

sudo apt-get update -y

cd /home/ubuntu

if [ -d "ci-cd-practice" ]; then
    echo "Repositorio ya existe, actualizando rama develop..."
    cd ci-cd-practice
    git fetch origin develop
    git checkout develop
    git pull origin develop
else
    echo "Clonando solo la rama develop..."
    git clone -b develop --single-branch https://github.com/KiritoKazut0/ci-cd-practice.git ci-cd-practice
    cd ci-cd-practice
fi

if ! docker --version >/dev/null 2>&1 || ! systemctl is-active --quiet docker 2>/dev/null; then
    echo "Instalando Docker..."
    
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc
    
    echo "deb [arch=\\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \\$(. /etc/os-release && echo \\$VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    sudo usermod -aG docker ubuntu
    sudo systemctl start docker
    sudo systemctl enable docker
    
    echo "Docker instalado correctamente."
    sudo docker --version
    sudo docker compose version
else
    echo "Docker ya esta instalado y funcionando"
    docker --version
    docker compose version
fi

echo "Proceso completado exitosamente"
ENDSSH
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo "Se conecto correctamente a EC2 y Docker esta configurado"
        }
        failure {
            echo "Fallo la conexion o configuracion en EC2"
        }
    }
}