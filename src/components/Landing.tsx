'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import * as API from '@/app/api';
import { useApp } from '@/contexts/app';
import { env } from '@/env';
import { getDefaultFunctionValue, getDemoQuery } from '@/utils';
import Editor from './Editor';
import Footer from './Footer';
import Header from './Header';
import BoltIcon from '@mui/icons-material/Bolt';
import BuildIcon from '@mui/icons-material/Build';
import CheckIcon from '@mui/icons-material/Check';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { green, yellow } from '@mui/material/colors';

export default function Landing() {
  return (
    <Box>
      <Header />
      <Stack>
        <Hero />
        <Steps />
        <About1 />
        <Features />
        <About2 />
      </Stack>
      <Footer />
    </Box>
  );
}

function Hero() {
  return (
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
          color: 'background.paper',
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
  );
}

function LandingEditor() {
  const { loading, wrappedRequest } = useApp();
  const [code, setCode] = useState(getDefaultFunctionValue('js'));
  const [demoQuery, setDemoQuery] = useState<string | undefined>(undefined);
  const [alias, setAlias] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const onSubmit = async () => {
    await wrappedRequest(async () => {
      const {
        data: { alias },
      } = await API.createFunction({
        code,
        language: 'js',
        anonymous: true,
      });
      setAlias(alias);
      setDemoQuery(getDemoQuery(code, 'js'));
      setCopied(false);
    });
  };
  return (
    <Stack spacing={2}>
      <Editor code={code} setCode={setCode} language='js' onSave={() => {}} />
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={!code}
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
            <input
              className='bg-slate-950 text-white text-sm border border-e-0 border-[#dbeafe] rounded-s-lg block w-full p-2.5 overflow-x-scroll line-clamp-1 focus:outline-none'
              style={{
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                minWidth: '560px',
              }}
              value={`curl -X GET '${env.APP_BASE_URL}/api/${alias}?${demoQuery}'`}
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
                    `curl -X GET '${env.APP_BASE_URL}/api/${alias}?${demoQuery}'`
                  );
                  setCopied(true);
                }
              }}
            >
              {copied ? <CheckIcon /> : <ContentCopyIcon />}
            </Button>
          </Box>
          <Typography
            variant='h6'
            sx={{ filter: 'invert(1)', mixBlendMode: 'difference' }}
          >
            Free functions are automatically deleted after 10 calls.{' '}
            <Link
              component={NextLink}
              href='/signin'
              color='primary.main'
              underline='hover'
            >
              Sign in
            </Link>{' '}
            to get more calls!
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

function Steps() {
  return (
    <Section px='10%' py={4} bg='background.paper'>
      <Grid container spacing={2} justifyContent='center'>
        <FeatureCard
          emoji='✏️'
          title='Edit'
          description='Edit your function in the built-in editor supporting 5+ languages.'
        />
        <FeatureCard
          emoji='🚀'
          title='Deploy'
          description='Deploy your function at the click of a button.'
        />
        <FeatureCard
          emoji='⚡'
          title='Call'
          description={
            <>
              Call your function wherever you want via{' '}
              <Box component='span' fontFamily='monospace'>
                GET
              </Box>{' '}
              or{' '}
              <Box component='span' fontFamily='monospace'>
                POST
              </Box>
              .
            </>
          }
        />
      </Grid>
    </Section>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <Grid sx={{ display: 'flex', gap: 2, maxWidth: '30%' }}>
      <Typography variant='h3' sx={{ my: 'auto' }}>
        {emoji}
      </Typography>
      <Stack>
        <Typography variant='h5' fontWeight='bold'>
          {title}
        </Typography>
        <Typography variant='h6' color='text.secondary'>
          {description}
        </Typography>
      </Stack>
    </Grid>
  );
}

function About1() {
  return (
    <Section py={10} textAlign='justify'>
      <Typography variant='h4'>
        Deploy{' '}
        <Box
          component='span'
          sx={{ backgroundColor: green[200], px: 0.5, borderRadius: 1 }}
        >
          serverless functions
        </Box>{' '}
        right from your browser using{' '}
        <Box
          component='span'
          sx={{ backgroundColor: yellow[200], px: 0.5, borderRadius: 1 }}
        >
          GitHub Actions
        </Box>{' '}
        as a computing backend.
      </Typography>
    </Section>
  );
}

const features = [
  {
    icon: <BoltIcon fontSize='large' />,
    title: 'Fast Execution',
    description: 'Run your functions with minimal cold start latency.',
  },
  {
    icon: <LockIcon fontSize='large' />,
    title: 'Secure',
    description: 'Your code runs in isolated containers for maximum security.',
  },
  {
    icon: <PublicIcon fontSize='large' />,
    title: 'Multi-Region',
    description: 'Deploy functions close to your users worldwide.',
  },
  {
    icon: <BuildIcon fontSize='large' />,
    title: 'Easy Integration',
    description: 'Connect with APIs, webhooks, and existing workflows.',
  },
  {
    icon: <TrendingUpIcon fontSize='large' />,
    title: 'Scalable',
    description: 'Automatically scales with your traffic and demand.',
  },
  {
    icon: <CodeIcon fontSize='large' />,
    title: 'Multi-Language',
    description: 'Supports Node.js, Python, PHP, and more.',
  },
];

function Features() {
  return (
    <Section py={4} bg='background.paper'>
      <Typography
        variant='h4'
        sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
      >
        Designed for simplicity.
      </Typography>

      <Grid container spacing={4} justifyContent='center'>
        {features.map(({ icon, title, description }, index) => (
          <Grid key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Stack direction='row' spacing={2} color='primary.main'>
              {icon}
              <Box maxWidth='300px'>
                <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
                  {title}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {description}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}

function About2() {
  return (
    <Box py={10} textAlign='center'>
      <Typography variant='h4'>
        🔓 Unlock limitless possibilities with{' '}
        <Box component='span' fontWeight='bold'>
          GitHub Actions Lambda 🔑
        </Box>
      </Typography>
      <Typography variant='h5'>
        <Link
          component={NextLink}
          href='/signin'
          color='primary.main'
          underline='hover'
        >
          Sign in
        </Link>{' '}
        to gain{' '}
        <Box component='span' fontWeight='bold'>
          full access
        </Box>{' '}
        to PMAL, including our{' '}
        <Box component='span' fontWeight='bold'>
          API
        </Box>
        .
      </Typography>
    </Box>
  );
}

function Section({
  children,
  px = '10%',
  py = 10,
  color = 'text.primary',
  bg = 'transparent',
  textAlign = 'left',
}: {
  children: React.ReactNode;
  px?: string;
  py?: number;
  color?: string;
  bg?: string;
  textAlign?: 'left' | 'center' | 'justify';
}) {
  return (
    <Box sx={{ px, py, color, backgroundColor: bg }}>
      <div style={{ textAlign }}>{children}</div>
    </Box>
  );
}
