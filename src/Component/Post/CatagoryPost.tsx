"use client";
import { trpc } from '@/app/_trpc/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper';
import PaginationComponent from '../paginationComponent';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Frown } from 'lucide-react';

const CatagoryPost = ({catagoryName}: {catagoryName: string}) => {
    const {data: data} = trpc.database.getPostWithCatagory.useQuery({catagory : catagoryName as string}) 
    const posts = data?.posts

    const postsCount: number = (data?.postCount[0].count) as number
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const totalPages = Math.ceil(postsCount / 50)
    const postForPage = posts?.slice((currentPage - 1) * 50, currentPage * 50)
    
  return (
    <MaxWidthWrapper className='flex items-center justify-center'>
    <div className='flex bg-zinc-200 dark:bg-zinc-800 text-black rounded-md dark:text-light p-10 flex-col items-center justify-center'>
            {postForPage !== undefined && posts && posts.length > 0 ?  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"> {postForPage.map((post) => (
            <Link href={post ? `/product/${post.id}` : '/'} key={post.id} className="border-2 group border-dark dark:border-light hover:shadow-lg hover:shadow-black transition-all duration-100 dark:hover:shadow-zinc-400 rounded-md">
                <div className={cn("flex items-center justify-center",{
                    "contrast-50": post.isSold === true
                })}>
                    <Image src={post !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string[])[0]}`:''} width={600} height={450} alt={post.title} className="w-60 h-48 rounded-sm border-b-2 border-light dark:border-black" loading="lazy"/>
                  
                </div>
                <div className="flex justify-between  bg-dark transition-colors duration-100 group-hover:bg-black group-hover:dark:bg-zinc-200 text-white dark:bg-white dark:text-black">
                    <div>
                    <h1 className="font-semibold text-sm pl-1">{post.title}</h1>
                    <h1 className={cn("font-semibold pl-1",{
                        "text-black font-bold px-1 rounded-md bg-red-500 text-sm ": post.isSold === true
                    })}>{post.isSold ? "solded" : `ETB ${post.price}`}</h1>
                    </div>
                    <div className='flex flex-col mr-2 '>
                    <h1 className="text-sm font-semibold pl-1">{post.author.name}</h1>
                    </div>
                </div>
                
            </Link>
             
            ))}
            </div> : 
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
