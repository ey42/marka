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
  const posts:postProps[] = await db.query.post.findMany({
    where: (post, {eq}) => eq(post.userId, userId),
   with:{
    author : true,
    likeAndDislikePost: true,
    postCatagory :true,
    postProfile: true,
    postSeen: true
   }
}) 

  return (
    <div className="flex flex-col">
     <PostUserOnly catagoryName = {catagoryName}  userId = {userId} />
    
    </div>
  )
}

export default page
