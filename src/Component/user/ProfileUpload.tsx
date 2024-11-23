"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import {uploadProfileImage } from "@/supabase/storage/Storages"
import { trpc } from "@/app/_trpc/client"
import { Authclient } from "@/lib/auth-client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Images } from "../Image"
import { convertBlobUrlToFIle, extractTimeAndDate } from "../Database"



const {useSession} = Authclient

const ProfileUpload = () => {
    const [type, setType] = useState<string>()
    const [instagram, setInstagram] = useState<string>()
    const [telegram, setTelegram] = useState<string>()
    const [facebook, setFacebook] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [image, setImage] = useState<string>()
    const [company, setCompany] = useState<string>()
    const [update, setUpdate] = useState<boolean>(false)
    const [phoneNumber1, setPhoneNumber1] = useState<string>()
    const [phoneNumber2, setPhoneNumber2] = useState<string>()
    const [formSubmitted, setFormSubmited] = useState<boolean>(false)
    // const [success, setSuccess] = useState<boolean>(false)
    // const [errors, setError] = useState<boolean>(false)
    const [x, setX] = useState<string>();
    const router = useRouter()
   

    const {data } = useSession()
    const session = data?.session;
    const userId = session?.userId
    const {data: success, refetch } = trpc.database.getProfile.useQuery({id: userId as string})
    const userHasProfile = success?.user?.userContent?.userId === userId;
    const profile = success?.user?.userContent 
    const user = success?.user
    const profileImage = success?.user?.userContent?.imageFile as string
    const {mutate: upload, isPending,  isError, isSuccess} = trpc.database.uploadProfile.useMutation({
      onSuccess: () => {
        console.log('Success! Uploading post...');
        setFormSubmited(false); // Reset form state after success
        router.refresh()
        refetch(); // Navigate to categories page
      },
      onError: async(err) => {
        console.error('Error uploading post:', err);     
         refetch()
      
      },})

    const handleImage = (e:ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]!
        Images(file, e).then(imageUrl => {
         console.log("image came from image function : "+ imageUrl)
         setImage(imageUrl!)
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
            if(userHasProfile && update === false){ return alert("please select update button")}
            const imageUrl = uploadProfileImage({file, bucket, folder, update: update, company: company as string, userId: userId as string, profile: profileImage as string})
            const url  = await imageUrl 
          
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
                update: update,
                xs: x as string
             }) 
         refetch()
            
           } catch(error){
             console.error('Error uploading categories:', error);
             setFormSubmited(false); // Reset form state on error
             refetch()
             }finally{
              refetch()
             }
            
    }
    useEffect(() => {
      setCompany("")
      setDescription("")
      setFacebook("")
      setFormSubmited(true)
      setImage("")
      setInstagram("")
      setPhoneNumber1("")
      setPhoneNumber2("")
      setTelegram("")
      setType("")
      setUpdate(false)
      setX("")
      refetch()
    },[formSubmitted] )
    if (isError) {
      refetch()
    }

  return (
    <div className="mt-5 w-full flex flex-row justify-between gap-40 max-lg:gap-28 max-md:flex-col max-w-screen-sm">
      <div className="ml-2">
     
        <form onSubmit={onsubmit} className="flex flex-col gap-4 justify-start items-start max-w-max">
          <div className="w-24 h-24 border-dark rounded-md">
            <Image src={image as string} alt="image" width={200} height={200} className="w-24 h-24 rounded-md border-2 border-dark dark:border-slate-300"/>
          </div>
        <div className="flex flex-col gap-6 w-full max-sm:w-40">
          <div>
            <label htmlFor="image" className="flex flex-col font-bold text-sm text-dark dark:text-slate-300 cursor-pointer gap-2 ">
              <input id="image" type="file" onChange={handleImage} className=" h-9 file:text-sm p-0 font-bold text-dark dark:text-slate-300 border-1 rounded-md dark:border-slate-300 border-dark dark:file:text-slate-300 file:font-bold file:text-dark file:border-1 file:border-dark dark:file:border-slate-300 file:bg-slate-300 file:mr-3 file:rounded-md file:h-full dark:file:bg-dark file:cursor-pointer cursor-pointer text-nowrap transition-all duration-150 file:duration-150 file:transition-all" accept="image/*"/>
              <h1>select .jpeg image for your company profile</h1>
            </label>
          </div>
          <div>
            <label htmlFor="type" className="text-dark font-bold text-sm cursor-pointer max-sm:w-40 dark:text-slate-300"> Type: {update ? "" : (<span className="text-red-500">must</span>)}
              <input id="type" type="text" onChange={handleType} placeholder="your buisness type" required = {update === false} className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 required:border-red-500 dark:required:border-red-500 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark placeholder:text-slate-500 dark:border-slate-300 dark:focus:bg-neutral-800 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="instagram" className="text-dark max-sm:w-40 cursor-pointer font-bold text-sm dark:text-slate-300"> Instagram: optional?
              <input id="instagram" type="text" onChange={handleInstagram} placeholder="instagram link" className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
              </label>
          </div>
          <div>
            <label htmlFor="telegram" className="text-dark max-sm:w-40 font-bold cursor-pointer text-sm dark:text-slate-300"> Telegram: optional?
              <input id="telegram" type="text" onChange={handleTelegram} placeholder="telegram link" className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
              </label>
          </div>
          <div>
            <label htmlFor="facebook"  className="text-dark font-bold max-sm:w-40 cursor-pointer text-sm dark:text-slate-300"> Facebook: optional
              <input id="facebook" type="text" onChange={handleFacebook} placeholder="facebook account name" className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="x" className="text-dark max-sm:w-40 font-bold cursor-pointer text-sm dark:text-slate-300"> Tweeter or X: optional?
              <input id="x" type="text" onChange={handleX} placeholder="tweeter or X account" className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="description" className="text-dark max-sm:w-40 font-bold cursor-pointer text-sm dark:text-slate-300"> Description: optional?
              <textarea id="description"  onChange={handleDescription} placeholder="description" className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
              </label>
          </div>
          <div>
            <label htmlFor="company" className="text-dark max-sm:w-40 font-bold cursor-pointer text-sm dark:text-slate-300"> Company Name: {update ? "" : (<span className="text-red-500">must</span>)}
              <input id="company" type="text" onChange={handleCompany} required = {update === false} placeholder="your company name" className="required:border-red-500 dark:required:border-red-500 h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="phoneNumber1" className="text-dark max-sm:w-40 font-bold cursor-pointer text-sm dark:text-slate-300"> phone number 1: {update ? "" : (<span className="text-red-500">must</span>)}
              <input id="phoneNumber1" type="text" onChange={handlePhoneNumber1} required = {update === false} placeholder="0900000000" className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent required:border-red-500 dark:required:border-red-500 w-full"/>
            </label>
          </div>
          <div>
            <label htmlFor="phoneNumber2" className="text-dark max-sm:w-40 font-bold cursor-pointer text-sm dark:text-slate-300"> phone number 2:
              <input id="phoneNumber2" type="text" onChange={handlePhoneNumber2} placeholder="0900000000" className="h-9 font-semibold rounded-md ml-2 pl-2 bg-slate-300 border-2 border-dark focus:placeholder:text-transparent focus:bg-slate-200 dark:bg-dark dark:border-slate-300 dark:focus:bg-neutral-800 placeholder:text-slate-500 dark:focus:placeholder:text-transparent w-full"/>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-4 max-sm:w-40 justify-center items-center w-[50%] ml-2">
          
        {profileImage ? (
          <div>
          <p className="text-xs font-mono text-center"> click to {!update ? "true" : "false"}</p>
          <label htmlFor="check" className={`dark:bg-dark dark:text-slate-300 ${update ? "bg-green-500" : "bg-red-500"} dark:border-slate-300 text-center cursor-pointer w-full border-2 flex items-center border-dark px-2 py-1 rounded-md font-bold text-dark`}>update : {update ? "true" : "false"} <input  className=" appearance-none" id="check" type="checkbox" checked={update} onChange={() => 
          {
              setUpdate(!update)
            console.log(update)
          }} /> </label></div>) : ""}
        <button type="submit"  className="dark:bg-dark dark:text-slate-300 dark:border-slate-300 cursor-pointer border-2 w-full flex items-center border-dark px-2 py-1 rounded-md font-bold text-dark">{isPending ? "loading..." : "submit"} </button>
        
        
        </div>
        </form>
<p>{isError ? "please try again it doesn't work" : isSuccess ? "successfully upload profile" : " " }</p>
      </div>
      <div>
         <div className='flex flex-col mt-10 max-w-sm'>
         {
          user !== undefined && profile !== undefined ? (
          <div className="flex flex-col border-2 justify-center items-center border-dark dark:border-slate-300 rounded-lg text-wrap truncate">
            <div><Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${profile?.imageFile as string}`} alt="company name" className="w-20 h-20 my-2
            rounded-full border-2 border-dark dark:border-slate-300" width={200} height={200}/></div> 
            <div className="border-t-2 w-full p-4 flex flex-col gap-3 border-dark font-semibold font dark:border-slate-300">

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">name: </h1> <h1>{user ? `${user.name.split(' ')[0]} ${user.name.split(' ')[1]}` : "loading..."}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark" >company name: </h1> <h1>{profile ? `${profile?.companyName}`: company}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark" >email: </h1> <h1>{user ? `${user?.email}` : "loading..."}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">role: </h1> <h1>{user ? `${user?.role}` : "loading..."}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">type of market: </h1> <h1>{ profile ? `${profile?.type!}` : type}</h1></div>

            <Link target="_blank" href={profile?.instagram?.includes('https://www.instagram.com/') ? profile?.instagram : `https://www.instagram.com/${profile?.instagram}`} className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">instagram account: </h1> <div >@{ profile ? `${profile?.instagram?.split("/").pop()!}` : instagram}</div></Link>

            <Link target="_blank" href={profile?.telegram?.includes('https://t.me/') ? profile?.telegram : `https://t.me/${profile?.telegram}`} className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">telegram account: </h1> <div>@{ profile ? `${profile?.telegram?.split("/").pop()!}` : telegram}</div></Link>

            <Link target="_blank" href={profile?.facebook?.includes('https://www.facebook.com/') ? profile?.facebook : `https://www.facebook.com/${profile?.facebook}`} className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">facebook account: </h1> <div >@{ profile ? `${profile?.facebook?.split("/").pop()!}` : facebook}</div></Link>

            <Link target="_blank" href={profile?.x?.includes('https://x.com/') ? profile.x : `https://x.com/${profile?.x}`} className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">X account: </h1> <div >@{ profile ? `${profile?.x?.split("/").pop()!}` : x}</div></Link>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">phone number 1: </h1> <h1>{ profile ? `${profile?.phoneNumber1!}` : phoneNumber1}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">phone number 2: </h1> <h1>{ profile ? `${profile?.phoneNumber2!}` : phoneNumber2}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">description: </h1> <h1>{profile?.description!}</h1></div>

            <div className="flex flex-row gap-2 dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg  text-wrap h-auto truncate overflow-auto"><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">profile created at: </h1> <h1> {profile ? `${extractTimeAndDate(profile?.createdAt!).date} ${extractTimeAndDate(profile?.createdAt!).time}` : "loading profile created time"}</h1></div>

            <div hidden={!profile?.updatedAt} className="flex flex-row gap-2 text-wrap h-auto truncate overflow-auto dark:bg-dark border-2 dark:border-slate-300 dark:text-slate-300 w-full bg-slate-300 text-dark border-dark rounded-lg "><h1 className="bg-dark pl-1 text-slate-300 dark:bg-slate-300 dark:text-dark">profile updated at: </h1> <h1> { profile?.updatedAt ? `${extractTimeAndDate(profile?.updatedAt!).date} ${extractTimeAndDate(profile?.updatedAt!).time}` : "you arn't update you profile"}</h1></div>
          </div></div>) 
          :
           (<div>profile place</div>)
         }
         </div>
      </div>
    </div>
  )
}

export default ProfileUpload