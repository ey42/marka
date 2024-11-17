import React from 'react'

interface PageProps{
    params: {
        productId: string
    }
}
const page = async({params}: PageProps) => {
  return (
    <div>
        <div className='flex flex-row justify-between'>
            <div className='flex flex-col justify-center h-auto w-72  bg-yellow-300'>
                <div>
                    eyueal
                </div>
            </div>
            <div className='flex justify-center h-auto bg-yellow-300 w-72'>
                <div>
                    zerihun
                </div>
            </div>
        </div>
    </div>
  )
}

export default page