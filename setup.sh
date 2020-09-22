
# do_setup(){
#     local status=$( docker ps -a -f name=$1 --format "{{.Status}}" | cut -d ' ' -f 1 );
#     [ "$status" = "" ]       && { echo "Running... $1";  docker run --name $1 $2; }
#     [ "$status" = "Exited" ] && { echo "Starting... $1"; docker start $1;         }
#     [ "$status" = "Up" ]     && { echo "Stopping... $1"; docker stop $1;          }
#     sleep 3
# }

# do_setup "postgres" "-p 5432:5432 -e POSTGRES_USER=patrique -e POSTGRES_PASSWORD=minhasenhasecreta -e POSTGRES_DB=heroes -d postgres"
# do_setup "adminer" "-p 8080:8080 --link postgres:postgres -d adminer"
# do_setup "mongodb" "-p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -d mongo:4"
# do_setup "mongoclient" "-p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient"

do_run(){
  docker run --name postgres -p 5432:5432 -e POSTGRES_USER=patrique -e POSTGRES_PASSWORD=minhasenhasecreta -e POSTGRES_DB=heroes -d postgres
  docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer
  docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -d mongo:4
  docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient
}

do_start(){
  docker start postgres
  docker start adminer
  docker start mongodb
  docker start mongoclient
}

do_stop(){
  docker stop adminer
  docker stop postgres
  docker stop mongoclient
  docker stop mongodb
}

do_rm(){
  docker rm $(docker ps -aq -f name=postgres -f name=adminer -f name=mongodb -f name=mongoclient)
}

do_rmi(){
  docker rmi $(docker images -aq -f reference=postgres -f reference=adminer -f reference='mongo' -f reference='mongoclient/mongoclient')
}

do_init(){
  #docker exec -it mongodb mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin --eval "db.getSiblingDB('heroes').createUser({user: 'patrique', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'heroes'}]})"
  npm i
}

[ "$1" = "run" ]   && { echo "Running containers...";  do_run;   exit 0; }
[ "$1" = "start" ] && { echo "Starting containers..."; do_start; exit 0; }
[ "$1" = "stop" ]  && { echo "Stopping containers..."; do_stop;  exit 0; }
[ "$1" = "rm" ]    && { echo "Removing containers..."; do_rm;    exit 0; }
[ "$1" = "rmi" ]   && { echo "Removing images...";     do_rmi;   exit 0; }
[ "$1" = "init" ]  && { echo "Initializing...";        do_init;  exit 0; }
