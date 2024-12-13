import React from 'react'

const Footer = () => {
  return (
    <div className=' border-t-green-300 overflow-hidden border-t-4 flex flex-col justify-center items-center gap-20 mt w-screen bottom-0 mt-36 dark:text-light text-dark pb-10'>
      <h1 className='footer-h1 mt-10 font-bold text-9xl'><span className='text-blue-500'>M</span>ar<span className='text-yellow-500'>k</span>a<span className='text-red-500'>.</span>c<span className='text-green-500'>o</span>m</h1>
        <div className='flex justify-center items-center w-full'>
            <div className='flex flex-row justify-evenly gap-20 w-full'>
              <div className='flex flex-col '>
                <p>phone number</p>
                <p>telegram account</p>
                <p>instagram account</p>
                <p>facebook account</p>
              </div>
              <div className=''>
              <p>phone number</p>
                <p>telegram account</p>
                <p>instagram account</p>
                <p>facebook account</p>
              </div>
              <div className=''>
              <p>phone number</p>
                <p>telegram account</p>
                <p>instagram account</p>
                <p>facebook account</p>
              </div>
              <div className=''>
              <p>phone number</p>
                <p>telegram account</p>
                <p>instagram account</p>
                <p>facebook account</p>
              </div>
            </div>
        </div>   
    </div>
  )
}

export default Footer