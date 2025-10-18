pipeline{
    agent any 

    parameters {
        string(name: 'EC2_IP', defaultValue: '', description: 'IP de la instancia EC2')
    }

    stages{

       stage('conected ec2'){
            steps {
                sshagent(['ec2-ssh-key']){
                    sh """
                        ssh -o StrictHostKeyChecking=no ec2-user@${params.EC2_IP} \\
                        "echo 'Conectado a EC2'" 
                       
                    """
                }
            }
       }
    }

}