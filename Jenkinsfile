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
                    sh """
# Permiso seguro para la llave 
chmod 600 "$SSH_KEY_FILE"

# Limpiar host antiguos 
ssh-keygen -f "/var/lib/jenkins/.ssh/known_hosts" -R "${params.EC2_IP}" || true

# Conectarse a EC2
ssh -i "$SSH_KEY_FILE" -o StrictHostKeyChecking=no "$EC2_USER"@"${params.EC2_IP}" << 'EOF'
set -e
echo "Conectado a EC2"

# Actualizar 
sudo apt update -y 
cd /home/ubuntu

# Clonar o actualizar solo la rama develop
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

# Instalar Docker 
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Agregar el repositorio de Docker
cat <<DOCKER_REPO | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable
DOCKER_REPO

# Instalar Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Agregar el usuario actual (ubuntu) al grupo docker
sudo usermod -aG docker ubuntu

# Aplicar el cambio de grupo inmediatamente
newgrp docker <<INNER_EOF
docker --version
docker ps
INNER_EOF

echo "Docker instalado y usuario agregado al grupo correctamente."

EOF
"""
                }
            }
        }
    }

    post {
        success {
            echo "Se conectó correctamente a EC2"
        }
        failure {
            echo "No se pudo conectar a EC2"
        }
    }
}
