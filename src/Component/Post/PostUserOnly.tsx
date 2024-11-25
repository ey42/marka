"use client"
import { trpc } from '@/app/_trpc/client';
import { Authclient } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { extractTimeAndDate } from '../Database';
import { Timer } from 'lucide-react';

const PostUserOnly = ({catagoryName, userId} : {catagoryName: string, userId: string}) => {
    const {useSession} = Authclient
    const {data } = useSession()
    const session = data?.session;
    // const userId = session?.userId
   
    const router = useRouter()
    const {data: success , refetch: fetchAgain} = trpc.database.getPosts.useQuery({id: userId as string})
    const posts = success?.posts
  return (
    <div className="flex flex-col justify-between items-center">
        <div className=' grid gap-10 max-xl:grid-cols-3 max-md:gap-5 grid-flow-row grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1'>
      {posts !== undefined ? posts.map((post) => (
        post.catagory === catagoryName ? (
        <div key={post.id}>
          <div className='flex flex-col gap-2 rounded-md w-80 border-r-2 border-dark bg-dark dark:bg-slate-300 text-slate-300 dark:text-dark  '>
            <div className='flex flex-row '>
              <div className='w-40'> 
                <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${post.file as string}`} alt="image" width={200} height={200} className="w-40 h-40 rounded-lg"/>
              </div>
         
          <div className='text-xs font-semibold flex flex-col ml-2 items-start w-40 sjustify-between'>
          <div>
          <h1 className=''>{post.catagory}</h1>
          <h1 className=''>{post.title}</h1>
          <p className='text-xs'>{post.description}</p>
          </div>
          <div className='flex items-end bottom-0'>
           {/* this is for how many user see this post */}
            </div>
          </div>
          </div>
          <div>
          <div className='flex justify-between font-semibold text-xs'>
            <div className='ml-2'>
            {post.updatedAt ? (
              <h1>{extractTimeAndDate(post.updatedAt).date}-{extractTimeAndDate(post.updatedAt).time} 
              </h1>) : (
                <h1 className='text-center text-xs font-semibold'> {extractTimeAndDate(post.createdAt).date}-{extractTimeAndDate(post.createdAt).time} 
              </h1>
              )
              }
            </div>
             <Link className='mr-2' href={`#`}>
             <button> edit </button>
             </Link>
           
            </div>
          </div>
          </div>
        </div>) : ""
       ) ) : ""}
    </div>
    </div>
  )
}

export default PostUserOnly
