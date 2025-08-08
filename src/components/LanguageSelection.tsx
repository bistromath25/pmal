'use client';

import { env } from '@/env';
import { languageOptions } from '@/utils';
import { Box, Stack, Typography } from '@mui/material';

const languageLabels: Record<string, string> = {
  js: 'JavaScript',
  py: 'Python',
  php: 'PHP',
  rb: 'Ruby',
};

export default function LanguageSelection({
  currentLanguage,
  setCurrentLanguage,
}: {
  currentLanguage: string;
  setCurrentLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onlyJS = env.FF_ONLY_JS_FUNCTIONS === 'true';

  return (
    <Stack spacing={1}>
      <Typography
        variant='caption'
        sx={{
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 700,
          fontSize: '0.68rem',
        }}
      >
        Language
      </Typography>
      <Stack direction='row' gap={1}>
        {languageOptions.map(({ name, logoUrl }) => {
          const isDisabled = onlyJS && name !== 'js';
          const isSelected = name === currentLanguage;

          return (
            <Box
              key={name}
              onClick={() => !isDisabled && setCurrentLanguage(name)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 1,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isSelected ? '#3b82f6' : '#e2e8f0',
                background: isSelected ? 'rgba(59,130,246,0.06)' : '#fff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.4 : 1,
                transition: 'border-color 0.15s, background 0.15s',
                '&:hover': !isDisabled
                  ? {
                      borderColor: isSelected ? '#3b82f6' : '#94a3b8',
                      background: isSelected
                        ? 'rgba(59,130,246,0.06)'
                        : '#f8fafc',
                    }
                  : {},
              }}
            >
              <img src={logoUrl} alt={name} width={20} height={20} />
              <Typography
                variant='body2'
                sx={{
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#1d4ed8' : '#475569',
                  fontSize: '0.8rem',
                }}
              >
                {languageLabels[name] ?? name}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
