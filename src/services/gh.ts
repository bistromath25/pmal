import { env } from '@/env';

const githubHeaders = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${env.GITHUB_TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const fetchFromGitHub = async (url: string, options: FetchOptions = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...githubHeaders,
      ...options.headers,
    },
  });
};

export const getFiles = async (path = '') => {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents${path}`;
  return await fetchFromGitHub(url, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
};

export const updateFile = async (
  {
    name,
    decodedContents,
    sha,
  }: {
    name: string;
    decodedContents: string;
    sha: string;
  },
  path = ''
) => {
  const encodedContents = btoa(decodedContents);
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}${name}`;
  return await fetchFromGitHub(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Update ${name}`,
      committer: {
        name: env.GITHUB_COMMITER_NAME,
        email: env.GITHUB_COMMITER_EMAIL,
      },
      content: encodedContents,
      sha,
    }),
  });
};

export const updateIndexFile = async ({
  decodedContents,
  sha,
  language,
  commitMessage,
}: {
  decodedContents: string;
  sha: string;
  language: string;
  commitMessage: string;
}) => {
  const indexFile = env.GITHUB_JS_INDEX;
  const encodedContents = btoa(decodedContents);
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${language}/${indexFile}`;
  return await fetchFromGitHub(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      committer: {
        name: env.GITHUB_COMMITER_NAME,
        email: env.GITHUB_COMMITER_EMAIL,
      },
      content: encodedContents,
      sha,
    }),
  });
};

export const getWorkflows = async () => {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/runs`;
  return await fetchFromGitHub(url, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
};

export const getWorkflowRunById = async (id: number) => {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/runs/${id}`;
  return await fetchFromGitHub(url, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
};

export const getWorkflowRunLogsById = async (id: number) => {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/runs/${id}/logs`;
  return await fetchFromGitHub(url, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
};
