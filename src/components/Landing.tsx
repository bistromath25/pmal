'use client';

import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import * as API from '@/app/api/api';
import { APP_BASE_URL } from '@/env/env';
import useWrappedRequest from '@/hooks/useWrappedRequest';
import theme from '@/theme/theme';
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
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';

function LandingEditor() {
  const { wrappedRequest } = useWrappedRequest();
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
        } = await wrappedRequest(() => API.createFunction(payload));
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
    <Stack spacing={2}>
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
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={error || !code}
          loading={loading}
        >
          Deploy my function!
        </Button>
      </Box>
      {alias && (
        <Stack
          spacing={1}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {/* <TextField
              value={`curl -X GET '${APP_BASE_URL}/api/${alias}?${demoQuery}'`}
              sx={{
                minWidth: 560,
                // backgroundColor: theme.colors.black,
              }}
              slotProps={{
                input: {
                  readOnly: true,
                  color: 'primary'
                },
              }}
            /> */}
            <input
              className={`bg-slate-950 text-white text-sm border border-e-0 ${`border-${theme.colors.lightblue}`} rounded-s-lg block w-full p-2.5 overflow-x-scroll line-clamp-1 focus:outline-none`}
              style={{
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                minWidth: '560px',
              }}
              value={`curl -X GET '${APP_BASE_URL}/api/${alias}?${demoQuery}'`}
              readOnly
            />
            <Button
              sx={{
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                border: 1,
                borderLeft: 0,
              }}
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
          <Typography
            variant='h6'
            sx={{ filter: 'invert(1)', mixBlendMode: 'difference' }}
          >
            Free functions are automatically deleted after 10 calls.{' '}
            <Link href='/signin' color='inherit' underline='hover'>
              Sign in
            </Link>{' '}
            to get more calls!
          </Typography>
        </Stack>
      )}
    </Stack>
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
      <Stack>
        <Stack
          spacing={4}
          sx={{
            py: 10,
          }}
          className='sm:bg-[linear-gradient(170deg,_rgb(0_0_0)_48%,_rgb(255_255_255)_48%)] bg-fixed'
        >
          <Typography
            variant='h2'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.colors.white,
            }}
          >
            Deploy{' '}
            <span className='bg-gradient-to-r from-blue-600 via-yellow-200 to-blue-600 inline-block text-transparent bg-clip-text animate-shimmer bg-[length:200%_100%]'>
              Serverless Functions
            </span>
            <br />
            right from your browser
          </Typography>
          <Box sx={{ px: '20%' }}>
            <LandingEditor />
          </Box>
        </Stack>
        <Box sx={{ px: '5%', py: 4, backgroundColor: theme.colors.offwhite }}>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid sx={{ display: 'flex', gap: 2, maxWidth: '30%' }}>
              <Typography variant='h3' sx={{ my: 'auto' }}>
                ✏️
              </Typography>
              <Stack>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  Edit
                </Typography>
                <Typography variant='h6'>
                  Edit your function in the built-in editor supporting 5+
                  languages.
                </Typography>
              </Stack>
            </Grid>
            <Grid sx={{ display: 'flex', gap: 2, maxWidth: '30%' }}>
              <Typography variant='h3' sx={{ my: 'auto' }}>
                🚀
              </Typography>
              <Stack>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  Deploy
                </Typography>
                <Typography variant='h6'>
                  Deploy your function at the click of a button.
                </Typography>
              </Stack>
            </Grid>
            <Grid sx={{ display: 'flex', gap: 2, maxWidth: '30%' }}>
              <Typography variant='h3' sx={{ my: 'auto' }}>
                ⚡
              </Typography>
              <Stack>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  Call
                </Typography>
                <Typography variant='h6'>
                  Call your function wherever you want via{' '}
                  <span className='font-mono'>GET</span> or{' '}
                  <span className='font-mono'>POST</span>.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ px: '10%', py: 10 }}>
          <Typography variant='h4' sx={{ textAlign: 'justify' }}>
            Deploy <span className='bg-green-300'>serverless functions</span>{' '}
            right from your browser using{' '}
            <span className='bg-yellow-200'>GitHub Actions</span> as a computing
            backend.
          </Typography>
          {/* <Grid container spacing={2}>
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
        </Grid> */}
        </Box>
        <Box sx={{ px: '10%', py: 4, backgroundColor: theme.colors.offwhite }}>
          <Typography
            variant='h5'
            sx={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            Where performance meets simplicity
          </Typography>
          <Typography variant='h6'>
            <span className='font-bold'>Each function invocation</span> triggers
            its own containerized workflow through GitHub Actions, delivering an
            event-driven architecture powered by some of the toughest machines
            available. <span className='font-bold'>Function arguments</span> are
            provided through query parameters, enabling seamless integration
            with webhooks, APIs, and other event sources.
          </Typography>
        </Box>
        <Box sx={{ px: '10%', py: 10 }}>
          <Typography variant='h4' sx={{ textAlign: 'center' }}>
            🔓 Unlock limitless possibilities with{' '}
            <span className='font-bold'>{'GitHub Actions Lambda 🔑'}</span>
          </Typography>
          <Typography variant='h5' sx={{ textAlign: 'center' }}>
            <Link href='/signin' color='inherit' underline='hover'>
              Sign in
            </Link>{' '}
            to gain <span className='font-bold'>full access</span> to PMAL,
            including our <span className='font-bold'>API</span>.
          </Typography>
        </Box>
      </Stack>
      <Footer type='landing' />
    </Box>
  );
}
