'use client';

import { env } from '@/env';
import { languageOptions } from '@/utils';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function LanguageSelection({
  currentLanguage,
  setCurrentLanguage,
}: {
  currentLanguage: string;
  setCurrentLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onlyJS = env.FF_ONLY_JS_FUNCTIONS === 'true';

  return (
    <Stack flexDirection='row' gap={1} sx={{ alignItems: 'center' }}>
      <Typography variant='h6'>Language:</Typography>
      {languageOptions.map(({ name, logoUrl }) => {
        const isDisabled = onlyJS && name !== 'js';
        const isSelected = name === currentLanguage;

        return (
          <Button
            key={name}
            onClick={() => {
              if (!isDisabled) {
                setCurrentLanguage(name);
              }
            }}
            disabled={isDisabled}
            sx={{
              borderRadius: 2,
              height: 50,
              backgroundColor: isSelected ? 'background.paper' : 'transparent',
              '&:hover': {
                backgroundColor: isDisabled
                  ? 'transparent'
                  : 'background.paper',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              },
              p: 0.5,
            }}
          >
            <Box component='img' src={logoUrl} alt={name} sx={{ height: 50 }} />
          </Button>
        );
      })}
    </Stack>
  );
}
