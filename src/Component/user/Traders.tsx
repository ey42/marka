"use client"
import { trpc } from "@/app/_trpc/client"
import Image from "next/image"
import Link from "next/link"
const Traders = () => {
  const {data: access} = trpc.database.getProfiles.useQuery()
  return (
    <div>
      <div className="flex dark:text-light text-dark flex-col gap-10 font-mono items-center justify-center">
        <h1 className="text-2xl font-bold">Traders</h1>
        <h1 className="text-xl font-bold">Here you can find all the traders</h1>
       {access !== undefined && access.map((profile) =>(
        <Link href={`traders/${profile.userContent.id}`} key={profile.id} passHref className="flex border-2 dark:border-light border-dark w-1/2 max-md:w-full overflow-hidden rounded-xl flex-col px-2 gap-4">
       
          <div className="flex flex-row items-center justify-between w-full rounded-lg">
          <div className="flex ">
          <Image src={profile.imageFile !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${profile?.imageFile as string}`:''} alt="company Image" width={50} height={50} className="w-14 h-14 border-2 dark:border-light border-dark rounded-full"/>
        </div>
          <div className="flex flex-col items-center justify-center font-bold">
            <h1>{profile.companyName}</h1>
            <h1>{profile.userContent.name}</h1>
            <h1>{profile.type}</h1>
          </div>
          <div>
            <h1 className="text-green-500 font-bold">approved</h1>
          </div>
        </div>
      </Link>
       ) ) }
      </div>
    </div>
  )
}

export default Traders
