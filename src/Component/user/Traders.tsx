"use client"
import { trpc } from "@/app/_trpc/client"
import Image from "next/image"
import Link from "next/link"
const Traders = () => {
  const {data: accesses} = trpc.database.getProfiles.useQuery()
  const access = accesses?.profiles
  return (
    <div className="flex items-center justify-center  rounded-md mx-auto">
      <div className="flex dark:text-light w-full text-dark flex-col gap-10 font-mono items-center justify-center">
        <h1 className="text-2xl font-bold">Traders</h1>
        <h1 className="text-xl font-bold">Here you can find all the traders</h1>
        <div className="flex flex-col  items-center w-full gap-10 p-20">
       {access !== undefined && access.map((profile: any) =>( 
        profile.userContent.accepted === "accept" ?
        <Link href={`traders/${profile.userContent.id}`} key={profile.id} passHref className="flex  transition-all duration-200 text-light dark:text-dark border-2 bg-dark hover:bg-black hover:dark:bg-zinc-200  dark:bg-light dark:border-light hover:dark:border-black border-dark w-1/2 max-md:w-full overflow-hidden rounded-xl flex-col p-2 gap-4">
       
          <div className="flex flex-row items-center justify-between w-full rounded-lg">
          <div className="flex flex-col gap-2">
          <Image src={profile.imageFile !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${profile?.imageFile as string}`:''} alt="company Image" width={50} height={50} className="w-20 h-20 border-2 dark:border-dark border-light rounded-full"/>
            <h1 className="text-sm font-bold">company name : {profile.companyName ? profile.companyName : "don't have company name"}</h1>
        </div>
          
          <div>
            <h1 className="text-green-500 font-bold">approved</h1>
          </div>
        </div>
      </Link> : null
       ) ) }
       </div>
      </div>
    </div>
  )
}

export default Traders
