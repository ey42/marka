import UpdatePost from "@/Component/Post/Update"

interface PageProps {
    params: {
      postId: string
    }
  }

const page = ({params} : PageProps) => {
    const id : string = params.postId
  return (
    <div>
      <UpdatePost id={id}/>
    </div>
  )
}

export default page
