import {
  GITHUB_COMMITER_EMAIL,
  GITHUB_COMMITER_NAME,
  GITHUB_JS_INDEX,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN,
} from '@/utils/env';

export const getFiles = async (path = '') => {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents${path}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Cache-Control': 'no-cache',
    },
  });
  return response;
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
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}${name}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Update ${name}`,
      committer: {
        name: GITHUB_COMMITER_NAME,
        email: GITHUB_COMMITER_EMAIL,
      },
      content: encodedContents,
      sha,
    }),
  });
  return response;
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
  const indexFile = GITHUB_JS_INDEX;
  const encodedContents = btoa(decodedContents);
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${language}/${indexFile}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      committer: {
        name: GITHUB_COMMITER_NAME,
        email: GITHUB_COMMITER_EMAIL,
      },
      content: encodedContents,
      sha,
    }),
  });
  return response;
};

export const getWorkflows = async () => {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Cache-Control': 'no-cache',
    },
  });
  return response;
};

export const getWorkflowRunById = async (id: string) => {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Cache-Control': 'no-cache',
    },
  });
  return response;
};

export const getWorkflowRunLogsById = async (id: string) => {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs/${id}/logs`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Cache-Control': 'no-cache',
    },
  });
  return response;
};
