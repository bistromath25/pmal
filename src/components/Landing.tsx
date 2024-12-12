import Editor from '@/components/Editor';
import Header from './Header';

export default function Landing() {
  return (
    <main className='w-full items-center justify-items-center min-h-screen gap-16'>
      <Header />
      <div style={{ width: '60%' }} className='pb-4 pt-8'>
        <div className='w-full flex flex-col items-center text-center gap-10'>
          <div>
            <h1 className='w-full font-bold text-6xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text'>
              Serverless Functions
            </h1>
            <h2 className='w-full font-bold text-4xl'>
              have never been so{' '}
              <span className='bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text'>
                easy
              </span>
            </h2>
          </div>
          <Editor />
        </div>
      </div>
      <div className='w-full justify-items-center bg-gray-50 px-40 py-10 border border-1 border-e-0 border-s-0'>
        <div className='grid grid-cols-3 gap-10'>
          <div className='rounded-lg p-4 bg-blue-100'>
            <p className='font-bold text-2xl text-center'>Edit ✏️</p>
            <p className='text-gray-600'>
              Edit your function in the built-in editor supporting 5+ languages.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-blue-200'>
            <p className='font-bold text-2xl text-center'>Deploy 🚀</p>
            <p className='text-gray-600'>
              Deploy your function at the click of a button.
            </p>
          </div>
          <div className='rounded-lg p-4 bg-blue-300'>
            <p className='font-bold text-2xl text-center'>Call ⚡</p>
            <p className='text-gray-600'>
              Call your function whenever and wherever you want.
            </p>
          </div>
        </div>
      </div>
      <div className='w-full items-left px-40 py-10 text-center'>
        <p className='text-3xl'>
          🔓 Unlock your full computing potential with{' '}
          <span className='font-bold'>Poor Man's AWS Lambdas 🔑</span>
        </p>
        <div>
          <p className='text-gray-600 pt-1'>
            <a href='#' className='text-blue-500'>
              Sign in
            </a>{' '}
            to gain full access to PMAL, including our API.
          </p>
        </div>
      </div>
    </main>
  );
}
