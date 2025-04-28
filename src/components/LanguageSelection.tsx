import Link from 'next/link';
import { env } from '@/env';
import { languageOptions } from '@/utils';
import { Box, Typography } from '@mui/material';

export default function LanguageSelection({
  type,
  currentLanguage,
  setCurrentLanguage,
}: {
  type: 'dashboard' | 'playground';
  currentLanguage: string;
  setCurrentLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const isPlayground = type === 'playground';
  const renderLanguageOption = (name: string, logoUrl: string) => {
    return (
      <Link
        className={`rounded-lg hover:bg-white h-[50px] justify-items-center ${name === currentLanguage ? 'bg-white' : ''} ${env.FF_ONLY_JS_FUNCTIONS && name !== 'js' ? 'hover:cursor-not-allowed hover:bg-white' : ''}`}
        key={`editor-language-option-${name}`}
        href={
          isPlayground
            ? env.FF_ONLY_JS_FUNCTIONS
              ? `?language=js`
              : `?language=${name}`
            : ''
        }
        onClick={() => {
          if (env.FF_ONLY_JS_FUNCTIONS && name !== 'js') {
            return;
          }
          setCurrentLanguage(name);
        }}
      >
        <img className='h-[50px]' src={logoUrl} alt={name} />
      </Link>
    );
  };
  return (
    <Box className='hidden md:flex md:flex-row gap-4'>
      <Typography variant='h6'>Language:</Typography>
      {languageOptions.map(({ name, logoUrl }) =>
        renderLanguageOption(name, logoUrl)
      )}
    </Box>
  );
}
