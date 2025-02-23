"use client"
import { trpc } from '@/app/_trpc/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, {use, useEffect, useState } from 'react'
import {extractTimeAndDate, FunctionDate } from '../Database';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

const PostUserOnly = ({catagoryName, userId} : {catagoryName: string, userId: string}) => {

  
    const router = useRouter()
    const {data: success , refetch: fetchAgain} = trpc.database.getPosts.useQuery({id: userId as string})
    const posts = success?.posts

    const {refetch} = trpc.database.deleteSolded.useQuery()   
     
    const {mutate: upload } = trpc.database.soldPost.useMutation({
      onSuccess: () => {
        router.refresh()
        fetchAgain()
        refetch()
        console.log('Success! Uploading issold...');
      },
      onError: (err) => {
        console.error('Error uploading post:', err);
        fetchAgain()
      },})

     
      const {data: message, mutate: deletedId} = trpc.database.deletePostById.useMutation({
        onSuccess: () => {
          console.log('Success! Deleting post...');
          router.refresh()
          fetchAgain();
        },
        onError: (err) => {
          console.error('Error deleting post:', err);
          fetchAgain()
        },
      })

      const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete the post?")
        if (!confirm) return
        deletedId({postId: id})
        router.refresh()
        fetchAgain()
      }

      const onsubmit = ({sold, id}: {sold: boolean, id: string}) => {
        upload({id: id as string, Sold: sold as boolean})
        fetchAgain()
        refetch()
      }
           
      
    const now = new Date()
    const date = now.getTime()
   const time = FunctionDate(date)
  return (
    <div className="flex flex-col justify-between items-center font-mono">
        <div className=' grid gap-10 gap-y-20 max-xl:grid-cols-3 max-md:gap-5 grid-flow-row grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-y-20'>
      {posts !== undefined ? posts.map((post) => (
        post.catagory === catagoryName ? (
        <div key={post.id}>
          <div className='flex flex-col gap-2 rounded-md bg-zinc-200 dark:bg-zinc-600 pb-2 w-80 border-r-2 pr-2 border-dark dark:border-slate-50 text-dark dark:text-slate-50 '>
            <div className='flex flex-row '>
              <div className={cn('w-40', {
                "contrast-50": post.isSold === true,
              })}> 
                <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string[])[0]}`} alt="image" width={200} height={200} className="w-40 h-40 rounded-lg"/>
              </div>
          <div className='text-xs flex flex-col ml-2 items-start w-40 justify-between'>
          <div>
          <h1 className=''>- {post.catagory.replace(/_/g, ' ')}</h1> 
          <h1 className=''>- {post.title}</h1>
          <p className='text-xs'>- {post.description}</p>
          <h1>- {post.price} birr</h1>
          <p className={cn(
          {"text-red-500 font-bold": post.isSold === true,
          "text-lg": post.isSold === true,
            "text-green-500": post.isSold === false})}>
              - {post.isSold === true ? "solded" : "for sell"}</p>
          {post.soldDate && (<p className="text-red-500 font-sim">- after {24 - (time.hours - (FunctionDate(Number(post.soldDate)).hours))} hours automatically this post will be deleted permanently!!</p>)}
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
            <div className='flex flex-row gap-2'>
              <button className='hover:font-semibold'  onClick={() => handleDelete(post.id)} ><Trash2 width={20} height={20} className='hover:stroke-red-400 dark:hover:fill-black'/></button>
             <button onClick={() => onsubmit({id: post.id!, sold: !post.isSold as boolean})} className='border-2 px-1 rounded-md border-zinc-600 hover:border-dark hover:bg-black hover:text-light dark:border-light  hover:dark:bg-stone-900 hover:font-semibold dark:hover:bg-white dark:hover:text-light'> {post.isSold ? "un-sold": "sold"} </button>
             
             </div>
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
