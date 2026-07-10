# 🚕 RideNow --- Cab Booking App

production-style full-stack cab booking application built with **React (Vite)**, **Node.js/Express**, **MongoDB Atlas**, **Docker**, **Kubernetes (Kustomize)**, **NGINX Ingress**, **Argo CD (GitOps)** and **Prometheus/Grafana**.

# Features

- JWT Authentication
- User/Admin roles
- Cab booking workflow
- Ride history
- Responsive React UI
- REST APIs
- MongoDB Atlas
- Dockerized client/server
- Kubernetes manifests with Kustomize
- Argo CD GitOps deployment
- Horizontal Pod Autoscaler (HPA)
- PodDisruptionBudget (PDB)
- Network Policies
- Prometheus ServiceMonitor & PrometheusRule
- Grafana dashboard ConfigMap

## Architecture

``` text
Browser
   │
   ▼
Nginx (Frontend Container)
   │
   ├── React Static Files
   └── /api
         │
         ▼
Express API (Backend Container)
         │
         ▼
MongoDB Atlas
Prometheus ---> Metrics
Grafana ------> Dashboards
Argo CD ------> GitHub Repository
```

## Tech Stack

### Frontend

-   React
-   Vite
-   Axios
-   React Router
-   Framer Motion

### Backend

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   JWT

### DevOps

-   Docker
-   Docker Compose
-   Nginx
-   GitHub Actions (CI/CD ready)

## Project Structure

``` text
cab-booking/
├── .github/
│   └── workflows/
│       ├── client.yml
│       └── server.yml
├── client/
├── server/
├── nginx/
│   └── nginx.conf
├── k8s/
│   ├── client/
│   │   ├── configmap.yaml
│   │   ├── deployment.yaml
│   │   ├── hpa.yaml
│   │   ├── kustomization.yaml
│   │   ├── networkpolicy.yaml
│   │   ├── pdb.yaml
│   │   └── service.yaml
│   ├── server/
│   │   ├── configmap.yaml
│   │   ├── deployment.yaml
│   │   ├── hpa.yaml
│   │   ├── kustomization.yaml
│   │   ├── networkpolicy.yaml
│   │   ├── pdb.yaml
│   │   └── service.yaml
│   ├── ingress/
│   │   ├── ingress.yaml
│   │   └── kustomization.yaml
│   ├── monitoring/
│   │   ├── grafana-dashboard-configmap.yaml
│   │   ├── prometheusrule.yaml
│   │   ├── servicemonitor.yaml
│   │   └── kustomization.yaml
│   ├── security/
│   │   ├── client-serviceaccount.yaml
│   │   ├── server-serviceaccount.yaml
│   │   └── kustomization.yaml
│   ├── secrets/
│   │   └── kustomization.yaml
│   ├── namespace.yaml
│   └── kustomization.yaml
├── docker-compose.yml
├── docker-compose-prod.yml
├── .env.example
├── README.md
└── .gitignore
```
# Local Development

```bash
git clone <repo>
cd cab-booking

cd server
npm install
npm run dev
```

New terminal:

```bash
cd client
npm install
npm run dev
```

---

Vite proxies `/api` requests to the backend.

# GitHub Actions Secrets

Configure the following in:

**GitHub → Settings → Secrets and variables → Actions → Secrets**

| Secret Name |
 DOCKER_USERNAME (in Secrets)
 DOCKER_PASSWORD (in Varibales)
 EC2_HOST (in Secrets)
 EC2_USER (in Secrets)
 EC2_SSH_KEY (in Secrets)
 MONGO_URI (in Secrets)
 JWT_SECRET (in Secrets)

---

## Docker

Build and start everything:

``` bash
docker compose up 
```

Stop:

``` bash
docker compose down
```

Application:

-   Frontend: http://localhost:5173
-   Backend: http://localhost:5005

## Docker Compose

The compose setup includes:

-   Frontend container
-   Backend container
-   Bridge network
-   Environment variable substitution
-   Restart policies

