import CatagoryPost from '@/Component/Post/CatagoryPost'
import React from 'react'

interface PageProps {
    params: {
      catagoryId: string
    }
  }
const page = ({params}: PageProps) => {
  const catagoryName : string = params.catagoryId
  return (
    <div className='w-full flex items-center justify-center text-black font-mono text-sm'>
      <CatagoryPost catagoryName={catagoryName}/>
    </div>
  )
}

export default page
