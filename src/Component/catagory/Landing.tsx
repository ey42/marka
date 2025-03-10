"use client"
import Link from "next/link"
import Image from "next/image"
import MaxWidthWrapper from "../MaxWidthWrapper"
import { Suspense, useContext, useEffect } from "react"
import { trpc } from "@/app/_trpc/client"
import PaginationComponent from "../paginationComponent"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import Search from "../Search"
import ThemeContext from '@/context/themeContext'
import { Frown, MapPin, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import  PostSkeleton  from "@/Component/PostSkeleton"
import { extractTimeAndDate } from "../Database"
import Post from "../Post"



const Landing = () => {
  const {refetch} = trpc.database.deleteSolded.useQuery()  
  const {data : data , isPending: pending, refetch: fetchAgain, isError} = trpc.database.getAllPosts.useQuery()  
  const {data: Catagory, isPending: loading, isError: error } = trpc.database.getCatagoriesName.useQuery()
  const AllCatagory = Catagory?.AllCatagory
  const posts = data?.allPosts
  const postsCount: number = (data?.postCount[0].count) as number
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(postsCount / 50)
  const postForPage = posts?.slice((currentPage - 1) * 50, currentPage * 50)
  const {search} = useContext(ThemeContext)
  localStorage.removeItem("postcount")
  const falseArrayOnPost = Array.from({length:  7}, () => "items") 
  const falseArrayOnCatagory =  Array.from({length: 10}, () => "items")

  useEffect(() => {
refetch()
fetchAgain()
  }, [posts, refetch, fetchAgain])
  return (
    <MaxWidthWrapper> 
       <div className="text-sm mt-16 flex flex-1 justify-center items-center bg-light dark:bg-dark w-full text-black dark:text-light font-mono">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className={cn(" flex px-2 flex-wrap mb-5 items-start justify-center mt-4 gap-5 max-md:w-full",{
            "hidden" : search 
          })}>
            {AllCatagory !== undefined && AllCatagory !== null ?  AllCatagory.map((catagory) => (
                <Link href={`post/catagory-post/${catagory.categories}`} className=" flex flex-col justify-center items-center truncate overflow-hidden max-w-20 gap-1 " key={catagory.id}>
                  <div className=" max-w-12 max-h-12 text-wrap bg-zinc-300 dark:bg-zinc-800  text-light  tracking-wider dark:text-dark   rounded-lg py-1 px-1 ">
                     <Image src={catagory !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(catagory.Imagefile as string)}`:''} width={300} height={300} alt={catagory.categories} className="rounded-md w-10 h-10" loading="lazy"/>
                  </div>
                <div className="truncate w-full overflow-hidden">
                <h1 className="font-semibold text-center text-wrap">{catagory.categories.replace(/_/g, ' ')}</h1>
                </div>
                 
                </Link>
            )) : loading ? <div className="text-lg flex gap-5 font-bold justify-center items-center self-center">{falseArrayOnCatagory.map((i) => (
              <Skeleton className=" max-w-12 w-12 h-12 max-h-12 text-wrap bg-zinc-300 dark:bg-blacks text-light  tracking-wider dark:text-dark   rounded-lg py-1 px-1 " key={i}>

              </Skeleton>
            ))}  </div> : <div className="flex justify-center items-center gap-2"><h1 className="text-lg font-bold self-center">no catagories found </h1><Frown /></div> }
          </div>
          <div className="z-10 mb-10 w-full">
             <Search/>
          </div>
         

          <div  className={cn("drop-shadow-2xl max-w-[1000px] shadow-2xl dark:shadow-light shadow-gray-800 Landing-image flex rounded-lg mt-6 flex-col items-center justify-center gap-6 bg-dark dark:bg-light h-60 mb-20",{
            "hidden": search 
          })}>
            <div className=" flex flex-1 flex-col drop-shadow-2xl shadow-2xl shadow-black  dark:shadow-gray-800 items-center justify-center px-2 bg-dark dark:bg-light text-light dark:text-dark rounded-lg">
            <h1 className="text-7xl text-center font-bold">Ethiopians</h1>
            <p className="text-lg text-center font-bold">market place</p>
            </div>
            <Image src='/m.jpg' alt="merkato" width={800} height={200} content="cover" className="w-full flex flex-1 rounded-b-lg drop-shadow-xl dark:shadow-slate-400 dark:shadow-xl shadow-2xl border-2 border-dark dark:border-light shadow-dark h-60" priority style={{objectFit: "cover"}}/>
          </div>
          <div className={cn("flex min-h-64 w-full bg-zinc-200 dark:bg-zinc-800 max-md:w-full p-5 rounded-md mt-10 ",{
            "hidden": search,
            "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 min-h-64 max-w-full bg-zinc-200 gap-y-8 dark:bg-zinc-800 max-md:w-full p-5 rounded-md mt-10": postForPage !== undefined
          })} >
            {postForPage !== undefined  ? postForPage?.map((post) => (
              <Suspense key={post.id} fallback={<PostSkeleton/>}>
                <Post post={post} />
                </Suspense>
              
            ))  : pending ? <div className="grid grid-cols-2 sm:grid-cols-2 w-full min-w-full md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-y-8 gap-4">{ falseArrayOnPost.map((i) =>  <PostSkeleton key={i}></PostSkeleton> )}</div> : <div className="flex justify-center items-center gap-2"><h1 className="text-lg mx-auto font-bold self-center">no post found </h1><Frown /></div> }
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