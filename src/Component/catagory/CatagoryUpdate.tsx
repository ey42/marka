"use client"
import { trpc } from "@/app/_trpc/client"

import { convertBlobUrlToFIle } from "@/Component/Database"
import {  uploadImagetoCatagoryStorage} from "@/supabase/storage/Storages"
import { useState,  useEffect, ChangeEvent, FormEvent,  } from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Authclient } from "@/lib/auth-client"
import { Images } from "../Image"



const {useSession} = Authclient
    const CatagoryUpdate = () => {
    const [image, setImage] = useState<string>()
    const [description, setDescription] = useState<string>("") 
    const [catagory, setCatagory] = useState<string>("")
    const [formSubmitted, setFormSubmited] = useState<boolean>(false)    
    const router = useRouter()
    const {data } = useSession()
    const session = data?.session;
    const userId = session?.userId
    // const [isPending, startTransition] = useTransition()
    const {data : access , error, status, refetch} = trpc.database.getCatagoriesName.useQuery()
    const {mutate: upload, } = trpc.database.uploadCatagories.useMutation({
      onSuccess: () => {
        console.log('Success! Uploading categories...');
        setFormSubmited(false); // Reset form state after success
        router.refresh()
        refetch(); // Navigate to categories page
      },
      onError: (err) => {
        console.error('Error uploading categories:', err);
      },})
      
        
      

    const handleOnChange = async(e:ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!
   Images(file, e).then(imageUrl => {
    console.log("image came from image funcrion : "+ imageUrl)
    setImage(imageUrl)
    refetch()
  }).catch(error => {
    console.error("error processing image : " + error)
  })
   
   
    }
    const handleCatagories = (e:ChangeEvent<HTMLInputElement>) => {
      setCatagory(e.target?.value)
      
    }
    const handleDescription = (e:ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target?.value)
     
    }
   
   const onsubmit = async(e:FormEvent<HTMLFormElement>) => {
  e.preventDefault()
    console.log("trigger")
    setFormSubmited(true)
    try{
   const filePromise = convertBlobUrlToFIle(image as string)
   const file: File | undefined = await filePromise
   console.log(file?.name)
   const bucket:string = "Images"
   const folder:string = "catagoryImage"
   
   const imageUrl = uploadImagetoCatagoryStorage({file, bucket, folder, catagoryName: access as string[], catagory: catagory})
   const url  = await imageUrl 
   upload({
    categories: catagory as string,
    description: description as string,
    Imagefile: url as string,
    userId: userId as string
  }) 
    router.refresh()
    await refetch()
  } catch(error){
    console.error('Error uploading categories:', error);
    setFormSubmited(false); // Reset form state on error
    } 
 }
   useEffect(()=>{
 
    return () => {
      setFormSubmited(false)
      setCatagory("")
      setDescription("")
      setImage("")
       refetch()

    }
  
   },[formSubmitted])

  return (
    <div className="mt-4 ml-4 flex items-center justify-center border-1 rounded-md dark:border-slate-300 border-dark w-full">
      <div className="flex flex-row max-lg:flex-col max-lg:justify-center max-lg:items-center justify-between max-sm:ml-2 max-sm:justify-start max-sm:items-start">
        <form onSubmit={onsubmit} className="flex flex-col gap-5 mt-4 items-center justify-center">
          <div className="w-52 h-52 rounded-md text-dark dark:text-light font-bold">
            <Image src={image as string} alt="catagory image" width={208} height={208} className="w-52 h-52 rounded-md border-2 dark:border-slate-300 border-dark"/>
          </div>
          <div className="ml-0 flex gap-4 flex-col">
          <div className="w-56 cursor-pointer bg-light dark:bg-dark rounded-md text-dark dark:text-slate-300 ">
         
            <Input type="file" onChange={(e) => handleOnChange(e)} className=" h-9 file:text-sm p-0 font-semibold font-mono text-dark dark:text-slate-50 border-1 rounded-md dark:border-slate-300 border-dark dark:file:text-slate-50 file:font-semibold file:text-dark file:border-1 file:border-dark dark:file:border-slate-50 file:bg-slate-50 file:mr-3 file:rounded-md file:h-full dark:file:bg-dark file:cursor-pointer cursor-pointer text-nowrap" accept="image/*"/>
            </div> 
          <div className="flex gap-4 rounded-md">
           <input className= " placeholder:text-gray-500 focus:placeholder:text-transparent max-sm:w-40 w-full h-9 p-0 dark:text-slate-300 text-dark font-bold text-sm dark:bg-dark rounded-md border-2 border-dark dark:border-slate-300 pl-1 focus:ring-1 dark:focus:ring-slate-300 focus:ring-dark focus:outline-none dark:focus:bg-neutral-800" id="catagory" type="text" onChange={(e) => handleCatagories(e)} value={catagory} placeholder="catagory name" required/>
            </div>
           <div className="flex gap-4"> 
           <Textarea className="w-80 border-2 border-dark dark:border-slate-300 transition-all duration-200 placeholder:text-gray-500 focus:placeholder:text-transparent text-dark dark:text-slate-300 font-bold text-sm focus:outline-none max-sm:w-40 focus:ring-1 focus:ring-dark dark:focus:ring-slate-300 dark:focus:bg-neutral-800" id="description" onChange={(e) => handleDescription(e)} value={description} placeholder="description"/>
           </div>
           
           <div className="flex">
            <Button type="submit" className="dark:bg-white max-sm:w-40 w-full  bg-gray-950 font-bold text-white dark:text-gray-950 dark:hover:bg-slate-300 hover:bg-gray-900 transition-all duration-200 ">{formSubmitted ? "uploading" : "upload catagory"}</Button>
            </div>
            </div>
        </form>
        <div className={`max-sm:w-40 font-mono text-dark dark:text-slate-50 text-sm flex flex-col max-lg:justify-center max-lg:items-center justify-start max-sm:justify-start max-sm:items-start lg:ml-36 gap-4 max-sm:ml-0`}> <h1 className="text-center transition-all duration-200 font-semibold text-lg">
          {access !== undefined && access.length > 0 ?`These are list of ${access?.length! <= 1 ? "catagory" : "catagories"} in the database `: `no catagories`}</h1>
          
                  <ul className="text-sm font-semibold max-md:grid-rows-10 max-sm:grid-cols-1  grid grid-cols-3 grid-flow-row gap-x-10 gap-5 dark:marker:text-white list-none items-center max-sm:justify-start max-sm:items-start justify-center">
                { 
access !== undefined ? access.map((n) => (
  <li key={n} className="border-2 dark:border-slate-50 w-32 bg-slate dark:bg-dark transition-all duration-200 border-dark h-11 overflow-hidden outline-1 ring-1 rounded-md ring-green-300 text-center  px-2 "> {n} </li>
                )
              ) : "loading..."
               } 
               </ul></div>
      </div>
    </div>
  )
}

export default CatagoryUpdate
