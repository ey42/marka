"use client"
import Link from "next/link"
import Image from "next/image"
import MaxWidthWrapper from "../MaxWidthWrapper"
import { useEffect } from "react"
import { trpc } from "@/app/_trpc/client"


const Landing = ({AllCatagory}: {AllCatagory: Catagoryprops[]}) => {
  const {refetch: fetchAgain, data: access} = trpc.database.deleteSolded.useQuery()
  useEffect(() => {
fetchAgain()
  },[])
  
  return (
    <MaxWidthWrapper> 
        <div className="flex justify-center flex-col gap-4">
          <h1 className="text-center mb-4 text-dark dark:text-slate-50 font-bold text-2xl tracking-widest font-mono">{AllCatagory.length > 1 ?"CATAGORIES":"CATAGORY"}</h1>
<div className=' dark:text-slate-300 text-dark justify-center w-full items-center grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 gap-y-20 '>
{AllCatagory.map((catagory)=>(
  <div key={catagory.id} className=" text-wrap h-52 border-2 border-dark rounded-lg bg-neutral-900 dark:bg-light truncate">
  <Link href="#"  className=" flex flex-col gap-2 h-40 w-52 rounded-lg ">
<div className="">
<Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${catagory.Imagefile as string}`} alt={`image of ${catagory.categories}...`} width={400} height={400} className=" w-52 h-40 border-b-2" loading="lazy"/>
</div>
<div className="flex justify-between text-slate-50 dark:text-neutral-900 font-semibold font-mono text-md text-start">
  <h1 className=" px-2 leading-5 h-7 ">{catagory.categories.replace(/_/g, ' ')}</h1>
  <div className="flex flex-col">
    <p className="ml-2 -mb-2 pr-2">200</p>
    <p>posts</p>
  </div> 
</div>
  </Link>
  </div>
))}
</div> 
</div>
 </MaxWidthWrapper>
)
}

export default Landing