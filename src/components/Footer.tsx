export interface FooterProps {
  type: 'landing' | 'dashboard';
}

export default function Footer({ type }: FooterProps) {
  const isLanding = type === 'landing';
  return (
    <div
      className={`w-full ${isLanding ? 'bg-black' : 'bg-gray-50 border border-e-0 border-s-0'} p-4`}
    >
      <div
        className={`grid grid-cols-2 ${isLanding ? 'text-gray-100' : 'text-black'}`}
      >
        <div className='font-bold'>
          <h1>Experiments with Github Actions as a Backend</h1>
        </div>
        <div className='ml-auto font-bold text-right sm:flex sm:flex-row gap-4'>
          <p>
            <a href='https://github.com/bistromath25/pmal'>Contact</a>
          </p>
          <p>
            <a href='https://github.com/bistromath25/pmal'>Privacy</a>
          </p>
          <p>
            <a href='https://github.com/bistromath25/pmal'>Source</a>
          </p>
        </div>
      </div>
    </div>
  );
}
