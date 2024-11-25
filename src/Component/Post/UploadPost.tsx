"use client"
import { trpc } from "@/app/_trpc/client"

import { convertBlobUrlToFIle } from "@/Component/Database"
import {  uploadImagetoPostStorage } from "@/supabase/storage/Storages"
import { useState,  useEffect, ChangeEvent, FormEvent,  } from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Images } from "../Image"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import MaxWidthWrapper from "../MaxWidthWrapper"
import { Authclient } from "@/lib/auth-client"
import Link from "next/link"


const {useSession} = Authclient



    const UploadPost = () => {
    const [image, setImage] = useState<string>("")
    const [description, setDescription] = useState<string>("") 
    const [title, setTitle] = useState<string>("")
    const [formSubmitted, setFormSubmited] = useState<boolean>(false)    
    const [open, setOpen] = useState(false)
    const [catagory, setCatagory] = useState<string>("")
    const [price, setPrice] = useState<string>()
    const {data } = useSession()
    const session = data?.session;
    const userId = session?.userId
   
    const router = useRouter()
    const {data: success , refetch: fetchAgain} = trpc.database.getPosts.useQuery({id: userId as string})
    const {data : access , refetch} = trpc.database.getCatagoriesName.useQuery()
    const {mutate: upload, isError, isSuccess, isPending} = trpc.database.uploadPost.useMutation({
      onSuccess: () => {
        console.log('Success! Uploading post...');
        setFormSubmited(false); // Reset form state after success
        router.refresh()
        refetch();
        fetchAgain(); // Navigate to categories page
      },
      onError: (err) => {
        console.error('Error uploading post:', err);
        refetch();
        fetchAgain()
      },})
      
        const catagoryName = success?.postCatagory
        const posts = success?.posts
      

    const handleOnChange = async(e:ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!
   Images(file, e).then(imageUrl => {
    console.log("image came from image function : "+ imageUrl)
    setImage(imageUrl!)
    refetch()
    fetchAgain()
  }).catch(error => {
    console.error("error processing image : " + error)
    refetch()
    fetchAgain()
  })
   
   
    }
    const handleTitle = (e:ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target?.value)
      
    }
    const handleDescription = (e:ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target?.value)
     
    }
    const handlePrice = (e: ChangeEvent<HTMLInputElement>) => {
      const value  = e.target.value
      setPrice(value)
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
   const folder:string = "postImage"
   
   const imageUrl = uploadImagetoPostStorage({file, bucket, folder, title: title, catagory: catagory})
   const url  = await imageUrl 
   upload({
    catagory: catagory as string,
    description: description as string,
    imagefile: url as string,
    title: title as string,
    userId: userId as string,
    prices: price as string
  
  }) 

    router.refresh()
    await refetch()
    fetchAgain()
  } catch(error){
    console.error('Error uploading categories:', error);
    setFormSubmited(false); // Reset form state on error
    refetch()
    fetchAgain()
    } 
 }
   useEffect(()=>{
 
    return () => {
      setFormSubmited(false)
      setTitle("")
      setDescription("")
      setCatagory("")
      setImage("")
      setOpen(false)
      setPrice("")
      refetch()
      fetchAgain()

    }
  
   },[formSubmitted])

  return (
   <MaxWidthWrapper>
    <div className="mt-4 flex items-center justify-center border-1 rounded-md dark:border-slate-300 border-dark">
      <div className="flex flex-row max-lg:flex-col max-lg:justify-center justify-evenly max-lg:items-center max-lg:gap-12 w-full max-sm:ml-2 ml-4">
        <form onSubmit={onsubmit} className="flex flex-col gap-5 items-center justify-center ml-4">
          <div className="w-52 h-52 dark:bg-dark bg-slate-300 transition-all duration-200 rounded-lg text-slate-300 dark:text-dark font-bold border-2 border-dark dark:border-slate-300">
            <Image src={image as string} alt="catagory image" width={208} height={208} className="w-52 h-52 rounded-lg border-2 dark:border-slate-300 border-dark"/>
          </div>
          <div className="ml-0 flex gap-4 flex-col">
          <div className="w-56 cursor-pointer transition-all duration-200 bg-slate-300 dark:bg-dark rounded-md text-dark dark:text-slate-300 ">
         
            <Input type="file" onChange={(e) => handleOnChange(e)} className="  h-9 file:text-sm p-0 font-bold text-dark dark:text-slate-300 border-1 rounded-md dark:border-slate-300 border-dark dark:file:text-slate-300 file:font-bold file:text-dark file:border-1 file:border-dark dark:file:border-slate-300 file:bg-slate-300 file:mr-3 file:rounded-md file:h-full dark:file:bg-dark file:cursor-pointer cursor-pointer text-nowrap transition-all duration-200 file:duration-200 file:transition-all" accept="image/*" />
            </div> 
          <div className="flex gap-4 rounded-md">
           <input className= "transition-all max-sm:w-40 duration-200 placeholder:text-gray-500 focus:placeholder:text-transparent w-full h-9 p-0 dark:text-slate-300 text-dark font-bold text-sm dark:bg-dark rounded-md border-2 border-dark dark:border-slate-300 pl-1 focus:ring-1 dark:focus:ring-slate-300 bg-slate-300 focus:ring-dark focus:outline-none dark:focus:bg-neutral-800" id="catagory" type="text" onChange={(e) => handleTitle(e)} value={title} placeholder="Post title" required/>
            </div>
           <div className="flex gap-4"> 
           <Textarea className="w-80 border-2 max-sm:w-40 border-dark dark:border-slate-300 transition-all duration-200 placeholder:text-gray-500 dark:focus:placeholder:text-transparent dark:placeholder:text-gray-500 focus:placeholder:text-transparent text-dark dark:text-slate-300 font-bold text-sm bg-slate-300 dark:bg-dark focus:outline-none focus:ring-1 focus:ring-dark dark:focus:ring-slate-300 dark:focus:bg-neutral-800" id="description" onChange={(e) => handleDescription(e)} value={description} placeholder="description"/>
           </div>
           <div>
            <input type="number" className="w-80 border-2 max-sm:w-40 border-dark dark:border-slate-300 transition-all duration-200 placeholder:text-gray-500 dark:focus:placeholder:text-transparent dark:placeholder:text-gray-500 focus:placeholder:text-transparent text-dark dark:text-slate-300 font-bold text-sm bg-slate-300 dark:bg-dark focus:outline-none focus:ring-1 focus:ring-dark dark:focus:ring-slate-300 dark:focus:bg-neutral-800" id="description" onChange={(e) => handlePrice(e)} value={price} placeholder="price in ethiopian birr"/>
           </div>
           <div>
           <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="transition-all hover:bg-slate-300 dark:hover:bg-dark max-sm:w-40 duration-200 justify-between border-2 border-dark dark:border-slate-300 dark:bg-dark dark:text-slate-300 text-dark bg-slate-300 focus:ring-1 focus:ring-dark  font-semibold w-full dark:focus:ring-slate-300  dark:focus:border-slate-300 focus:border-dark"
        >
          {catagory && access !== undefined
            ? access.find((a:string) => a === catagory)
            : "Select catagory..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]  p-0">
        <Command className="bg-slate-900 text-slate-300">
          <CommandInput className="placeholder:text-slate-400" placeholder="Search catagory..." />
          <CommandList className="">
            <CommandEmpty className="font-bold text-sm bg-slate-800">No catagory found.</CommandEmpty>
            <CommandGroup className="flex flex-col gap-2 bg-slate-800">
              {access !== undefined ? access.map((a) => (
                <div key={a} className=" ">
                <CommandItem
                  
                  value={a}
                  onSelect={(currentValue:string) => {
                    setCatagory(currentValue === catagory ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="border border-slate-300 bg-slate-800 font-bold text-slate-300 data-[selected=true]:bg-slate-700 data-[selected=true]:text-slate-200 dark:data-[selected=true]:bg-dark" 
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 ",
                      catagory === a ? "opacity-100" : "opacity-0"
                    )}
                  />
                 <div>{a}</div> 
                </CommandItem>
             </div> )) :""}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
           </div>
           
           <div className="flex">
            <Button type="submit" className="dark:bg-white w-full max-sm:w-40 bg-gray-950 font-bold text-white dark:text-gray-950 dark:hover:bg-slate-300 hover:bg-gray-900 transition-all duration-500 ">{isPending ? "uploading" : "upload post"}</Button>
            </div>
            </div>
        </form>
        <div className={`text-dark max-sm:w-40 dark:text-slate-300 text-sm flex flex-col max-lg:justify-center max-lg:items-center justify-start gap-4 lg:ml-36 max-sm:justify-start max-sm:items-start`}> <h1 className="text-center transition-all duration-500 text-dark dark:text-slate-300 font-semibold text-sm">
          {catagoryName !== undefined && catagoryName.length > 0 ?`you do have list of posts by  ${catagoryName?.length! <= 1 ? "this catagory" : "these catagories"} click it to see `: `no catagories`}</h1>
          
                  <ul className="text-sm font-semibold text-dark max-md:grid-rows-10 max-sm:grid-flow-row  dark:text-slate-50 grid grid-rows-5 grid-flow-col gap-x-10 gap-5 dark:marker:text-white list-none items-center justify-center">
                { 
catagoryName !== undefined ? catagoryName.map((n) => (
  <Link href={`/post/catagory/${n}/${userId}`} key={n} className="border-2 dark:border-slate-50 w-32 bg-dark dark:bg-slate-300 transition-all duration-500 border-dark h-11 overflow-hidden outline-1 ring-1 rounded-md ring-green-300 text-center text-slate-300 dark:text-dark px-2 font-bold "> {n} </Link>
                )
              ) : "loading..."
               } 
               </ul></div>
      </div>
    </div>
    </MaxWidthWrapper>
  )
}

export default UploadPost

