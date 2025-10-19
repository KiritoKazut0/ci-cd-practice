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

EOF
"""
                }
            }
        }
    }

    post {
        success {
            echo "Se conecto correctamente a Ec2"
        }

        failure {
            echo "No se pudo conectar a EC2"
        }
    }
}
