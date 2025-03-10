"use client";
import { trpc } from '@/app/_trpc/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper';
import PaginationComponent from '../paginationComponent';
import {useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Frown, RefreshCw } from 'lucide-react';
import Post from '../Post';
import PostSkeleton from '../PostSkeleton';

const CatagoryPost = ({catagoryName}: {catagoryName: string}) => {
    const {data: data, isPending} = trpc.database.getPostWithCatagory.useQuery({catagory : catagoryName as string}) 
    const posts = data?.posts

    const postsCount: number = (data?.postCount[0].count) as number
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const totalPages = Math.ceil(postsCount / 50)
    const postForPage = posts?.slice((currentPage - 1) * 50, currentPage * 50)
    const falseArrayOnPost = Array.from({length:  7}, () => "items") 

    
  return (
    <MaxWidthWrapper className='flex w-full items-center justify-center mt-10'>
    <div className={cn("flex min-h-64 w-full bg-zinc-200 dark:bg-zinc-800 p-5 rounded-md mt-10 ",{
            "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-h-64 max-w-full bg-zinc-200 gap-y-8 dark:bg-zinc-800 max-md:w-full p-5 rounded-md mt-10": postForPage !== undefined
          })} >
            {postForPage !== undefined && posts && posts.length > 0 ? postForPage?.map((post) => (
            <Post post={post} key={post.id}/>
            ))
             : isPending ?<div className='grid grid-cols-2 sm:grid-cols-2 w-full min-w-full md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-4'>{falseArrayOnPost.map((i) => <PostSkeleton key={i}/>) } </div> :
            <div className='flex justify-center gap-2 items-center w-full h-full'> 
            <h1 className='text-2xl font-bold'>No Post Found</h1> <Frown />
            </div>}
          
        <div className='mt-10' hidden={((totalPages === 1) || (totalPages === 0) ? true : false) || posts === undefined}>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => {
            const pages = new URL(window.location.href)
            pages.searchParams.set('page', page.toString())
            router.push(pages.toString())
        }}/>
        </div>
    </div>
    </MaxWidthWrapper>
  )
}

export default CatagoryPost
