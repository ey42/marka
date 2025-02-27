"use client"

import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react"
import {uploadProfileImage } from "@/supabase/storage/Storages"
import { trpc } from "@/app/_trpc/client"
import { Authclient } from "@/lib/auth-client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Images } from "../Image"
import { convertBlobUrlToFIle, extractTimeAndDate } from "../Database"
import { Icons } from "../Icons"
import { Phone } from "lucide-react"



const {useSession} = Authclient

const ProfileUpload = () => {
    const [type, setType] = useState<string>()
    const [instagram, setInstagram] = useState<string>()
    const [telegram, setTelegram] = useState<string>()
    const [facebook, setFacebook] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [image, setImage] = useState<string>()
    const [company, setCompany] = useState<string>()
    const [phoneNumber1, setPhoneNumber1] = useState<string>()
    const [phoneNumber2, setPhoneNumber2] = useState<string>()
    const [formSubmitted, setFormSubmited] = useState<boolean>(false)
    const [x, setX] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
   

    const {data } = useSession()
    const session = data?.session;
    const userId = session?.userId
    const {data: success, refetch } = trpc.database.getProfile.useQuery({id: userId as string})
    const profile = success?.user?.userContent 
    const user = success?.user
    const profileImage = success?.user?.userContent?.imageFile as string
    const {mutate: upload, isPending,  isError, isSuccess} = trpc.database.uploadProfile.useMutation({
      onSuccess: () => {
        console.log('Success! Uploading post...');
        setFormSubmited(false); // Reset form state after success
        router.refresh()
        refetch();
        setFormSubmited(false)
        setCompany("")
        setDescription("")
        setFacebook("")
        setImage("")
        setInstagram("")
        setPhoneNumber1("")
        setPhoneNumber2("")
        setTelegram("")
        setType("")
        setX("")
        fileInputRef.current!.value = ""
      },
      onError: async(err) => {
        console.error('Error uploading profile:', err);     
         refetch()
      
      },})

    const handleImage = (e:ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]!
        Images(file, e).then(imageUrl => {
         console.log("image came from image function : "+ imageUrl)
         setImage(imageUrl!)
         fileInputRef.current!.value = ""
       }).catch(error => {
         console.error("error processing image : " + error)
        
       })
    }
  
    const handleX = (e:ChangeEvent<HTMLInputElement>) => {
       
        setX(e.target.value)
    }
    const handleType = (e:ChangeEvent<HTMLInputElement>) => {
    
        setType(e.target.value)
    }
    const handleInstagram = (e:ChangeEvent<HTMLInputElement>) => {
      
        setInstagram(e.target.value)
    }
    const handleTelegram = (e:ChangeEvent<HTMLInputElement>) => {
      
        setTelegram(e.target.value)
    }
    const handleFacebook = (e:ChangeEvent<HTMLInputElement>) => {
       
        setFacebook(e.target.value)
    }
    const handleDescription = (e:ChangeEvent<HTMLTextAreaElement>) => {
       
        setDescription(e.target.value)
    }
    const handleCompany = (e:ChangeEvent<HTMLInputElement>) => {
        
        setCompany(e.target.value)
    }
    const handlePhoneNumber1 = (e:ChangeEvent<HTMLInputElement>) => {
       
        setPhoneNumber1( e.target.value)
    }
    const handlePhoneNumber2 = (e:ChangeEvent<HTMLInputElement>) => {
       
        setPhoneNumber2( e.target.value)
    }

    const onsubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormSubmited(true)
        try{
            const filePromise = convertBlobUrlToFIle(image as string)
            const file: File | undefined = await filePromise
            console.log(file?.name)
            const bucket:string = "Images"
            const folder:string = "profileImage"

            const imageUrl = uploadProfileImage({file, bucket, folder, update: profile !== undefined && profile !== null ? true : false, company: company as string, userId: userId as string, profile: profileImage as string})
            const url  = await imageUrl 
            console.log('url: ', url)
            console.log("type of url " + typeof url)
          
            upload({
                userIds: userId as string,
                companyNames: company as string,
                descriptions: description as string,
                facebooks: facebook as string,
                imageFiles: url as string | undefined,
                instagrams: instagram as string,
                phoneNumber1s: phoneNumber1 as string,
                phoneNumber2s: phoneNumber2 as string,
                telegrams: telegram as string,
                types: type as string,
                update: profile !== undefined && profile !== null ? true : false,
                xs: x as string
             }) 
         refetch()
            
           } catch(error){
             console.error('Error uploading profiles:', error);
             setFormSubmited(false); // Reset form state on error
             refetch()
             }finally{
              refetch()
              fileInputRef.current!.value = ""
             }
            
    }
    useEffect(() => {
      setFormSubmited(false)
      setCompany("")
      setDescription("")
      setFacebook("")
      setImage("")
      setInstagram("")
      setPhoneNumber1("")
      setPhoneNumber2("")
      setTelegram("")
      setType("")
      setX("")
      refetch()
      fileInputRef.current!.value = ""
    },[formSubmitted, refetch] )


  return (
    <div className="mt-5 ml-5 mb-5 font-mono dark:text-light text-dark w-full flex flex-row justify-start gap-40 max-lg:gap-28 max-md:flex-col">
      <div className="">
     
        <form onSubmit={onsubmit} className="flex flex-col gap-4 justify-start items-start max-w-max">
          <div className="w-24 h-24 border-dark rounded-md">
            <Image src={image as string} alt="image" width={200} height={200} className="w-24 h-24 rounded-md border-2 border-dark dark:border-slate-300"/>
          </div>
        <div className="flex flex-col gap-6 w-full max-sm:w-40">
          <div>
            <label htmlFor="image" className="flex flex-col font-bold text-sm text-dark dark:text-slate-300 cursor-pointer gap-2 ">
              <input id="image" type="file" ref={fileInputRef} onChange={handleImage} className=" h-9 file:text-sm p-0 font-bold text-dark dark:text-slate-300 border-1 rounded-md dark:border-slate-300 border-dark dark:file:text-light file:font-bold file:text-dark file:border-1 file:border-dark dark:file:border-slate-300  file:mr-3 file:rounded-md file:h-full dark:file:bg-dark file:cursor-pointer cursor-pointer text-nowrap file:duration-150 file:transition-all" accept="image/*"/>
              <h1>select .jpeg image for your company profile</h1>
            </label>
          </div>
          <div>
            <label htmlFor="type" className=" font-bold text-sm cursor-pointer max-sm:w-40"> Type: {profile !== undefined && profile !== null ? "" : (<span className="text-red-500">must</span>)}
              <input id="type" type="text" onChange={handleType} placeholder="your buisness type" required = {profile === undefined} className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 required:border-red-500 dark:required:border-red-500 border-dark focus:placeholder:text-transparent focus:bg-slate-200 placeholder:text-slate-500 dark:border-slate-300 dark:focus:bg-neutral-800 dark:focus:placeholder:text-transparent w-full dark:bg-dark"/>
            </label>
          </div>
          <div>
            <label htmlFor="instagram" className=" max-sm:w-40 cursor-pointer font-bold text-sm"> Instagram: optional?
              <input id="instagram" type="text" onChange={handleInstagram} placeholder="instagram link" className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:border-light dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full dark:bg-dark"/>
              </label>
          </div>
          <div>
            <label htmlFor="telegram" className=" max-sm:w-40 font-bold cursor-pointer text-sm"> Telegram: optional?
              <input id="telegram" type="text" onChange={handleTelegram} placeholder="telegram link" className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 border-dark dark:bg-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
              </label>
          </div>
          <div>
            <label htmlFor="facebook"  className=" font-bold max-sm:w-40 cursor-pointer text-sm"> Facebook: optional
              <input id="facebook" type="text" onChange={handleFacebook} placeholder="facebook account name" className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:border-light dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent dark:bg-dark w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="x" className=" max-sm:w-40 font-bold cursor-pointer text-sm"> Tweeter or X: optional?
              <input id="x" type="text" onChange={handleX} placeholder="tweeter or X account" className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:border-light dark:focus:bg-neutral-800 dark:bg-dark placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="description" className="max-sm:w-40 font-bold cursor-pointer text-sm"> Description: optional?
              <textarea id="description"  onChange={handleDescription} placeholder="description" className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 min-h-20 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-light dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
              </label>
          </div>
          <div>
            <label htmlFor="company" className="max-sm:w-40 font-bold cursor-pointer text-sm "> Company Name: {profile !== undefined && profile !== null ? "" : (<span className="text-red-500">must</span>)}
              <input id="company" type="text" onChange={handleCompany} required = {profile === undefined} placeholder="your company name" className="required:border-red-500 dark:required:border-red-500 h-9 font-semibold rounded-md ml-2 pl-2 border-2 border-dark focus:placeholder:text-transparent dark:bg-dark focus:bg-slate-200 dark:border-light dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="phoneNumber1" className="max-sm:w-40 font-bold cursor-pointer text-sm "> phone number 1: {profile !== undefined && profile !== null  ? "" : (<span className="text-red-500">must</span>)}
              <input id="phoneNumber1" type="text" onChange={handlePhoneNumber1} required = {profile === undefined} placeholder="0900000000" className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:border-light dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent required:border-red-500 dark:bg-dark dark:required:border-red-500 w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="phoneNumber2" className="max-sm:w-40 font-bold cursor-pointer text-sm"> phone number 2:
              <input id="phoneNumber2" type="text" onChange={handlePhoneNumber2} placeholder="0900000000" className="h-9 font-semibold rounded-md ml-2 pl-2 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:border-light dark:focus:bg-neutral-800 dark:bg-dark placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 max-sm:w-40 w-full justify-center mt-8 ml-2">
          
        <button type="submit"  className=" bg-gradient-to-r dark:from-dark dark:via-light dark:to-light from-light via-dark to-black bg-[200%_auto] ease-linear transition-all duration-500 hover:bg-right dark:border-slate-300 cursor-pointer border-2 text-center w-full flex justify-center bg-dark dark:text-light hover:dark:text-black dark:bg-light hover:bg-black dark:hover:bg-slate-300 text-black hover:text-light text-lg items-center border-dark px-2 py-1 rounded-md font-bold">{isPending ? "loading..." : profile !== undefined && profile !== null  ? "update" : "request"} </button>
        
        
        </div>
        </form>
<p>{isError ? "please try again it doesn't work" : isSuccess ? "successfully upload profile" : " " }</p>
      </div>
      <div>
         <div className=' flex flex-col items-center gap-5 mt-10 max-w-sm'>
          {profile !== undefined && profile !== null && <h1 className="text-4xl font-bold font-mono tracking-wider">user profile</h1>}
         {
          (user !== undefined && profile !== undefined && profile !== null && user.role === "merchant") ? (
          <div className="flex flex-col border-2 justify-center items-center bg-dark dark:bg-light border-light dark:border-dark rounded-lg text-wrap truncate w-full">
            <div className="py-4"><Image src={profile?.imageFile !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${profile.imageFile as string}`:''} alt="company name" className="w-20 h-20 my-2
            rounded-full border-2 border-light dark:border-dark" width={200} height={200}/></div> 
            <div className="border-t-2 w-full p-4 flex flex-col gap-3 border-light font-semibold font dark:border-dark">

            <div className="flex flex-row gap-2 rounded-r-md dark:bg-dark border-b-2 dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark">name: </h1> <h1>{user ? `${user.name.split(' ')[0]} ${user.name.split(' ')[1]}` : "loading..."}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark rounded-r-md border-b-2 dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark" >company name: </h1> <h1 >{profile ? `${profile?.companyName}`: company}</h1></div>

            <div className="flex flex-row gap-2 rounded-r-md dark:bg-dark border-b-2 dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark" >email: </h1> <h1>{user ? `${user?.email}` : "loading..."}</h1></div>

            <div className="flex flex-row gap-2 rounded-r-md dark:bg-dark border-b-2 dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark">role: </h1> <h1>{user ? `${user?.role}` : "loading..."}</h1></div>

            <div className="flex flex-row gap-2 rounded-r-md dark:bg-dark border-b-2 dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark">type of market: </h1> <h1>{ profile ? `${profile?.type!}` : type}</h1></div>

            <Link target="_blank" href={profile ?.instagram?.includes('https://www.instagram.com/') ? profile?.instagram : `https://www.instagram.com/${profile?.instagram}`} className="group flex flex-row rounded-r-md gap-2 dark:bg-dark border-b-2 dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto bg-gradient-to-r dark:from-dark dark:via-dark dark:to-pink-500 from-light via-light to-pink-500 bg-[200%_auto] ease-linear hover:bg-right transition-all duration-500 group-hover:bg-left"><h1 className="bg-dark dark:bg-light w-1/4"><Icons.Instagram className='p-1 w-8 h-8 fill-light  dark:fill-black'/></h1> <div className="text-lg">@{ profile ? `${profile?.instagram?.split("/").pop()!}` : instagram}</div></Link>

            <Link target="_blank" href={profile?.telegram?.includes('https://t.me/') ? profile?.telegram : `https://t.me/${profile?.telegram}`} className="flex flex-row gap-2 dark:bg-dark border-b-2 rounded-r-md dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto bg-gradient-to-r dark:from-dark dark:via-dark dark:to-sky-500 from-light via-light to-sky-500 bg-[200%_auto] ease-linear hover:bg-right transition-all duration-500 group-hover:bg-left"><h1 className="bg-dark dark:bg-light w-1/4"><Icons.Telegram className='p-1 w-8 h-8 fill-light  dark:fill-black'/></h1>  <div className="text-lg">@{ profile ? `${profile?.telegram?.split("/").pop()!}` : telegram}</div></Link>

            <Link target="_blank" href={profile?.facebook?.includes('https://www.facebook.com/') ? profile?.facebook : `https://www.facebook.com/${profile?.facebook}`} className="flex flex-row gap-2 rounded-r-md dark:bg-dark border-b-2 dark:border-dark dark:text-light w-full bg-light text-dark border-light text-wrap h-auto truncate overflow-auto  bg-gradient-to-r dark:from-dark dark:via-dark dark:to-blue-800 from-light via-light to-blue-800 bg-[200%_auto] ease-linear hover:bg-right transition-all duration-500 group-hover:bg-left"><h1 className="bg-dark dark:bg-light w-1/4"><Icons.FaceBook className='p-1 w-8 h-8 fill-light  dark:fill-black'/></h1>  <div className="text-lg">@{ profile ? `${profile?.facebook?.split("/").pop()!}` : facebook}</div></Link>

            <Link target="_blank" href={profile?.x?.includes('https://x.com/') ? profile.x : `https://x.com/${profile?.x}`} className="flex flex-row gap-2 rounded-r-md dark:bg-dark border-b-2 dark:border-dark border-light dark:text-light w-full bg-light text-dark text-wrap h-auto hover:text-white truncate overflow-auto bg-gradient-to-r dark:from-dark dark:via-dark dark:to-black from-light via-light to-black bg-[200%_auto] ease-linear hover:bg-right transition-all duration-500 group-hover:bg-left"><h1 className="bg-dark dark:bg-light w-1/4"><Icons.Tweeter className='p-1 w-8 h-8 fill-light  dark:fill-black'/></h1>  <div className="text-lg">@{ profile ? `${profile?.x?.split("/").pop()!}` : x}</div></Link>

            <div className="flex rounded-r-md flex-row gap-2 border-b-2 dark:border-dark border-light dark:bg-dark   dark:text-light w-full bg-light text-dark text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark dark:bg-light w-1/4"><Phone className="fill-light dark:fill-dark"/></h1> <h1>{ profile ? `${profile?.phoneNumber1!}` : phoneNumber1}</h1></div>

            <div className="flex flex-row gap-2 border-b-2 dark:border-dark border-light rounded-r-md dark:bg-dark  dark:text-light w-full bg-light text-dark text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark dark:bg-light w-1/4"><Phone className="fill-light dark:fill-dark"/></h1> <h1>{ profile ? `${profile?.phoneNumber2!}` : phoneNumber2}</h1></div>

            <div className="flex flex-row gap-2 rounded-r-md border-b-2 dark:border-dark border-light dark:bg-dark dark:text-light w-full bg-light text-dark text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark">description: </h1> <h1>{profile?.description!}</h1></div>

            <div className="flex flex-row border-b-2 dark:border-dark border-light gap-2 rounded-r-md dark:bg-dark dark:text-light w-full bg-light text-dark text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark">profile created at: </h1> <h1> {profile ? `${extractTimeAndDate(profile?.createdAt!).date} ${extractTimeAndDate(profile?.createdAt!).time}` : "loading profile created time"}</h1></div>

            <div hidden={!profile?.updatedAt} className="flex rounded-r-md border-b-2 dark:border-dark border-light flex-row gap-2 dark:bg-dark dark:text-light w-full bg-light text-dark text-wrap h-auto truncate overflow-auto "><h1 className="bg-dark pl-1 text-light dark:bg-light dark:text-dark">profile updated at: </h1> <h1> { profile?.updatedAt ? `${extractTimeAndDate(profile?.updatedAt!).date} ${extractTimeAndDate(profile?.updatedAt!).time}` : "you arn't update you profile"}</h1></div>
          </div></div>) 
          : profile !== undefined && profile !== null && user?.role !== "merchant"  ? (<div className="flex flex-col border-2 justify-center items-center bg-dark dark:bg-light border-light dark:border-dark rounded-lg text-wrap truncate w-full text-center font-bold text-xl"> profile request pending </div>) :
           (<div className="flex justify-center items-center"><h1 className="text-center font-bold text-xl">This is the Place of your Profile</h1></div>)
         }
         </div>
      </div>
    </div>
  )
}

export default ProfileUpload
