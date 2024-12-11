export default function Header() {
  return (
    <div className='w-full bg-gray-50 p-4 border border-e-0 border-s-0'>
      <div className='grid grid-cols-2'>
        <div className='px-2 py-2 font-bold text-2xl'>PMAL</div>
        <div className='text-right py-1'>
          <button className='px-4 py-2 rounded-full border border-green-500 shadow-sm bg-green-300 hover:bg-green-200 hover:border-transparent text-center'>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
