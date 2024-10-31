Sandbox for python fastapi environment development using docker, docker compose and kubernetes (minikube)


# rundocs:
### ***if you have an older incompatible version of minikube you may need to nuke your old settings with `minikube delete --all --purge`

## from the root of the dir:



## docker compose testing:
#### docker compose build
#### docker compose up 
#### check localhost:8000 and localhost:8000/hello endpoints



## kubernetes minikube testing:
#### minikube start
#### docker build -t fastapi-hello-world:latest .
#### kubectl apply -f k8s/deployment.yaml
#### kubectl apply -f k8s/service.yaml
#### minikube service fastapi-hello-world




#### this should redirect you to a tunnel of the root fastapi page.

#### if you run into issues with minikube build hanging or tunneling try running `eval $(minikube -p minikube docker-env)` 
#### from a sterile terminal to point your shell to minikube's docker-daemon. <3