"use client"
import { trpc } from '@/app/_trpc/client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React,{useState} from 'react'
import PaginationComponent from '../paginationComponent'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

const Trader = ({id}: {id: string}) => {
    const {data: access} = trpc.database.getProfile.useQuery({id: id as string}) 
    const { data: data} = trpc.database.getPosts.useQuery({id: id as string})
    const user = access?.user
    const profile = user?.userContent;
    const posts = data?.posts
    const postsCount: number = data?.postCount[0].count as number
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const totalPages = Math.ceil(postsCount / 10)
    const postForPage = posts?.slice((currentPage - 1) * 10, currentPage * 10)

     
  return (
    <div className='dark:text-light flex flex-col gap-10 font-semibold font-mono text-dark'>
      <div className="flex flex-col items-center justify-center tracking-wider gap-4">
        {(user !== undefined && profile !== undefined)  && (
            <div className='flex flex-col justify-center gap-4 border-2 dark:border-light border-dark w-1/2 max-md:w-full overflow-hidden rounded-xl '>
                <div className='flex items-center w-full justify-evenly gap-4 border-b-2 dark:border-light border-dark '>
                    <h1>rank</h1>
                    <Image src={profile.imageFile !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${profile.imageFile as string}`:''} alt="company Image" width={50} height={50} className="w-28 h-28 my-2 border-2 dark:border-light border-dark rounded-full"/>
                    <h1 className='text-green-500 text-lg font-bold'>approved</h1>
                </div>
                <div className='flex flex-row justify-between gap-4'>
                <div className='flex flex-col gap-2 px-2'>
                    <div>
                        <h1 className='text-lg text-center gap-2 font-bold'>
                            user info
                        </h1>
                    </div>
                    <h1>company name : {profile.companyName ? profile.companyName : "sorry i don't have company name"}</h1>
                    <h1>trader name : {user.name ? user.name : "sorry i don't have a name"}</h1>
                    <h1>Type of Buisness : {profile.type ? profile.type : "sorry i dont have type of buisness"}</h1>
                    <h1>phone number : {profile.phoneNumber1 ? profile.phoneNumber1 : "sorry i dont have phone number"}</h1>
                    <h1>phone number : {profile.phoneNumber2 ? profile.phoneNumber2 : "sorry i dont have phone number"}</h1>
                </div>
                <div className='flex flex-col gap-2 px-2 w-1/2'>
                    <div>
                        <h1  className='text-lg text-center font-bold'>
                            user accounts
                        </h1>
                    </div>
                  
                    <Link target='_blank' className='flex gap-1 truncate' href={profile.instagram ? profile?.instagram?.includes('https://www.instagram.com/') ? profile?.instagram : `https://www.instagram.com/${profile?.instagram}` : "#"}>
                    <h2>instagram :</h2>
                     {profile.instagram ? profile.instagram.includes('https://www.instagram.com') ? `@${profile.instagram.split('/').pop()}` : `@${profile.instagram}` : "no instagram account"}
                    </Link>

                    <Link target='_blank' className='flex gap-1' href={profile.telegram ? profile?.telegram?.includes('https://t.me/') ? profile?.telegram : `https://t.me/${profile?.telegram}` : "#"}>
                    <h2>telegram :</h2>
                     {profile.telegram ? profile.telegram.includes('https://t.me/') ? `@${profile.telegram.split('/').pop()}` : `@${profile.telegram}` : "no telegram account"}
                    </Link>

                    <Link target='_blank' className='flex gap-1' href={profile.facebook ? profile?.facebook?.includes('https://www.facebook.com/') ? profile?.facebook : `https://www.facebook.com/${profile?.facebook}` : "#"}>
                    <h2>facebook :</h2>
                     {profile.facebook ? profile.facebook.includes('https://www.facebook.com') ? `@${profile.facebook.split('/').pop()}` : `@${profile.facebook}` : "no facebook account"}
                    </Link>

                    <Link target='_blank' className='flex gap-1' href={profile.x ? profile?.x?.includes('https://x.com/') ? profile?.x : `https://x.com/${profile?.x}` : "#"}>
                    <h2>x :</h2> 
                     {profile.x ? profile.x.includes('https://x.com') ? `@${profile.x.split('/').pop()}` : `@${profile.x}` : "no x account"}
                    </Link>
                    

                </div>
                </div>
            
            </div>
        )}
      </div>
      
      <div className='flex flex-col gap-4 justify-center items-center'>
        <div className='flex gap-2 items-center justify-center my-16 '>  
            <h1 className='text-3xl'>Items  </h1> <div className='dark:text-light text-dark font-bold'> <ShoppingCart className='w-10 h-10'/ ></div> 
        </div>
        <div className='grid items-center justify-center gap-10 gap-y-20  max-md:gap-5 grid-flow-row grid-cols-4 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-y-20'>
    {postForPage !== undefined && postForPage.map((post) => (
        <Link href={`/product/${post.id}`} key={post.id} className=' flex-col w-[256px] gap-4 border-2 overflow-hidden rounded-xl border-b-2 border-dark dark:border-white '>
            <div>
                <div className=''>
                    <Image src={post.file !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${post.file as string}`:''} alt="company Image" width={256} height={208} className="w-64 h-52 rounded-sm"/>
                   
                </div>
            </div>
            <div className='flex justify-between gap-2 px-2 bg-dark text-light dark:bg-light dark:text-dark font-bold text-lg'>
            <div className='flex flex-col gap-1 mt-1'>
                <h1>{post.title}</h1>
                <h1>{post.catagory}</h1>
            </div>
            <div>
                <h1 className={cn("mt-1",{
                    "text-red-500": post.isSold
                })}>{post.isSold ? "sold" : "for sell"}</h1>
            </div>
            </div>
        </Link>
    ))}
        </div>
        <div className='mt-10' hidden={totalPages === 1 ? true : false}>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => {
            const pages = new URL(window.location.href)
            pages.searchParams.set('page', page.toString())
            router.push(pages.toString())
        }}/>
        </div>
      </div>
    </div>
  )
}

export default Trader
