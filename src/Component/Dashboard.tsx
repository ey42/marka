"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Authclient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { extractTimeAndDate } from "./Database";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";
import { RefreshCw } from "lucide-react";



interface DashboardProps {
  profile_id: string;

}

const  Dashboard = ({profile_id}: DashboardProps) => {

  const {data: success , isPending} = trpc.database.getUsers.useQuery({id: profile_id as string})
  const user = success?.activeUser
  const {data: access} = trpc.database.getProfiles.useQuery()
  const p = access?.profiles
  const profiles = p?.find((profile) => profile.userContent.id === profile_id)

  const profile = user
  const firstName:string = profile !== undefined ? profile.name.split(' ')[0] : ""
  const lastName:string = profile !== undefined ? profile.name.split(' ')[1] : ""
  const email: string = profile !== undefined ? profile.email : " "
  const stars: number = 10


  
  return (
    <div className="flex justify-center items-start mt-10 h-screen">
    <div className="flex w-1/3 max-lg:w-1/2 max-md:w-auto items-center justify-center flex-col px-2 gap-6 bg-dark dark:bg-light dark:text-dark text-light rounded-sm">
    <div className="mt-4 ml-4 flex items-center justify-center ">
   
   <div className="relative border flex rounded-full justify-center items-center w-36 h-36 border-dark dark:border-slate-400 ">
<Image
src={profile !== undefined ? `${profile.image}`:''}
alt="image"
width={200}
height={200}
className="rounded-full"
/>
                </div>
  
    </div>
    <div className="ml-2 text-lg font-mono mt-5 w-full font-bold mr-2 mb-2 bg-light  rounded-md text-black dark:text-light dark:bg-dark  flex flex-col gap-2">
     <div className="flex p-2 gap-2 border-b-2 border-dark dark:border-light">
      <h1>name: </h1>
      <h1>{`${firstName} ${lastName}`}</h1>
     </div>
     <div className="flex p-2 gap-2 border-b-2 border-dark dark:border-light">
      <h1>email: </h1>
      <h1>{`${email}`}</h1>
     </div>
     <div className="flex p-2 gap-2 border-b-2 border-dark dark:border-light">
      <h1>role: </h1>
      <h1>{profile !== undefined ? profile.role === "merchant" && profile.accepted === "none" ? `requesting for merchant` : profile.role === "customer" && profile.accepted === "none" ? "customer" : profile.role === "merchant" && profile.accepted === "accept" && profiles !== undefined && <Link href={`traders/${profiles.userContent?.id}`} className="hover:underline text-blue-700">
      <h1>merchant</h1>
   </Link> : <RefreshCw className="animate-spin"/> }</h1>
     </div>
     <div className="flex p-2 gap-2 border-b-2 border-dark dark:border-light">
      <h1>{profile?.createdAt && !profile?.updatedAt ? "created-at" : "updated-at"}: </h1>
      <h1>{profile !== undefined ? `before ${profile?.createdAt && !profile?.updatedAt ? extractTimeAndDate(String(profile?.createdAt)).diffInDays: extractTimeAndDate(String(profile?.updatedAt)).diffInDays} days` : <RefreshCw className="animate-spin"/>}</h1>
     </div>
    </div>
    </div>
    </div>
  )
}

export default Dashboard
