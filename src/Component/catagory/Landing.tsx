"use client"
import Link from "next/link"
import Image from "next/image"
import MaxWidthWrapper from "../MaxWidthWrapper"
import { useContext, useEffect } from "react"
import { trpc } from "@/app/_trpc/client"
import PaginationComponent from "../paginationComponent"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import Search from "../Search"
import ThemeContext from '@/context/themeContext'
import { Frown } from "lucide-react"



const Landing = () => {
  const {refetch} = trpc.database.deleteSolded.useQuery()  
  const {data : data , refetch: fetchAgain} = trpc.database.getAllPosts.useQuery()  
  const {data: Catagory, isLoading: loading } = trpc.database.getCatagoriesName.useQuery()
  const AllCatagory = Catagory?.AllCatagory
  const posts = data?.allPosts
  const postsCount: number = (data?.postCount[0].count) as number
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(postsCount / 50)
  const postForPage = posts?.slice((currentPage - 1) * 50, currentPage * 50)
  const {search} = useContext(ThemeContext)

  useEffect(() => {
refetch()
fetchAgain()
  }, [posts, refetch, fetchAgain])
  return (
    <MaxWidthWrapper> 
       <div className="text-sm mt-16 text-black dark:text-light font-mono ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className=" flex flex-wrap mb-5 justify-start items-start mt-4 gap-3 w-full">
            {AllCatagory !== undefined && AllCatagory !== null ? AllCatagory.map((catagory) => (
                <Link href={`post/catagory-post/${catagory.categories}`} className=" bg-dark hover:bg-black dark:hover:bg-zinc-200 text-light dark:bg-light tracking-wider dark:text-dark border-2 border-dark dark:border-light rounded-md py-1 px-2" key={catagory.id}>
                 <h1 className="font-semibold">{catagory.categories.replace(/_/g, ' ')}</h1>
                </Link>
            )): loading ? <h1 className="text-lg font-bold self-center">loading... catagories </h1> : <div className="flex gap-2"><h1 className="text-lg font-bold self-center">no catagories found </h1><Frown /></div> }
          </div>
          <div className="z-10 mb-10 max-md:w-full">
             <Search/>
          </div>
         

          <div  className={cn("drop-shadow-2xl shadow-2xl dark:shadow-light  shadow-gray-800 Landing-image flex rounded-lg mt-6 flex-col items-center justify-center gap-6 bg-dark dark:bg-light mx-4 h-60 mb-20",{
            "hidden": search
          })}>
            <div className=" flex flex-1 flex-col drop-shadow-2xl shadow-2xl shadow-black  dark:shadow-gray-800 items-center justify-center px-2 bg-dark dark:bg-light text-white dark:text-black rounded-lg">
            <h1 className="text-7xl text-center font-bold">Ethiopians</h1>
            <p className="text-lg text-center font-bold">market place</p>
            </div>
            <Image src='/m.jpg' alt="merkato" width={800} height={200} content="cover" className="w-full flex flex-1 rounded-b-lg drop-shadow-xl dark:shadow-slate-400 dark:shadow-xl shadow-2xl border-2 border-dark dark:border-light shadow-dark h-60" priority style={{objectFit: "cover"}}/>
          </div>
          <div className={cn("grid grid-cols-1 bg-zinc-200 dark:bg-zinc-800 p-10 rounded-md mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",{
            "hidden": search || posts === undefined || posts.length === 0

          })}>
            {postForPage?.map((post) => (
                <Link href={`product/${post.id}`} key={post.id} className="border-2 group bg-dark dark:bg-light border-black dark:border-light rounded-md hover:shadow-lg min-w-52 hover:shadow-black dark:hover:shadow-zinc-400 transition-shadow duration-100">
                  <div className={cn("flex flex-col items-center justify-center",{
                    "contrast-50": post.isSold === true,
                  })}>
                    <Image src={post !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string[])[0]}`:''} width={600} height={450} alt={post.title} className="w-full h-48 rounded-t-sm border-b-2 border-light dark:border-black" loading="lazy"/>
                   
                  </div>
                  <div className="flex justify-between gap-6 bg-dark transition-all duration-100 group-hover:bg-black group-hover:dark:bg-zinc-200 rounded-b-sm dark:bg-light text-light dark:text-black">
                  <div className="flex flex-col ml-1 justify-between">
                  <h1 className="font-semibold overflow-hidden text-ellipsis">{post.title.split(" ")[0]}...</h1>
                  <h1 className={cn("font-semibold",{
                    "text-black bg-red-500 rounded-md bottom-0 px-1 font-bold": post.isSold === true
                  })}>{post.isSold ? "solded" : ''}</h1>
                  <h1>{!post.isSold && `ETB ${post.price}`}</h1>
                  </div>
                  <div className="flex flex-col justify-between mr-2">
                  <h1 className="overflow-hidden text-ellipsis">{post.author.name.split(' ')[0]}</h1>
                  <h1 className="overflow-hidden text-ellipsis">{post.postProfile.companyName}</h1>
                  </div>
                  </div>
                 
                </Link>
              
            ))}
          </div>
        <div className='mt-10' hidden={((totalPages === 1) || (totalPages === 0) ? true : false) || posts === undefined}>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => {
            const pages = new URL(window.location.href)
            pages.searchParams.set('page', page.toString())
            router.push(pages.toString())
        }}/>
        </div>
        </div>
       </div>
 </MaxWidthWrapper>
)
}

export default Landing