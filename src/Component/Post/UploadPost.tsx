"use client"
import { trpc } from "@/app/_trpc/client"

import { convertBlobUrlToFIleArray } from "@/Component/Database"
import {  uploadImagetoPostStorage } from "@/supabase/storage/Storages"
import { useState, useRef, useEffect, ChangeEvent, FormEvent,  } from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { ImageArray } from "../Image"


const {useSession} = Authclient



    const UploadPost = () => {
    const [image, setImage] = useState<string[]>([])
    const [description, setDescription] = useState<string>("") 
    const [title, setTitle] = useState<string>("")
    const [formSubmitted, setFormSubmited] = useState<boolean>(false)    
    const [open, setOpen] = useState(false)
    const [catagory, setCatagory] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [price, setPrice] = useState<string>("")
    const {data } = useSession()
    const session = data?.session;
    const userId = session?.userId
    const fileInputRef = useRef<HTMLInputElement>(null)
   
    const router = useRouter()
    const {data: success , refetch: fetchAgain} = trpc.database.getPosts.useQuery({id: userId as string})
    const {data : Catagory , refetch} = trpc.database.getCatagoriesName.useQuery()
    const access = Catagory?.catagoryName
    const {mutate: upload, isError, isSuccess, isPending} = trpc.database.uploadPost.useMutation({
      onSuccess: () => {
        console.log('Success! Uploading post...');
        router.refresh()
        fetchAgain(); 
      },
      onError: (err) => {
        console.error('Error uploading post:', err);
        fetchAgain()
      },})
        const spacedAccess = access?.map((a) => a.replace(/_/g, ' ')) || [] 
        const catagoryName = success?.postCatagory as string[] || []
        const uniqueNames: string[] = [];
        const nameMap:{[name: string] : boolean} = {};

     if(catagoryName && catagoryName.length >= 1)
          {   
            console.log("there is some catagoryName")
             for(let i = 0; i < catagoryName.length; i++){
              const name = catagoryName[i]
              if (!nameMap[name]) {
                        uniqueNames.push(name);
                        nameMap[name] = true;
              }
          }}else{
            console.log("nothing here")
          }

          
            const nameCounts : {[name: string] : number} = {}
            for (const name of catagoryName!){
              nameCounts[name] = (nameCounts[name] || 0) + 1;
            }

            
        // const posts = success?.posts
      

    const handleOnChange = async(e:ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
    const files = e.target.files!
    if (files.length === 0) return
    const newImages = Array.from(files);
    if (image.length + newImages.length > 5) {
     const remaining = 5 - image.length;
     if(remaining > 0) {
      alert(`you can only upload ${remaining} images`)
      setImage([])
      fileInputRef.current!.value = ""
      return 
     } else{
      alert("You have reached the maximum of 5 images.");
      setImage([])
      fileInputRef.current!.value = "" 
      return
     }
    }
    ImageArray(Array.from(files), e).then((imageUrl) => {
      console.log("image came from image function : "+ imageUrl)
      if (imageUrl) {
        setImage([...imageUrl]);
      } else{
        console.error("error processing")
      }
      refetch()
      fetchAgain()
    })

   
    }

    const handleTitle = (e:ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      setTitle(e.target?.value)
      
    }
    const handleCity = (e:ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      setCity(e.target?.value)
    }
    const handleDescription = (e:ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      setDescription(e.target?.value)
     
    }
    const handlePrice = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const value  = e.target.value
      setPrice(value)
    }
   
   const onsubmit = async(e:FormEvent<HTMLFormElement>) => {
  e.preventDefault()
    console.log("trigger")
    setFormSubmited(true)
    try{
   const filePromise = convertBlobUrlToFIleArray(image as string[])
   const files: File[] | undefined = await filePromise
   console.log(files[0]?.name)
   const bucket:string = "Images"
   const folder:string = "postImage" 
   
   const imageUrl = uploadImagetoPostStorage({files, bucket, folder, title: title, catagory: catagory, city: city, price: price })
   const url  = await imageUrl 
   upload({
    catagory: catagory as string,
    description: description as string,
    imagefile: url as string[], 
    title: title as string,
    userID: userId as string,
    prices: price as string,
    city: city as string,
  
  }) 

    router.refresh()
    await refetch()
    fetchAgain()
    fileInputRef.current!.value = ""
  } catch(error){
    console.error('Error uploading posts:', error);
    setFormSubmited(false); // Reset form state on error
    refetch()
    fetchAgain()
    fileInputRef.current!.value = ""
    } 
 }
   useEffect(()=>{
 
    return () => {
      setFormSubmited(false)
      setTitle("")
      setCity("")
      setDescription("")
      setCatagory("")
      setImage([])
      setOpen(false)
      setPrice("")
      refetch()
      fetchAgain()
    }
  
   },[refetch, fetchAgain, formSubmitted])

  return (
   <MaxWidthWrapper>
    <div className="mt-4 flex items-center justify-center border-1 rounded-md dark:border-slate-300 border-dark">
      <div className="flex flex-row max-lg:flex-col max-lg:justify-center max-md:items-center max-md:justify-center  justify-evenly max-lg:items-center max-lg:gap-12 w-full max-sm:ml-2 ml-4">
        <form onSubmit={onsubmit} className="flex flex-col gap-5 items-center justify-center ml-4">
          <div className="w-52 h-52 flex items-center transition-all duration-200 rounded-lg text-dark dark:text-light font-bold border-1 border-dark dark:border-slate-300">
            <Image src={image[0] as string} alt="post image" width={208} height={208} className="w-52 h-52 rounded-lg border-2 dark:border-slate-300 z-10 border-dark"/>
            <p className="text-center -ml-36 z-0">take image</p>
          </div>
          <div className="ml-0 flex gap-4 flex-col">
          <div className="w-56 cursor-pointer transition-all duration-200 rounded-md text-dark dark:text-slate-300 ">

         
            <Input type="file" ref={fileInputRef} onChange={(e) => handleOnChange(e)} className="h-9 file:text-sm p-0 font-semibold font-mono text-dark dark:text-light border-1 rounded-md dark:border-slate-300 border-dark dark:file:text-light file:font-semibold file:text-dark file:border-1 file:border-dark dark:file:border-slate-300 file:mr-3 file:rounded-md file:h-full file:cursor-pointer cursor-pointer text-nowrap transition-all duration-200" accept="image/*" multiple />
            </div> 
          <div className="flex flex-col gap-2 rounded-md">
            <h1 className="font-bold font-serif">Title</h1>
           <input className= "transition-all max-sm:w-40 duration-100 dark:bg-dark placeholder:text-gray-500 focus:placeholder:text-transparent w-full h-9 p-0 dark:text-slate-300 text-dark font-bold text-sm  rounded-md border-2 border-dark dark:border-slate-300 pl-1 focus:ring-1 dark:focus:ring-slate-300 focus:ring-dark focus:outline-none dark:focus:bg-neutral-800" id="catagory" type="text" onChange={(e) => handleTitle(e)} value={title} placeholder="Post title" required/>
            </div>
           <div className="flex flex-col gap-2"> 
            <h1 className="font-bold font-serif">Description</h1>
           <Textarea className="w-80 border-2 max-sm:w-40 border-dark dark:border-slate-300 transition-all duration-200 placeholder:text-gray-500 dark:focus:placeholder:text-transparent dark:placeholder:text-gray-500 focus:placeholder:text-transparent text-dark dark:text-slate-300 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-dark dark:focus:ring-slate-300 dark:focus:bg-neutral-800" id="description" onChange={(e) => handleDescription(e)} value={description} placeholder="description"/>
           </div>
           <div className="flex flex-col gap-2">
            <h1 className="font-bold font-serif">Price</h1>
            <input type="number" className="w-80 border-2 max-sm:w-40 border-dark dark:border-slate-300 transition-all duration-300 placeholder:text-gray-500 dark:focus:placeholder:text-transparent rounded-sm h-9 dark:placeholder:text-gray-500 focus:placeholder:text-transparent text-dark dark:text-slate-300 font-bold text-sm focus:outline-none focus:ring-1 dark:bg-dark focus:ring-dark dark:focus:ring-slate-300 dark:focus:bg-neutral-800" id="description" onChange={(e) => handlePrice(e)} value={price} placeholder="price in ethiopian birr"/>
           </div>
           <div className="flex flex-col gap-2 rounded-md">
            <h1 className="font-bold font-serif">City</h1>
           <input className= "transition-all max-sm:w-40 duration-100 dark:bg-dark placeholder:text-gray-500 focus:placeholder:text-transparent w-full h-9 p-0 dark:text-slate-300 text-dark font-bold text-sm  rounded-md border-2 border-dark dark:border-slate-300 pl-1 focus:ring-1 dark:focus:ring-slate-300 focus:ring-dark focus:outline-none dark:focus:bg-neutral-800" id="catagory" type="text" onChange={(e) => handleCity(e)} value={city} placeholder="City" required/>
            </div>
           <div className="flex flex-col gap-2">
            <h1 className="font-bold font-serif">Choose catagories</h1>
           <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="transition-all hover:bg-light font-mono dark:hover:bg-dark max-sm:w-40 duration-400 justify-between border-2 border-dark dark:border-slate-300 dark:bg-dark dark:text-light text-dark bg-light focus:ring-1 focus:ring-dark  font-semibold w-full dark:focus:ring-slate-300  dark:focus:border-slate-300 focus:border-dark"
        >
          {catagory && spacedAccess !== undefined
            ? spacedAccess.find((a:string) => a === catagory)
            : "Select catagory..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]  p-0">
        <Command className="bg-slate-50 text-slate-500">
          <CommandInput className="placeholder:text-slate-400" placeholder="Search catagory..." />
          <CommandList className="">
            <CommandEmpty className="font-bold text-sm bg-slate-50">No catagory found.</CommandEmpty>
            <CommandGroup className="flex flex-col gap-2 bg-slate-50">
              {spacedAccess !== undefined ? spacedAccess.map((a) => (
                <div key={a} className=" ">
                <CommandItem
                  
                  value={a}
                  onSelect={(currentValue:string) => {
                    setCatagory(currentValue === catagory ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="border border-slate-300 bg-slate-50 font-bold text-dark data-[selected=true]:bg-dark data-[selected=true]:text-slate-200 dark:data-[selected=true]:bg-dark" 
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
            <Button type="submit" className=" dark:bg-white w-full max-sm:w-40 bg-gray-950 font-bold text-white dark:text-gray-950 dark:hover:bg-slate-300 hover:bg-gray-900 transition-all duration-500 " disabled = {isPending}>{isPending ? "uploading..." : "upload post"}</Button>
            </div>
            </div>
        </form>
        <div className={`font-mono tracking-wide text-dark max-sm:w-40 dark:text-slate-50 text-sm flex flex-col max-lg:justify-center max-lg:items-center justify-start gap-4 lg:ml-36 max-sm:justify-start max-sm:items-start`}> <h1 className="text-center transition-all duration-500 font-semibold text-sm">
          {catagoryName !== undefined && catagoryName.length > 0 ?`you do have list of posts by  ${catagoryName?.length! <= 1 ? "this catagory" : "these catagories"} click it to see `: `catagories...`}</h1>
          
                  <ul className="text-sm font-semibold  max-md:grid-rows-10 max-sm:grid-flow-row grid grid-rows-5 grid-flow-col gap-x-10 gap-5 dark:marker:text-white list-none items-center justify-center">
                { 
uniqueNames !== undefined ? uniqueNames.map((n) => ( 
  <Link href={`/post/catagory/${n}/${userId}`} key={n} className="border-2 hover:bg-black hover:text-light hover:dark:text-black hover:dark:bg-light  dark:border-slate-50 w-auto  transition-all duration-100 border-dark h-auto bggre overflow-hidden rounded-md text-center py-2 px-2 font-semibold"> {n.replace(/_/g, ' ')} {nameCounts[n]} </Link>
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

