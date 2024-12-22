## GitHub Actions Lambda

> Deploy serverless functions directly from your browser using GitHub Actions as a computing backend. Built with Next.js and Supabase.

GitHub Actions provide containerized, multi-language environments suitable for executing serverless functions in many languages including Node.js and Python. This implementation triggers a new workflow for each function call, resulting in response times that account for setup and teardown; a more efficient approach could involve reusing workflows and build caches by re-triggering the same job for frequent or complex function calls.

[Demo](https://pmal.vercel.app/)
