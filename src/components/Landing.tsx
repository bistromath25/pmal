'use client';

import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/env/env';
import { FunctionCreatePayload } from '@/types/Function';
import {
  getDefaultFunctionValue,
  isValidFunction,
  languageOptions,
} from '@/utils/functions';
import { getDemoQuery } from '@/utils/functions';
import Editor from './Editor';
import Footer from './Footer';
import Header from './Header';
import { DefaultIcon, SuccessIcon } from './Icons';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';

function LandingEditor() {
  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [demoQuery, setDemoQuery] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [alias, setAlias] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isValidFunction(code, 'js')) {
        const payload: FunctionCreatePayload = {
          code,
          language: 'js',
          anonymous: true,
          created_by: null,
          belongs_to: [],
        };
        const {
          fun: { alias },
        } = await API.createFunction(payload);
        setAlias(alias);
        setDemoQuery(getDemoQuery(code, 'js'));
        setCopied(false);
        setError(false);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <Editor
        code={code}
        setCode={setCode}
        language='js'
        error={error}
        setError={setError}
        style={{
          backgroundColor: 'rgb(3, 7, 18)',
        }}
        colorMode='dark'
      />
      <Button onClick={onSubmit} disabled={error || !code}>
        Deploy my function!
      </Button>
      {alias && (
        <>
          <Box sx={{ display: 'flex' }}>
            <TextField
              value={`curl -X GET '${APP_BASE_URL}/api/${alias}?${demoQuery}'`}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (alias) {
                  navigator.clipboard.writeText(
                    `curl -X GET '${APP_BASE_URL}/api/${alias}?${demoQuery}'`
                  );
                  setCopied(true);
                }
              }}
            >
              {copied ? <SuccessIcon /> : <DefaultIcon />}
            </Button>
          </Box>
          <Typography variant='h6'>
            Free functions are automatically deleted after 10 calls.{' '}
            <Link href='/signin' color='inherit' underline='hover'>
              Sign in
            </Link>{' '}
            to get more calls!
          </Typography>
        </>
      )}
    </Box>
  );
}

function LanguageMarquee() {
  return (
    <Marquee autoFill pauseOnHover>
      {languageOptions.map(({ name, logoUrl }) => (
        <img
          className='h-[60px] px-10'
          src={logoUrl}
          key={`language-marquee-${name}`}
        />
      ))}
    </Marquee>
  );
}

export default function Landing() {
  return (
    <Box>
      <Header type='landing' />
      <Box>
        <Typography variant='h1'>
          Deploy{' '}
          <span className='bg-gradient-to-r from-blue-600 via-yellow-200 to-blue-600 inline-block text-transparent bg-clip-text animate-shimmer bg-[length:200%_100%]'>
            Serverless Functions
          </span>
          <br />
          right from your browser
        </Typography>
        <LandingEditor />
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid>
            <Typography variant='h3'>✏️</Typography>
            <Grid>
              <Typography variant='h5'>Edit</Typography>
              <Typography variant='h6'>
                Edit your function in the built-in editor supporting 5+
                languages.
              </Typography>
            </Grid>
          </Grid>
          <Grid>
            <Grid>
              <Typography variant='h3'>🚀</Typography>
            </Grid>
            <Box>
              <Typography variant='h5'>Deploy</Typography>
              <Typography variant='h6'>
                Deploy your function at the click of a button.
              </Typography>
            </Box>
          </Grid>
          <Grid>
            <Grid>
              <Typography variant='h3'>⚡</Typography>
            </Grid>
            <Grid>
              <Typography variant='h5'>Call</Typography>
              <Typography variant='h6'>
                Call your function wherever you want via{' '}
                <span className='font-mono'>GET</span> or{' '}
                <span className='font-mono'>POST</span>.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid>
            <Typography variant='h5'>
              Deploy <span className='bg-green-300'>serverless functions</span>{' '}
              right from your browser using{' '}
              <span className='bg-yellow-200'>GitHub Actions</span> as a
              computing backend.
            </Typography>
          </Grid>
          <Grid>
            <Box
              style={{
                maskImage:
                  'linear-gradient(to right, rgba(248, 251, 253, 0), black 10%, black 90%, rgba(248, 251, 253, 0))',
                maskType: 'alpha',
              }}
            >
              <LanguageMarquee />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography variant='h5'>Where performance meets simplicity</Typography>
        <Typography variant='h6'>
          <span className='font-bold'>Each function invocation</span> triggers
          its own containerized workflow through GitHub Actions, delivering an
          event-driven architecture powered by some of the toughest machines
          available. <span className='font-bold'>Function arguments</span> are
          provided through query parameters, enabling seamless integration with
          webhooks, APIs, and other event sources.
        </Typography>
      </Box>
      <Box>
        <Typography variant='h4'>
          🔓 Unlock limitless possibilities with{' '}
          <span className='font-bold'>{'GitHub Actions Lambda 🔑'}</span>
        </Typography>
        <Typography variant='h5'>
          <Link href='/signin' color='inherit' underline='hover'>
            Sign in
          </Link>{' '}
          to gain <span className='font-bold'>full access</span> to PMAL,
          including our <span className='font-bold'>API</span>.
        </Typography>
      </Box>
      <Footer type='landing' />
    </Box>
  );
}
