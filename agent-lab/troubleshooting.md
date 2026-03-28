# 😵‍💫 Troubleshooting

Common issues and how to resolve them.

## Authentication Issues

**Issues with authentication?** (e.g., "email missing from service" errors)

Run the following commands to re-authenticate:

```bash {codejar}
gcloud auth login
gcloud auth application-default login
```

<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    If you continue to experience issues after re-authenticating, make sure your service account has all the required IAM roles assigned.
  </div>
</div>
