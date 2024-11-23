"use client"
import Link from "next/link"
import Image from "next/image"
import MaxWidthWrapper from "../MaxWidthWrapper"

// type MyDataType = File | string | ArrayBuffer | null ;

const Landing = ({AllCatagory}: {AllCatagory: Catagoryprops[]}) => {
  
  
  return (
    <MaxWidthWrapper> 
        <div className="flex justify-center flex-col gap-4">
          <h1 className="text-center mb-4 text-dark dark:text-slate-50 font-bold text-4xl">{AllCatagory.length > 1 ?"CATAGORIES":"CATAGORY"}</h1>
<div className='dark:bg-dark bg-slate-300  dark:text-slate-300 text-dark justify-center w-full items-center grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 gap-y-20 '>
{AllCatagory.map((catagory)=>(
  <div key={catagory.id} className=" text-wrap h-52 rounded-lg bg-slate-200 truncate">
  <Link href="#"  className=" flex flex-col gap-2 h-40 w-52 rounded-lg dark:text-dark text-slate-300 ">
<div className="">
<Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${catagory.Imagefile as string}`} alt={`image of ${catagory.categories}...`} width={400} height={400} className=" w-52 h-40 border-b-2" loading="lazy"/>
</div>
<h1 className="text-slate-50 dark:text-dark text-lg font-semibold text-center leading-5 h-7">{catagory.categories}</h1>
  </Link>
  </div>
))}
</div> 
</div>
 </MaxWidthWrapper>
)
}

export default Landing