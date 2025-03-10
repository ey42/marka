"use client"
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin } from 'lucide-react'

const PostSkeleton: React.FC = () => {
  return (
     <Skeleton className=" max-w-64 w-full h-[512px]">
                      <Skeleton className="w-full h-72 rounded-t-sm border-b-2 border-light dark:border-neutral-800 ">
                        Image
                      </Skeleton>
                      <Skeleton className="h-56 flex flex-col w-full">
                      <Skeleton className="flex items-end  h-16 w-full border-[1px] border-neutral-100 text-3xl text-neutral-500 dark:border-neutral-600">
                        Price
                      </Skeleton>
                      
                      <Skeleton className="flex h-12 items-end w-full border-[1px] border-neutral-100 text-neutral-500 text-xl dark:border-neutral-600">Title</Skeleton>
                      <Skeleton className="flex h-8 w-full border-[1px] border-neutral-100 text-neutral-500 dark:border-neutral-600 text-lg items-end">auther name</Skeleton>
                      <Skeleton className="flex h-8 text-neutral-500 items-end w-full border-[1px] border-neutral-100 dark:border-neutral-600 text-lg">Company name</Skeleton>
                      <Skeleton className="flex h-8 w-full border-[1px] border-neutral-100 text-neutral-500 dark:border-neutral-600 gap-2 items-end text-lg"><MapPin className="fill-light stroke-dark dark:fill-dark dark:stroke-light"/>City</Skeleton>
                      <Skeleton className="flex h-8 w-full border-[1px] border-neutral-100 text-neutral-500 dark:border-neutral-600 text-lg items-end">Created date</Skeleton>
                      
                      </Skeleton>
                     
                    </Skeleton>
  )
}

export default PostSkeleton;
