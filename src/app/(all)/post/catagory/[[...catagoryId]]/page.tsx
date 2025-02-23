import PostUserOnly from "@/Component/Post/PostUserOnly"
import { db } from "@/drizzle"
import Image from "next/image"


interface PageProps {
    params: {
      catagoryId: string[]
    }
  }
const page = async({params}: PageProps) => {
  const catagoryName = params.catagoryId[0]
  const userId = params.catagoryId[1]

  return (
    <div className="flex flex-col">
     <PostUserOnly catagoryName = {catagoryName}  userId = {userId} />
    </div>
  )
}

export default page
