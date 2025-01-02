"use client"
import { trpc } from '@/app/_trpc/client'
import React from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper'
import Image from 'next/image'


const Product = ({id}: {id: string}) => {
  const {data: data} = trpc.database.getAllPosts.useQuery()

  const posts = data?.allPosts
  const post = posts?.find((post) => post.id === id)
  return (
    <div className='flex justify-center'>
      <MaxWidthWrapper className = 'flex border-2 border-light bg-dark dark:bg-light dark:border-dark flex-col gap-10'>
      <div className='flex justify-center gap-10 text-light dark:text-dark text-sm font-mono px-10'>
        <div className=' border-2 dark:border-dark border-light'> 
          <Image src={post !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${post.file as string}`:''} alt={post !== undefined ? post.title : "image of the post"} objectFit='cover' width={400} height={100}/>
        </div>
        <div className='border-2 dark:border-dark border-light'>

        </div>
      </div>
    </MaxWidthWrapper>
    </div>
  )
}

export default Product
