# 🧹 Step 4: Cleanup

<div class="duration">⏱ ~5 minutes</div>

<div class="sync-point">
  <span class="sync-icon">🔗</span>
  <span><strong>Sync point</strong> — wait for all team members to finish Steps 2 & 3 before cleaning up.</span>
</div>

To avoid incurring charges on your GCP account, clean up the resources created during this lab.

## Delete Cloud Run service

```bash {codejar}
gcloud run services delete hackathon-app \
  --region={{REGION}} \
  --project={{PROJECT_ID}} \
  --quiet
```

## Delete the container image

```bash {codejar}
gcloud container images delete gcr.io/{{PROJECT_ID}}/hackathon-app \
  --force-delete-tags \
  --quiet
```

## Delete the storage bucket

> ⚠️ **Warning:** This will permanently delete all objects in the bucket `{{BUCKET_NAME}}`. Make sure you've downloaded any files you want to keep.

```bash {codejar}
# Delete all objects and the bucket
gcloud storage rm -r gs://{{BUCKET_NAME}} \
  --project={{PROJECT_ID}}
```

## Delete the service account

```bash {codejar}
gcloud iam service-accounts delete \
  hackathon-sa@{{PROJECT_ID}}.iam.gserviceaccount.com \
  --project={{PROJECT_ID}} \
  --quiet
```

## Verify cleanup

Run this summary to confirm everything is cleaned up:

```bash {codejar-readonly}
echo "Checking cleanup status for project: {{PROJECT_ID}}"
echo "=================================================="
echo ""
echo "Cloud Run services:"
gcloud run services list --region={{REGION}} --project={{PROJECT_ID}} --format="table(name,status)" 2>/dev/null || echo "  (none)"
echo ""
echo "Storage buckets:"
gcloud storage ls --project={{PROJECT_ID}} 2>/dev/null | grep "{{BUCKET_NAME}}" || echo "  Bucket {{BUCKET_NAME}} deleted ✅"
echo ""
echo "Service accounts:"
gcloud iam service-accounts list --project={{PROJECT_ID}} --format="table(email)" 2>/dev/null | grep "hackathon-sa" || echo "  hackathon-sa deleted ✅"
echo ""
echo "🎉 Cleanup complete!"
```

---

## 🎓 What you've learned

In this codelab, you:

1. ⚡ **Set up** your GCP environment with `gcloud` CLI
2. 🪣 **Created** a Cloud Storage bucket and uploaded configuration files
3. 🚀 **Deployed** a containerized Flask app to Cloud Run
4. 🧹 **Cleaned up** all resources to avoid charges

> 🔗 **Continue learning:**
>
> - [Cloud Run Documentation](https://cloud.google.com/run/docs)
> - [Cloud Storage Documentation](https://cloud.google.com/storage/docs)
> - [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud)
