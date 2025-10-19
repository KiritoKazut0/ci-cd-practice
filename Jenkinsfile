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

# Verificar si Docker ya esta Instalado
if ! command -v docker &>/dev/null; then

sudo apt-get update -y
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo sh -c 'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" > /etc/apt/sources.list.d/docker.list'
sudo apt-get update -y
echo "Docker instalado y usuario agregado al grupo correctamente."
else
    echo "Docker ya esta instalado"
fi
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
