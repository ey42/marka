"use client"
import { trpc } from '@/app/_trpc/client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React,{useState} from 'react'
import PaginationComponent from '../paginationComponent'
import { RefreshCw, ShoppingCart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Eyueal } from '../Database'
import { Authclient } from "@/lib/auth-client";


const Trader = ({id}: {id: string}) => {
    const router = useRouter()
    const {data: access, refetch, isPending: pendingProfile} = trpc.database.getProfile.useQuery({id: id as string}) 
    const { data: data, isPending: pendingPost} = trpc.database.getPosts.useQuery({id: id as string})
    const {mutate: update} = trpc.database.updateUser.useMutation(
        {
            onSuccess: () => {
                console.log('Success! Updating user...');
                refetch()
                router.push('/send/response')
            },
            onError: (err) => {
                console.error('Error updating user:', err);
                refetch()
            },
        }
    )
    const user = access?.user
    const profile = user?.userContent;
    const posts = data?.posts
    const postsCount: number = (data?.postCount[0].count) as number
    
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const totalPages = Math.ceil(postsCount / 10)
    const postForPage = posts?.slice((currentPage - 1) * 10, currentPage * 10)
    const {useSession} = Authclient
    const {data : Eyu, } = useSession()
    const activeUserEmail = Eyu?.user.email
    const handleUpdate = (userId: string, imageFile: string, status: string) => {
        // handle the rejection logic here
        update({id: userId, imageFiles: imageFile, value: status})

    }

     
  return (
    <div className='dark:text-light flex flex-col mt-10 gap-10 font-semibold font-mono text-dark'>
      <div className="flex flex-col items-center justify-center px-3 tracking-wider gap-4">
        {(user !== undefined && profile !== undefined && profile !== null)  && (
            <div className='flex flex-col justify-center  border-4 dark:border-light border-dark w-4/5 xl:w-1/2 max-md:w-full overflow-hidden rounded-xl '>
                <div className='flex items-center w-full justify-evenly gap-4 border-b-2 dark:border-light border-dark'>
                    {activeUserEmail === Eyueal && user.accepted !== 'reject' ? <button onClick={() => handleUpdate(profile.userId as string, profile.imageFile as string, "reject")} className='border-2 bg-dark hover:bg-red-500 outline-2 outline-dark outline-offset-2 outline-double ring-2 ring-offset-2 ring-red-500 fill-ring text-zinc-200 hover:text-black dark:bg-light transition-all duration-200 dark:hover:bg-red-500 dark:text-black p-1 px-4 rounded-md'> Reject </button> : <h1> {user.accepted === 'reject' ? "admin rejected" : ""}</h1>}

                    <Image src={profile.imageFile !== undefined || profile.imageFile !== null  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${profile.imageFile as string}`:'#'} alt="company Image" width={112} height={112} className="w-28 h-28 my-2 border-4 dark:border-light border-dark rounded-full"/>

                    {activeUserEmail === Eyueal && user.accepted !== 'accept' ? <button className='border-2 bg-dark hover:bg-green-500 outline-2 outline-dark outline-offset-2 outline-double ring-2 ring-offset-2 ring-green-500 fill-ring text-zinc-200 hover:text-black dark:bg-light dark:hover:bg-green-500 dark:text-black p-1 transition-all duration-200 px-4 rounded-md' onClick={() => handleUpdate(profile.userId as string, profile.imageFile as string, "accept")}> Accept </button> : <h1 >{user.accepted === 'accept' ? <Star className='fill-green-500'/> : ""}</h1>}
                </div>
                <div className='flex flex-row justify-between bg-dark dark:bg-light dark:text-dark text-light '>
                <div className='flex flex-col gap-2 '>
                    <div>
                        <h1 className='text-lg text-center gap-2 font-bold'>
                            user info
                        </h1>
                    </div>
                    <h1 className='max-md:border-b-2 border-light dark:border-dark w-auto'>company name : {profile.companyName ? profile.companyName : "don't have company name"}</h1>
                    <h1 className='max-md:border-b-2 border-light dark:border-dark w-auto'>trader name : {user.name ? user.name : "sorry i don't have a name"}</h1>
                    <h1 className='max-md:border-b-2 border-light dark:border-dark w-auto'>Type of Buisness : {profile.type ? profile.type : "sorry i dont have type of buisness"}</h1>
                    <h1 className='max-md:border-b-2 border-light dark:border-dark w-auto'>phone number : {profile.phoneNumber1 ? profile.phoneNumber1 : "sorry i dont have phone number"}</h1>
                    <h1 className='max-md:border-b-2 border-light dark:border-dark w-auto'>phone number : {profile.phoneNumber2 ? profile.phoneNumber2 : "sorry i dont have phone number"}</h1>
                    <h1 className='max-md:border-b-2 border-light dark:border-dark w-auto'>email : {user.email ? user.email : "sorry no email"}</h1>
                </div>
                <div className='flex flex-col max-md:border-l-2 border-light dark:border-dark gap-2  w-1/2'>
                    <div>
                        <h1  className='text-lg text-center font-bold'>
                            user accounts
                        </h1>
                    </div>
                  
                    <Link target='_blank' className='flex gap-1 hover:underline max-md:border-b-2 border-light dark:border-dark w-auto truncate' href={profile.instagram ? profile?.instagram?.includes('https://www.instagram.com/') ? profile?.instagram : `https://www.instagram.com/${profile?.instagram}` : "#"}>
                    <h2 className='pl-2'>instagram :</h2>
                     {profile.instagram ? profile.instagram.includes('https://www.instagram.com') ? `@${profile.instagram.split('/').pop()}` : `@${profile.instagram}` : "no instagram account"}
                    </Link>

                    <Link target='_blank' className='flex hover:underline  max-md:border-b-2 border-light dark:border-dark w-auto gap-1' href={profile.telegram ? profile?.telegram?.includes('https://t.me/') ? profile?.telegram : `https://t.me/${profile?.telegram}` : "#"}>
                    <h2 className='pl-2'>telegram :</h2>
                     {profile.telegram ? profile.telegram.includes('https://t.me/') ? `@${profile.telegram.split('/').pop()}` : `@${profile.telegram}` : "no telegram account"}
                    </Link>

                    <Link target='_blank' className='flex hover:underline  max-md:border-b-2 border-light dark:border-dark w-auto gap-1' href={profile.facebook ? profile?.facebook?.includes('https://www.facebook.com/') ? profile?.facebook : `https://www.facebook.com/${profile?.facebook}` : "#"}>
                    <h2 className='pl-2'>facebook :</h2>
                     {profile.facebook ? profile.facebook.includes('https://www.facebook.com') ? `@${profile.facebook.split('/').pop()}` : `@${profile.facebook}` : "no facebook account"}
                    </Link>

                    <Link target='_blank' className='flex hover:underline  max-md:border-b-2 border-light dark:border-dark w-auto gap-1' href={profile.x ? profile?.x?.includes('https://x.com/') ? profile?.x : `https://x.com/${profile?.x}` : "#"}>
                    <h2 className='pl-2'>x :</h2> 
                     {profile.x ? profile.x.includes('https://x.com') ? `@${profile.x.split('/').pop()}` : `@${profile.x}` : "no x account"}
                    </Link>
                    

                </div>
                </div>
            
            </div>
        )}
      </div>
      
      <div className='flex flex-col gap-4 justify-center items-center'>
      {pendingPost ?  <div className='flex gap-2 items-center justify-center'> loading Profiles <RefreshCw className="animate-spin"/> </div> :
        <div className='flex gap-2 items-center justify-center my-16 '>  
           <h1 className='text-3xl'>{postForPage !== undefined && postForPage?.length > 1 ? "Items" : postForPage?.length === 1 ? "Item" : "no items"}
            </h1> 
            <div className='dark:text-light text-dark font-bold'>
                
            </div> 
        </div>}
        <div className={cn('grid items-center justify-center bg-zinc-200 dark:bg-zinc-800  p-10 gap-10 gap-y-20  max-md:gap-5 grid-flow-row grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-y-20',{
            "hidden": posts === undefined || posts.length === 0
        })}>
    {postForPage !== undefined && postForPage.map((post) => (
        <Link href={`/product/${post.id}`} key={post.id} className='hover:shadow-lg hover:dark:shadow-zinc-400 hover:shadow-black transition-shadow duration-100 flex-col w-[256px] gap-4 border-2 overflow-hidden rounded-xl border-b-2 border-dark dark:border-white'>
            <div>
                <div className={cn("",{
                "contrast-50": post.isSold === true,

                })}>
                    <Image src={post.file !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string)[0]}`:''} alt="company Image" width={256} height={208} className="w-full h-52 rounded-sm"/>
                </div>
            </div>
            <div className='flex text-sm justify-between gap-6 px-2 bg-dark text-light dark:bg-light dark:text-dark font-semibold '>
            <div className='flex flex-col gap-[2px] mt-[2px]'>
                <h1>{post.title.split(" ")[0]}...</h1>
                <h1>{post.catagory}</h1>
            </div>
            <div className='flex flex-col justify-between'>
                <h1 className={cn("mt-1",{
                    "text-red-500 font-bold": post.isSold
                })}>{post.isSold ? "solded" : post.price}</h1>
               
            </div>
            </div>
        </Link>
    ))}
        </div>
        <div className='mt-10' hidden={((totalPages === 1) || (totalPages === 0) ? true : false) || posts === undefined}>
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
