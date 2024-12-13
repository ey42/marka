"use client"
import { trpc } from '@/app/_trpc/client';
import { Authclient } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import {extractTimeAndDate } from '../Database';
import { cn } from '@/lib/utils';

const PostUserOnly = ({catagoryName, userId} : {catagoryName: string, userId: string}) => {
    const {useSession} = Authclient
    const {data } = useSession()
    const session = data?.session;
    const [formSubmitted, setFormSubmited] = useState<boolean>(false)
    // const [id, setId] = useState<string>("")
    // const [sold, setSold] = useState<boolean>()
    // const userId = session?.userId
   
    const router = useRouter()
    const {data: success , refetch: fetchAgain} = trpc.database.getPosts.useQuery({id: userId as string})
    const posts = success?.posts
    const {mutate: upload } = trpc.database.soldPost.useMutation({
      onSuccess: () => {
        console.log('Success! Uploading issold...');
        setFormSubmited(false); // Reset form state after success
        router.refresh()
        
        fetchAgain(); // Navigate to categories page
      },
      onError: (err) => {
        console.error('Error uploading post:', err);
        fetchAgain()
      },})

      // const handleClick = ({sold, id}: {sold: boolean, id: string}) => {
      //     setId(id)
      //     setSold(!sold)
      //     fetchAgain()
      // }

      const onsubmit = (e:FormEvent<HTMLFormElement>, {sold, id}: {sold: boolean, id: string}) => {
        e.preventDefault()
        setFormSubmited(true)
        upload({id: id as string, Sold: sold as boolean})
        fetchAgain()
        router.refresh()

      }
      useEffect(() => {
        
fetchAgain
setFormSubmited(false)
// setId("")
// setSold(false)

      }, 
    [formSubmitted])
  return (
    <div className="flex flex-col justify-between items-center font-mono">
        <div className=' grid gap-10 gap-y-20 max-xl:grid-cols-3 max-md:gap-5 grid-flow-row grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-y-20'>
      {posts !== undefined ? posts.map((post) => (
        post.catagory === catagoryName ? (
        <div key={post.id}>
          <div className='flex flex-col gap-2 rounded-md w-80 border-r-2 pr-2 border-dark dark:border-slate-50 text-dark dark:text-slate-50 '>
            <div className='flex flex-row '>
              <div className={cn('w-40', {
                "contrast-50": post.isSold === true,
                // "invert": post.isSold === true,
              })}> 
                <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${post.file as string}`} alt="image" width={200} height={200} className="w-40 h-40 rounded-lg"/>
              </div>
          <div className='text-xs flex flex-col ml-2 items-start w-40 justify-between'>
          <div>
          <h1 className=''>- {post.catagory}</h1>
          <h1 className=''>- {post.title}</h1>
          <p className='text-xs'>- {post.description}</p>
          <h1>- {post.price} birr</h1>
          <p className={cn("text-lg", {"text-red-500 font-bold": post.isSold === true})}>- {post.isSold === true ? "sold" : "not sold"}</p>
          </div>
          <div className='flex items-end bottom-0'>
           {/* this is for how many user see this post */}
            </div>
          </div>
          </div>
          <div>
          <div className='flex justify-between text-xs'>
            <div className='ml-2'>
            {post.updatedAt ? (
              <h1>{extractTimeAndDate(post.updatedAt).date}-{extractTimeAndDate(post.updatedAt).time} 
              </h1>) : (
                <h1 className='text-center text-xs '> {extractTimeAndDate(post.createdAt).date}-{extractTimeAndDate(post.createdAt).time} 
              </h1>
              )
              }
            </div>
            <form onSubmit={(e) => onsubmit(e, {id: post.id!, sold: !post.isSold as boolean})}>
             {/* <Link className='mr-2' href={`/update/update-post/${post.id}`}> */}
             <button className='border-2 px-1 rounded-md border-zinc-600 hover:border-dark dark:border-light  hover:dark:bg-stone-900 hover:font-semibold' type='submit'> {post.isSold ? "un-sold": "sold"} </button>
             
             {/* </Link> */}
             </form>
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
