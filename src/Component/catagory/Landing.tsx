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



const Landing = ({AllCatagory}: {AllCatagory: Catagoryprops[]}) => {
  const {refetch} = trpc.database.deleteSolded.useQuery()  
  const {data : data , refetch: fetchAgain} = trpc.database.getAllPosts.useQuery()  
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
  }, [])
  
  return (
    <MaxWidthWrapper> 
       <div className="text-sm text-black dark:text-light font-mono ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className=" flex flex-wrap mb-5 justify-start items-start mt-4 gap-3 w-full">
            {AllCatagory.map((catagory) => (
                <Link href={`post/catagory-post/${catagory.categories}`} className=" bg-dark text-light dark:bg-light tracking-wider dark:text-dark border-2 border-dark dark:border-light rounded-md py-1 px-2" key={catagory.id}>
                 <h1 className="font-semibold">{catagory.categories.replace(/_/g, ' ')}</h1>
                </Link>
            ))}
          </div>
          <div className="z-10 ">
             <Search/>
          </div>
         
          <div>
            
          </div>
          <div  className={cn("Landing-image flex rounded-lg mt-6 flex-col items-center justify-center gap-6 bg-dark dark:bg-light h-60 mb-20",{
            "hidden": search
          })}>
            <div className="flex flex-1 flex-col items-center justify-center px-2 bg-dark dark:bg-light text-white dark:text-black rounded-lg">
            <h1 className="text-7xl text-center font-bold">Ethiopians</h1>
            <p className="text-lg text-center font-bold">market place</p>
            </div>
            <Image src='/m.jpg' alt="merkato" width={800} height={200} content="cover" className="w-full flex flex-1 rounded-b-lg  h-60" priority style={{objectFit: "cover"}}/>
          </div>
          <div className={cn("grid grid-cols-1 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",{
            "hidden" : search
          })}>
            {postForPage?.map((post) => (
                <Link href={`product/${post.id}`} key={post.id} className="border-2 bg-dark dark:bg-light border-black dark:border-light rounded-md">
                  <div className={cn("flex flex-col items-center justify-center",{
                    "contrast-50": post.isSold === true,
                  })}>
                    <Image src={post !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string[])[0]}`:''} width={600} height={450} alt={post.title} className="w-60 h-48 rounded-t-sm border-b-2 border-light dark:border-black" loading="lazy"/>
                   
                  </div>
                  <div className="flex justify-between bg-dark rounded-b-sm dark:bg-light text-light dark:text-black">
                  <div className="flex flex-col ml-1 justify-between">
                  <h1 className="font-semibold">{post.title}</h1>
                  <h1 className={cn("font-semibold",{
                    "text-black bg-red-500 rounded-md bottom-0 px-1 font-bold": post.isSold === true
                  })}>{post.isSold ? "solded" : ''}</h1>
                  <h1>{!post.isSold && `ETB ${post.price}`}</h1>
                  </div>
                  <div className="flex flex-col justify-between mr-2">
                  <h1>{post.author.name}</h1>
                  <h1>{post.postProfile.companyName}</h1>
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