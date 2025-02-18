"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Authclient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { extractTimeAndDate } from "./Database";


interface Users {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  role: "customer" | "merchant" | null;
  customerId: string | null;
}

interface DashboardProps {
  profile_id: string;
  user: Users[]
}
  const {useSession} = Authclient

const  Dashboard = ({profile_id,user}: DashboardProps) => {

  const {data: session, isPending, error} = useSession()
  const users = session?.user;

  const profile = user.filter((p) => profile_id === p.id)[0]
  const firstName:string = profile.name.split(' ')[0]
  const lastName:string = profile.name.split(' ')[1]
  const email: string = profile.email
  const stars: number = 10

  // const comment = Comment.filter((com) => com.commentId === profile_id)[0]

  
  return (
    <div className="flex justify-center items-start h-screen">
    <div className="flex w-1/3 max-lg:w-1/2 max-md:w-auto items-center justify-center flex-col px-2 gap-6 bg-dark dark:bg-light dark:text-dark text-light rounded-sm">
    <div className="mt-4 ml-4 flex items-center justify-center ">
   
   <div className="relative border flex rounded-full justify-center items-center w-36 h-36 border-dark dark:border-slate-400 ">
<Image
src={profile.image!}
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
      <h1>{`${profile.role}`}</h1>
     </div>
     <div className="flex p-2 gap-2 border-b-2 border-dark dark:border-light">
      <h1>{profile.createdAt && !profile.updatedAt ? "created-at" : "updated-at"}: </h1>
      <h1>{`before ${profile.createdAt && !profile.updatedAt ? extractTimeAndDate(String(profile.createdAt)).diffInDays: extractTimeAndDate(String(profile.updatedAt)).diffInDays} days`}</h1>
     </div>
    </div>
    </div>
    </div>
  )
}

export default Dashboard
