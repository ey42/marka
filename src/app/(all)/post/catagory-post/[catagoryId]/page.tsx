import CatagoryPost from '@/Component/Post/CatagoryPost'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'

interface PageProps {
    params: {
      catagoryId: string
    }
  }
const page = ({params}: PageProps) => {
  const catagoryName : string = params.catagoryId
  return (
    <div className='w-full flex items-center justify-center text-black font-mono text-sm'>
      <Suspense fallback={<Skeleton className='w-full'/>}>
      <CatagoryPost catagoryName={catagoryName}/>
      </Suspense>
    </div>
  )
}

export default page
