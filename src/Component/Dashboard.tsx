"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Authclient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";


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
    <div className="md:flex md:gap-6 md:items-center ">
    <div className="mt-4 ml-4 flex items-center justify-center dark:text-green-300 text-dark">
   
   <div className="relative border flex rounded-full justify-center items-center w-20 h-20 border-dark dark:border-slate-400 ">
<Image
src={profile.image!}
alt="image"
width={80}
height={80}
className="rounded-full"
/>
                </div>
  
    </div>
    <div className="ml-2 mt-5  flex flex-col gap-4">
      <h1>first Name: {`${firstName}`}</h1>
      <h1>Last Name: {`${lastName}`}</h1>
      <h1>email: {email}</h1>
      <h1>{stars} stars</h1>
      { users?.id !== profile_id ? (<div className={users ? "flex flex-col gap-4" : "hidden"}>
      <label htmlFor="comment"> comment : 
      <input className="border-none p-2" type="text" placeholder="type a comment" id="comment" />
      </label>

      <Button> Submit </Button>
    
      <div className="flex gap-2">
        <h1>Thank you {firstName}:</h1>
        <p>
my name is eyueal
        </p>
      </div>
      </div>
        ): ("")
      }
    </div>
    </div>
  )
}

export default Dashboard
