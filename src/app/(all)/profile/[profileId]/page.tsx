import Dashboard from "@/Component/Dashboard"
import { db } from "@/drizzle";
import * as schema from "@/drizzle/db/schema"

interface PageProps {
  params: {
    profileId: string
  }
}


const page = async({params}:  PageProps) => {



  const profile_id = params.profileId
  // const profile_id: number = Number(profileId)
  
  return (
    <div className="w-screen">
      <Dashboard profile_id = {profile_id} />
    </div>
  )
}

export default page
