import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense } from 'react'
import PostSkeleton from './PostSkeleton'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import { extractTimeAndDate } from './Database'



const Post = ({post}: {post: AllPostProps}) => {
  return (
    <Suspense fallback={<PostSkeleton/>}>
  <Link href={`product/${post.id}`} key={post.id} className=" max-w-64 group bg-dark flex flex-col dark:bg-light border-black dark:border-light rounded-md hover:shadow-lg hover:shadow-black dark:hover:shadow-zinc-400 hover:bg-zinc-800 hover:dark:bg-zinc-200 transition-shadow duration-100">
                    <div className={cn("flex flex-col items-center justify-center",{
                      "contrast-50": post.isSold === true,
                    })}>
                      <Image src={post !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string[])[0]}`:''} width={600} height={450} alt={post.title} className="max-w-full h-72 rounded-t-sm border-b-2 border-light dark:border-black" loading="lazy"/>
                     
                    </div>
                    <div className="flex flex-col my-2  transition-all duration-100 text-lg rounded-b-sm text-light dark:text-black">
                    
                    <h1 className={cn("text-xl font-semibold",{
                      "text-black bg-red-500 rounded-md bottom-0 px-1 font-bold": post.isSold === true
                    })}>{post.isSold ? "solded" : ''}</h1>
                    <h1 className="font-bold text-2xl ml-1">{!post.isSold && `ETB ${post.price}`}.00</h1>
                    <h1 className="font-semibold overflow-hidden text-xl text-ellipsis ml-2">{post.title}</h1>
                    
                    <h1 className="overflow-hidden flex gap-2 text-ellipsis ml-2"><h1 className="font-bold">author:</h1> {post.author.name.split(' ')[0]}</h1>
                    <h1 className="overflow-hidden flex gap-2 text-ellipsis ml-2"><h1 className="font-bold">C.N</h1> {post.postProfile.companyName}</h1>
                    <h1 className="overflow-hidden flex gap-1 justify-start items-center text-ellipsis"><MapPin className="fill-light stroke-dark dark:fill-dark dark:stroke-light"/>{post.city}</h1>
                    <h1 className="overflow-hidden text-sm flex text-ellipsis ml-2">{post?.createdAt ? extractTimeAndDate(post.createdAt).diffInDays : 'N/A'} days </h1>
                    
                    </div>
                   
                  </Link>
    </Suspense>
  )
}

export default Post
