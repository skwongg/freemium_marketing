Sandbox for python fastapi environment development using docker, docker compose and kubernetes (minikube)


# rundocs:
### ***if you have an older incompatible version of minikube you may need to nuke your old settings with `minikube delete --all --purge`

## from the root of the dir:


## docker compose testing:
#### docker volume create ollama-local
#### docker volume create open-webui-local
#### docker compose build
#### docker compose up 
#### check localhost:8000 and localhost:8000/hello endpoints


## kubernetes minikube testing:
#### REMOVED FOR NOW. kubeconfigs will be added back later.