## Environment Variables

Create a root `.env` from `.env.example` and change all the values with actual values

---

# Setup Minikube CLuster

## Install Minikube 
``` bash
brew install minikube
```

## Start Minikube
``` bash
minikube start
```
## Verify cluster

``` bash
kubectl cluster-info

kubectl get nodes
```

## Enable Metrics Server
``` bash
minikube addons enable metrics-server
```

## Enable Ingress
``` bash
minikube addons enable ingress
```

## Install the Kubernetes CLI (kubectl)
``` bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

# Kubernetes Deployment

## Apply everything

```bash
kubectl apply -k k8s/
```

## Delete everything

```bash
kubectl delete -k k8s/
```

---

# Create Secret (Required)

`server-secret` is intentionally **not stored in Git**.

```bash
kubectl create secret generic server-secret \
-n cab-booking \
--from-literal=MONGO_URI="YOUR_MONGO_URI" \
--from-literal=JWT_SECRET="YOUR_JWT_SECRET"
```

```bash
For Production environment you use below secret management solutions to store secrets

Use a secret management solution such as:

AWS Secrets Manager + External Secrets Operator
HashiCorp Vault
Bitnami Sealed Secrets

Verify:

```bash
kubectl get secret -n cab-booking
```

---

# Verify Resources

## Verify Pods
``` bash
kubectl get pods -n ingress-nginx
kubectl get pods -n kube-system
```

```bash
kubectl get all -n cab-booking
kubectl get ingress -n cab-booking
kubectl get hpa -n cab-booking
kubectl get networkpolicy -n cab-booking
kubectl get pdb -n cab-booking
```

---

# Argo CD

Install:

```bash
kubectl create namespace argocd

kubectl apply -n argocd \
-f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Port-forward:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
-o jsonpath="{.data.password}" | base64 -d
```

Create app:

```bash
kubectl apply -f argocd/application.yaml
```

Sync:

```bash
argocd app sync cab-booking
```

---

# Monitoring

Install kube-prometheus-stack:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
-n monitoring \
--create-namespace
```

Apply custom monitoring:

```bash
kubectl apply -f k8s/monitoring/
```

Grafana:

```bash
kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80
```

Prometheus:

```bash
kubectl port-forward svc/monitoring-kube-prometheus-prometheus \
-n monitoring 9090
```

---

# Deployment Workflow

```text
Developer
   │
git push
   │
GitHub
   │
Argo CD detects change
   │
Sync
   │
Kubernetes
   │
Pods Updated
```

---

# Useful Kubenrates Commands

```
kubectl get all -A

kubectl get pods -A

kubectl get svc -A

kubectl get ingress -A

kubectl top pods -A

kubectl top nodes

kubectl logs deployment/server-deployment -n cab-booking

kubectl describe pod <pod-name> -n cab-booking

kubectl rollout restart deployment/server-deployment -n cab-booking

kubectl delete -k k8s

kubectl apply -k k8s
```
---

# ArgoCD Commands

```
kubectl apply -f k8s/argocd/project.yaml

kubectl apply -f k8s/argocd/application.yaml

kubectl get applications -n argocd

kubectl describe application cab-booking -n argocd

```



# Troubleshooting

| Problem | Solution |
|---------|----------|
| CreateContainerConfigError | Create `server-secret` |
| ImagePullBackOff | Verify image exists on Docker Hub |
| HPA shows `<unknown>` | Ensure Metrics Server is installed |
| Ingress unavailable | Verify NGINX Ingress Controller |
| Argo CD path error | Confirm `spec.source.path` points to `k8s` |

---

# Best Practices

- Never commit secrets.
- Keep manifests declarative.
- Use Kustomize as deployment entry point.
- Store secrets separately (Secret, External Secrets, or Vault).
- Use GitOps with Argo CD.
- Enable monitoring and alerts.
- Use resource requests/limits.
- Review NetworkPolicies before production.

---

## License

MIT
