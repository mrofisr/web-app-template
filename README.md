# web-app template

minimalistic typescript web app

- `docker-compose up` launch app
- `docker-compose build` build app
- http://localhost front-end entry
- http://localhost:4000 back-end api endpoint

## Setup GitHub Actions (Secrets and IAM Google Cloud)
- Create a new service account in Google Cloud IAM

```bash
export PROJECT_ID="your-project-id"

gcloud iam service-accounts create \
    "cloud-run-sa" \
    --project="${PROJECT_ID}" \
    --description="Cloud Run Service Account" \
    --display-name="Cloud Run Service Account"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:cloud-run-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.repoAdmin,roles/run.developer"
```

- Create a new Workload Identity Pool

```bash
gcloud iam workload-identity-pools create "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools describe "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --format="value(name)"

gcloud iam workload-identity-pools providers create-oidc "github-repo-provider" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="My GitHub repo Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner,attribute.repository_id=assertion.repository_id" \
  --issuer-uri="https://token.actions.githubusercontent.com"

export SA_EMAIL="cloud-run-sa@${PROJECT_ID}.iam.gserviceaccount.com"
export WORKLOAD_POOL=`gcloud iam workload-identity-pools describe "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --format="value(name)"`

gcloud iam service-accounts add-iam-policy-binding ${SA_EMAIL} \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_POOL}/attribute.repository/${REPO_OWNER}/${REPO_NAME}"
```
