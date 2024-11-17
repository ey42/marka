import Dashboard from "@/Component/Dashboard"
import { db } from "@/drizzle";
import * as schema from "@/drizzle/db/schema"

interface PageProps {
  params: {
    profileId: string
  }
}

interface User {
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


const page = async({params}:  PageProps) => {

  
  const user:User[]  =  await db.select().from(schema.user)
  // const NewUser:User[] = []


  // user.map((user) => NewUser.push(user))

  const profile_id = params.profileId
  // const profile_id: number = Number(profileId)
  
  return (
    <div className="w-screen">
      <Dashboard profile_id = {profile_id} user = {user}/>
    </div>
  )
}

export default page
