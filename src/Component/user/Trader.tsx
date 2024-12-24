"use client"
import { trpc } from '@/app/_trpc/client'
import Image from 'next/image'
import Link from 'next/link'
import React,{useState} from 'react'

const Trader = ({id}: {id: string}) => {
    const {data: access} = trpc.database.getProfile.useQuery({id: id as string}) 
    const user = access?.user
    const profile = user?.userContent
  return (
    <div className='dark:text-light font-semibold font-mono text-dark'>
      <div className="flex flex-col items-center justify-center gap-4">
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
                        <h1 className='text-lg text-center font-bold'>
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
                  
                    <Link className='flex gap-1 truncate' href={profile.instagram ? profile?.instagram?.includes('https://www.instagram.com/') ? profile?.instagram : `https://www.instagram.com/${profile?.instagram}` : "#"}>
                    <h2>instagram :</h2>
                     {profile.instagram ? profile.instagram.includes('https://www.instagram.com') ? `@${profile.instagram.split('/').pop()}` : `@${profile.instagram}` : "no instagram account"}
                    </Link>

                    <Link className='flex gap-1' href={profile.telegram ? profile?.telegram?.includes('https://t.me/') ? profile?.telegram : `https://t.me/${profile?.telegram}` : "#"}>
                    <h2>telegram :</h2>
                     {profile.telegram ? profile.telegram.includes('https://t.me/') ? `@${profile.telegram.split('/').pop()}` : `@${profile.telegram}` : "no telegram account"}
                    </Link>

                    <Link className='flex gap-1' href={profile.facebook ? profile?.facebook?.includes('https://www.facebook.com/') ? profile?.facebook : `https://www.facebook.com/${profile?.facebook}` : "#"}>
                    <h2>facebook :</h2>
                     {profile.facebook ? profile.facebook.includes('https://www.facebook.com') ? `@${profile.facebook.split('/').pop()}` : `@${profile.facebook}` : "no facebook account"}
                    </Link>

                    <Link className='flex gap-1' href={profile.x ? profile?.x?.includes('https://x.com/') ? profile?.x : `https://x.com/${profile?.x}` : "#"}>
                    <h2>x :</h2> 
                     {profile.x ? profile.x.includes('https://x.com') ? `@${profile.x.split('/').pop()}` : `@${profile.x}` : "no x account"}
                    </Link>
                    

                </div>
                </div>
            
            </div>
        )}
      </div>
    </div>
  )
}

export default Trader
