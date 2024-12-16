export default function Footer() {
  return (
    <div className='w-full bg-black p-4'>
      <div className='grid grid-cols-2'>
        <div className='text-gray-100 font-bold'>
          <h1>
            Poor Man's AWS Lambdas: Experimenting with Github Actions as a
            Backend
          </h1>
        </div>
        <div className='ml-auto text-gray-100 font-bold text-right sm:flex sm:flex-row gap-10'>
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
