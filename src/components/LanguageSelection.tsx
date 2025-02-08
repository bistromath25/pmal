import Link from 'next/link';
import { FF_ONLY_JS_FUNCTIONS } from '@/env/env';
import { languageOptions } from '@/utils/functions';

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
        className={`rounded-lg hover:bg-white h-[50px] justify-items-center ${name === currentLanguage ? 'bg-white' : ''} ${FF_ONLY_JS_FUNCTIONS && name !== 'js' ? 'hover:cursor-not-allowed hover:bg-white' : ''}`}
        key={`editor-language-option-${name}`}
        href={
          isPlayground
            ? FF_ONLY_JS_FUNCTIONS
              ? `?language=js`
              : `?language=${name}`
            : ''
        }
        onClick={() => {
          if (FF_ONLY_JS_FUNCTIONS && name !== 'js') {
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
    <div className='hidden md:flex md:flex-row gap-4'>
      <h2 className='font-bold my-auto'>Language:</h2>
      {languageOptions.map(({ name, logoUrl }) =>
        renderLanguageOption(name, logoUrl)
      )}
    </div>
  );
}
