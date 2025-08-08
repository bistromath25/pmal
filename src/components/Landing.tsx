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
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';

export default function Landing() {
  return (
    <Box>
      <Header showNav />
      <Stack>
        <Hero />
        <Steps />
        <About1 />
        <Features />
        <CTA />
      </Stack>
      <Footer />
    </Box>
  );
}

function Hero() {
  return (
    <Box
      id='hero'
      className='hero-grid-bg'
      sx={{
        background:
          'linear-gradient(160deg, #0a0a14 0%, #0d1117 60%, #0a0a0a 100%)',
        py: { xs: 12, md: 16 },
        px: { xs: 3, md: '10%' },
        pt: { xs: 14, md: 18 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Stack spacing={3} alignItems='center' className='animate-fade-in-up'>
        <Stack
          direction='row'
          spacing={1}
          flexWrap='wrap'
          justifyContent='center'
          useFlexGap
        >
          {[
            { label: 'JavaScript', logo: '/logos/nodejs.png' },
            { label: 'Python', logo: '/logos/python.png' },
            { label: 'PHP', logo: '/logos/php.png' },
            { label: 'Ruby', logo: '/logos/ruby.png' },
          ].map(({ label, logo }) => (
            <Chip
              key={label}
              avatar={
                <Box
                  component='img'
                  src={logo}
                  alt={label}
                  sx={{
                    width: '16px !important',
                    height: '16px !important',
                    borderRadius: 0,
                  }}
                />
              }
              label={label}
              size='small'
              sx={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            />
          ))}
        </Stack>

        <Typography
          variant='h2'
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            color: '#f8fafc',
            lineHeight: 1.15,
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Deploy{' '}
          <Box
            component='span'
            className='inline-block text-transparent bg-clip-text animate-shimmer'
            style={{
              backgroundImage:
                'linear-gradient(90deg, #60a5fa, #bae6fd, #60a5fa, #bae6fd, #60a5fa)',
              backgroundSize: '400% 100%',
            }}
          >
            Serverless Functions
          </Box>
          <br />
          <Box component='span' sx={{ color: '#94a3b8' }}>
            right from your browser
          </Box>
        </Typography>

        <Typography
          variant='h6'
          sx={{
            textAlign: 'center',
            color: '#64748b',
            fontWeight: 400,
            maxWidth: '560px',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.15rem' },
          }}
        >
          Write code, hit deploy, get an API endpoint.
          <br />
          No infrastructure, no config, no waiting.
        </Typography>

        <Box sx={{ width: '100%', maxWidth: '800px', mt: 2 }}>
          <Box
            sx={{
              background: '#1e2130',
              borderRadius: '12px 12px 0 0',
              px: 2,
              py: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <Box sx={{ display: 'flex', gap: '6px' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#ff5f57',
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#febc2e',
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#28c840',
                }}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '6px',
                px: 2,
                py: 0.4,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#28c840',
                  flexShrink: 0,
                }}
              />
              <Typography
                variant='caption'
                sx={{
                  color: '#64748b',
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                }}
              >
                pmal
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              border: '1px solid rgba(255,255,255,0.07)',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              overflow: 'hidden',
            }}
          >
            <LandingEditor />
          </Box>
        </Box>
      </Stack>
    </Box>
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
    <Stack spacing={0}>
      <Editor code={code} setCode={setCode} language='js' onSave={() => {}} />
      <Box
        sx={{
          background: '#161b22',
          px: 2,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant='caption'
            sx={{ color: '#64748b', fontFamily: 'monospace' }}
          >
            JavaScript
          </Typography>
          <Button
            variant='contained'
            size='small'
            onClick={onSubmit}
            disabled={!code}
            loading={loading}
            startIcon={<RocketLaunchIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              background: '#fff',
              color: '#0a0a14',
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 2.5,
              '&:hover': { background: '#e2e8f0' },
              '&:disabled': {
                background: 'rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.4)',
              },
            }}
          >
            Deploy
          </Button>
        </Box>

        {alias && (
          <Stack spacing={0.75}>
            <Box sx={{ display: 'flex' }}>
              <input
                className='bg-slate-950 text-white text-sm border border-e-0 border-slate-700 rounded-s-lg block w-full p-2.5 focus:outline-none'
                style={{
                  fontFamily:
                    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
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
                  border: '1px solid',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderLeft: 0,
                  color: '#94a3b8',
                  minWidth: '48px',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.07)',
                    color: '#fff',
                  },
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
                {copied ? (
                  <CheckIcon fontSize='small' />
                ) : (
                  <ContentCopyIcon fontSize='small' />
                )}
              </Button>
            </Box>
            <Typography variant='caption' sx={{ color: '#64748b' }}>
              Free functions expire after 10 calls.{' '}
              <Link
                component={NextLink}
                href='/signin'
                sx={{ color: '#60a5fa' }}
                underline='hover'
              >
                Sign in
              </Link>{' '}
              for unlimited access.
            </Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

const steps = [
  {
    number: '01',
    icon: <EditIcon sx={{ fontSize: '1.5rem' }} />,
    title: 'Edit',
    description:
      'Write your function in the built-in editor. Supports JavaScript, Python, PHP, and more.',
  },
  {
    number: '02',
    icon: <RocketLaunchIcon sx={{ fontSize: '1.5rem' }} />,
    title: 'Deploy',
    description:
      'Hit deploy and your function is live in seconds, powered by GitHub Actions.',
  },
  {
    number: '03',
    icon: <BoltIcon sx={{ fontSize: '1.5rem' }} />,
    title: 'Call',
    description:
      'Invoke your function from anywhere via a simple GET or POST request.',
  },
];

function Steps() {
  return (
    <Box
      id='how-it-works'
      sx={{
        background: '#f8fafc',
        py: { xs: 8, md: 10 },
        px: { xs: 3, md: '10%' },
      }}
    >
      <Typography
        variant='overline'
        sx={{
          display: 'block',
          textAlign: 'center',
          color: '#3b82f6',
          fontWeight: 700,
          letterSpacing: '0.12em',
          mb: 1,
        }}
      >
        How it works
      </Typography>
      <Typography
        variant='h4'
        sx={{
          textAlign: 'center',
          fontWeight: 800,
          color: '#0f172a',
          mb: 8,
          letterSpacing: '-0.02em',
        }}
      >
        Three steps to your first function
      </Typography>

      <Grid container spacing={4} justifyContent='center' alignItems='stretch'>
        {steps.map((step, i) => (
          <Grid key={i} size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
            <Stack
              spacing={2}
              sx={{
                flex: 1,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                p: 4,
                position: 'relative',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(59,130,246,0.10)',
                  borderColor: '#bfdbfe',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#e2e8f0',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {step.number}
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.icon}
              </Box>
              <Typography
                variant='h6'
                fontWeight={700}
                sx={{ color: '#0f172a' }}
              >
                {step.title}
              </Typography>
              <Typography
                variant='body1'
                sx={{ color: '#64748b', lineHeight: 1.6 }}
              >
                {step.description}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function About1() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0d1117 0%, #0a0a14 100%)',
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: '12%' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '-40%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Stack spacing={4} alignItems='flex-start' sx={{ maxWidth: '720px' }}>
        <Typography
          variant='overline'
          sx={{ color: '#3b82f6', fontWeight: 700, letterSpacing: '0.12em' }}
        >
          Under the hood
        </Typography>

        <Typography
          variant='h3'
          sx={{
            fontWeight: 800,
            color: '#f8fafc',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.8rem', md: '2.5rem' },
          }}
        >
          Serverless functions,{' '}
          <Box
            component='span'
            sx={{
              background: 'linear-gradient(90deg, #60a5fa, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            zero infrastructure
          </Box>
        </Typography>

        <Typography
          variant='h6'
          sx={{
            color: '#94a3b8',
            fontWeight: 400,
            lineHeight: 1.7,
            fontSize: '1.05rem',
          }}
        >
          PMAL uses{' '}
          <Box
            component='span'
            sx={{
              background: 'rgba(250,204,21,0.15)',
              color: '#fde047',
              px: 0.75,
              py: 0.25,
              borderRadius: '6px',
              fontWeight: 600,
              border: '1px solid rgba(250,204,21,0.25)',
            }}
          >
            GitHub Actions
          </Box>{' '}
          as a computing backend to run your code securely in isolated
          containers. Write a function, deploy it instantly, and get a public
          API endpoint.
        </Typography>

        <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>
          {['No cold-start config', 'Auto-scaling', '5+ languages'].map(
            (tag) => (
              <Chip
                key={tag}
                label={tag}
                size='small'
                sx={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontWeight: 500,
                }}
              />
            )
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

const features = [
  {
    icon: <BoltIcon />,
    title: 'Fast Execution',
    description:
      'Run your functions with minimal latency, backed by GitHub Actions runners.',
  },
  {
    icon: <LockIcon />,
    title: 'Secure',
    description:
      'Your code runs in isolated containers — fully sandboxed from other functions.',
  },
  {
    icon: <PublicIcon />,
    title: 'Public API',
    description:
      'Every function gets a stable public URL you can call from anywhere.',
  },
  {
    icon: <BuildIcon />,
    title: 'Easy Integration',
    description:
      'Connect with webhooks, external APIs, and your existing workflows.',
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Scalable',
    description:
      'Automatically scales with your traffic — no capacity planning needed.',
  },
  {
    icon: <CodeIcon />,
    title: 'Multi-Language',
    description:
      'Supports Node.js, Python, PHP, and more — with more languages coming.',
  },
];

function Features() {
  return (
    <Box
      id='features'
      sx={{
        background: '#f8fafc',
        py: { xs: 8, md: 10 },
        px: { xs: 3, md: '10%' },
      }}
    >
      <Typography
        variant='overline'
        sx={{
          display: 'block',
          textAlign: 'center',
          color: '#3b82f6',
          fontWeight: 700,
          letterSpacing: '0.12em',
          mb: 1,
        }}
      >
        Features
      </Typography>
      <Typography
        variant='h4'
        sx={{
          textAlign: 'center',
          fontWeight: 800,
          color: '#0f172a',
          mb: 8,
          letterSpacing: '-0.02em',
        }}
      >
        Designed for simplicity.
      </Typography>

      <Grid container spacing={3} justifyContent='center'>
        {features.map(({ icon, title, description }, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack
              spacing={2}
              sx={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                p: 3.5,
                height: '100%',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  borderColor: '#bfdbfe',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </Box>
              <Typography
                variant='h6'
                fontWeight={700}
                sx={{ color: '#0f172a' }}
              >
                {title}
              </Typography>
              <Typography
                variant='body2'
                sx={{ color: '#64748b', lineHeight: 1.6 }}
              >
                {description}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function CTA() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0a0a14 0%, #0f172a 100%)',
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: '10%' },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '300px',
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Stack spacing={3} alignItems='center'>
        <Typography
          variant='h3'
          sx={{
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            lineHeight: 1.2,
          }}
        >
          Ready to ship your first function?
        </Typography>
        <Typography
          variant='h6'
          sx={{
            color: '#64748b',
            fontWeight: 400,
            maxWidth: '480px',
            lineHeight: 1.6,
          }}
        >
          Sign in for unlimited calls, API access, and persistent functions that
          don&apos;t expire.
        </Typography>
        <Stack
          direction='row'
          spacing={2}
          flexWrap='wrap'
          justifyContent='center'
          useFlexGap
        >
          <Button
            component={NextLink}
            href='/signup'
            variant='contained'
            size='large'
            sx={{
              background: '#fff',
              color: '#0a0a14',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: '10px',
              '&:hover': { background: '#e2e8f0' },
            }}
          >
            Get started free
          </Button>
          <Button
            component={NextLink}
            href='/signin'
            variant='outlined'
            size='large'
            sx={{
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#94a3b8',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: '10px',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f8fafc',
              },
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
