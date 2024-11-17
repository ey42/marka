"use client"
import { trpc } from '@/app/_trpc/client';
import { Authclient } from '@/lib/auth-client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const PostUserOnly = ({catagoryName, userId} : {catagoryName: string, userId: string}) => {
    const {useSession} = Authclient
    const {data } = useSession()
    const session = data?.session;
    // const userId = session?.userId
   
    const router = useRouter()
    const {data: success , refetch: fetchAgain} = trpc.database.getPosts.useQuery({id: userId as string})
    const posts = success?.posts
  return (
    <div className="flex flex-col">
        <div className='grid grid-flow-col grid-cols-10'>
      {posts !== undefined ? posts.map((post) => (
        post.catagory === catagoryName ? (
        <div key={post.id}>
          <div>
          <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${post.file as string}`} alt="image" width={200} height={200} className="w-28 h-28 rounded-lg"/>
          </div>
        </div>) : ""
       ) ) : ""}
    </div>
    </div>
  )
}

export default PostUserOnly
