"use client"; 

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ThemeContext from '@/context/themeContext'
import Link from 'next/link';
import React, { useContext, useEffect} from 'react'
import { FaGoogle } from 'react-icons/fa';


import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md'
import { Icons } from './Icons';
import Image from "next/image";
// import { user } from "@/app/(all)/(auth)/abresha/page";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Authclient } from "@/lib/auth-client";
import { signIN, signOUT } from "@/lib/auth-client";

import { usePathname, useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { ArrowUpFromLine, Crown, MonitorUp, Send, UserPen, Users } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import Search from "./Search";
import { Eyueal } from "./Database";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const {useSession} = Authclient



const Heading = () => {
  
  const {refetch} = trpc.database.deleteSolded.useQuery()
  const pathname = usePathname()
  
  const {data} = useSession()
  
  const session = data?.session;
  const {data: success , isPending} = trpc.database.getUsers.useQuery({id: session?.userId as string})
  const {data: access, refetch: fetchprofile} = trpc.database.getProfiles.useQuery()
  const requestedCount : number = (access?.requestCount[0].count) as number

  const activeUserSession = success?.activeSessions
  const activeUser  = success?.activeUser

  const user = success?.user
  
  useEffect(() => {
    refetch()
    fetchprofile()
  },[refetch, requestedCount, fetchprofile])


  const usersImage: (string | null)[] = []
  const userImage = activeUser?.image as string

if(user !== undefined){
  user.map((user) => usersImage.push(user.image))
  usersImage.map((image) => image!)
}

  const {darkTheme, setDarkTheme} = useContext(ThemeContext)
  console.log(activeUser !== undefined && activeUser.email)

  return (

    <div className=' w-full backdrop-blur-xl ' >
          <div className=" flex justify-between pb-1 items-end gap-4 h-[75px] border-dark dark:border-light border-b-[0.5px] ">
         <div className='flex flex-row flex-shrink font-mono ml-4 justify-center gap-3 max-md:justify-start items-end '>
          <div className={cn('flex justify-center  gap-4',{
            "md:hidden": pathname === "/"
          })}>
          <div>
          <div className='w-full h-full dark:fill-slate-50 fill-dark  bg-light dark:bg-dark rounded-r-md flex flex-shrink flex-col justify-center'>
            <Link href={'/'} className=" dark:fill-slate-50 -mb-6 fill-dark">
            <Image src={'/green-city.png'} alt="hy" width={150} height={150} className="w-10 h-10"/>
            <h3 className="  text-sm rounded-md tracking-wider dark:text-slate-50 text-center text-dark font-bold font-mono"><span className="text-blue-500">m</span>ar<span className="text-yellow-500">k</span>a</h3>

            </Link> 
          </div>
          </div>
          </div>
                {activeUser?.email === Eyueal ? (
                  <NavigationMenu className=" text-sm font-semibold max-md:hidden" hidden=
                  {activeUser?.role !== "merchant"}>
                    <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="transition-colors focus:border-black dark:focus:border-light data-[state=open]:border-black dark:data-[state=open]:border-light duration-500 rounded-sm font-mono border-2 border-dark dark:border-light font-semibold h-7 text-sm text-dark hover:bg-black bg-light hover:text-light dark:bg-dark dark:text-light hover:dark:bg-light hover:dark:text-black data-[state=open]:bg-black data-[state=open]:text-light dark:data-[state=open]:bg-light dark:data-[state=open]:text-black dark:data-[active]:bg-light dark:data-[active]:text-black data-[active]:bg-black data-[active]:text-light dark:focus:bg-light focus:text-light dark:focus:text-black focus:bg-black px-1 py-2 max-lg:w-8 max-lg:h-8"> <div className="flex gap-2 "><h1 className="max-lg:hidden text-sm">uploads</h1> <MonitorUp /></div> </NavigationMenuTrigger>
          <NavigationMenuContent className=" transition-all duration-150 w-32 flex-col gap-2 backdrop-blur-sm dark:bg-light bg-dark dark:text-dark text-light">
            <div className="flex flex-col w-32 h-full">
                <Link href='/upload/upload-catagory' hidden={pathname.includes('upload/upload-catagory') || !activeUserSession} className=" group hover:bg-zinc-800 dark:hover:bg-zinc-300">
              <div className="flex flex-row justify-between transition-all duration-300 px-2 py-2">
              <ArrowUpFromLine className="group-hover:-translate-y-1 transition-transform duration-500 stroke-light dark:stroke-dark group-hover:stroke-light dark:group-hover:stroke-dark"/> <h1>catagory</h1>
              </div>
              </Link>
              <Link href='/upload/upload-post' hidden={pathname.includes('upload/upload-post') || !activeUserSession} className="group hover:bg-zinc-800 dark:hover:bg-zinc-300">
              <div className="flex flex-row justify-between transition-all duration-300  px-2 py-2 ">
                 <ArrowUpFromLine className="group-hover:-translate-y-1 transition-transform duration-500 stroke-light dark:stroke-dark group-hover:stroke-light dark:group-hover:stroke-dark"/> <h1 >post</h1>
              </div>
              </Link>
              <Link href={`/upload/upload-profile`}  hidden={pathname.includes('upload/upload-profile') || !activeUserSession} className="group hover:bg-zinc-800 dark:hover:bg-zinc-300 ">
              <div className="flex flex-row justify-between transition-all duration-500 px-2  py-2 ">
              <UserPen className="group-dark:hover:stroke-dark transition-transform duration-500 group-hover:-translate-y-1 group-hover:stroke-light dark:group-hover:stroke-dark stroke-light dark:stroke-dark dark:fill-dark fill-white"/><h1>profile</h1>
              </div>
              </Link>
              </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
       
      </NavigationMenuList>
                  </NavigationMenu>
                ):(activeUser?.role === "merchant" ? (<NavigationMenu className={cn("max-md:hidden text-sm font-semibold",{
                  "ml-4": pathname === "/"
                })} hidden=
                  {activeUser?.role !== "merchant"}>
                  <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="transition-colors focus:border-black dark:focus:border-light data-[state=open]:border-black dark:data-[state=open]:border-light duration-500 rounded-sm font-mono border-2 border-dark dark:border-light font-semibold h-7 text-sm text-dark hover:bg-black bg-light hover:text-light dark:bg-dark dark:text-light hover:dark:bg-light hover:dark:text-black data-[state=open]:bg-black data-[state=open]:text-light dark:data-[state=open]:bg-light dark:data-[state=open]:text-black dark:data-[active]:bg-light dark:data-[active]:text-black data-[active]:bg-black data-[active]:text-light dark:focus:bg-light focus:text-light dark:focus:text-black focus:bg-black px-1 py-2 max-lg:w-8 max-lg:h-8" > <div className="flex gap-2 "><h1 className="max-lg:hidden text-sm">uploads</h1>  
          <MonitorUp /></div> </NavigationMenuTrigger>
        <NavigationMenuContent className=" w-32 flex-col gap-4 backdrop-blur-sm dark:bg-light bg-dark text-light dark:text-dark">
          <div className="flex flex-col w-32 h-full ">
            <Link href='/upload/upload-post' hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-post') || !activeUserSession} className="group hover:bg-zinc-800 dark:hover:bg-zinc-300 ">
            <div className="flex  flex-row justify-between transition-all duration-300 px-2 rounded-lg py-2 ">
               <ArrowUpFromLine className="group-hover:-translate-y-1 transition-all duration-500 dark:stroke-dark stroke-light group-hover:stroke-light dark:group-hover:stroke-dark"/> <h1>post</h1>
            </div>
            </Link>
            <Link href={`/upload/upload-profile`} hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-profile') || !activeUserSession} className="group hover:bg-zinc-800 dark:hover:bg-zinc-300">
            <div className="flex flex-row justify-between transition-all duration-500 px-2 rounded-lg py-2 ">
            <UserPen className="dark:hover:stroke-dark transition-all duration-500 group-hover:-translate-y-1 group-hover:stroke-light dark:group-hover:stroke-dark stroke-light dark:stroke-dark"/><h1>profile</h1>
            </div>
            </Link>
            </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
     
    </NavigationMenuList>
                </NavigationMenu>):"") }
                <div className="cursor-pointer max-md:hidden">
                  <Link href={`/profile/traders`}>
                  <Users className="dark:stroke-light transition-colors duration-300 stroke-dark dark:hover:fill-light hover:fill-black dark:hover:stroke-slate-200 hover:stroke-black fill-light dark:fill-dark"/>
                  </Link>
                </div>
                <div hidden={pathname.includes('/send') || activeUser === undefined || (activeUser.accepted === "accept" && activeUser?.email !== Eyueal)} >
                    <Link href={activeUser?.email === Eyueal ? `/send/response` : `/send/request`} className="relative">
                    {activeUser?.email === Eyueal? <div className="flex "><Crown className="stroke-dark dark:stroke-light dark:hover:stroke-slate-200 hover:stroke-black fill-light dark:fill-dark dark:hover:fill-light hover:fill-black cursor-pointer transition-all duration-300"/> <sup className="text-sm font-semibold">{requestedCount} </sup> </div>: <Send className="stroke-dark dark:stroke-light dark:hover:stroke-slate-200 hover:stroke-black fill-light dark:fill-dark dark:hover:fill-light hover:fill-black cursor-pointer transition-all duration-300" />}  </Link>
                   
                </div>
                {activeUser && <Link href={`/profile/${activeUser?.id}`} className="mr-5">
              <div className=' dark:text-slate-300 text-dark md:hidden'>

                <div className="w-8 h-8 border-2 rounded-full border-dark dark:border-light">  
                <Image
               alt="Image"
               src={userImage}
               width={40}
               height={40}
               className="rounded-full"
               />
                </div>

              </div>
                  </Link> }
               
                </div>
       
            <div className=' relative max-md:ml-4'>
           
                 { pathname !== "/" ? (<div className="mt-5"><Search/></div>) : <div className="flex flex-col max-md:hidden dark:text-light text-dark items-center bg-light dark:bg-dark h-full rounded-sm px-2">
                    <h1 className="z-20 font-bold font-mono text-3xl"><span className="text-blue-500">m</span>ar<span className="text-yellow-500">k</span>a<span className="text-red-500">.</span>c<span className="text-green-500">o</span>m</h1>
                   <Link href={'/'} className=" flex flex-col justify-center items-center z-10"> 
                    <div className="bg-cover bg-center w-20 h-0 z-0 " >
                    <Image src={'/green-city.png'} alt="hy" width={100} height={100}/>
                    </div>
                    </Link>
                    </div>}
      
            </div>
           
            <div className="flex flex-row justify-center gap-4 items-center">
            <div className="-mb-2 max-md:hidden">
              <button className='z-10 text-dark text-xl '>
             {darkTheme ? <MdOutlineLightMode className='cursor-pointer text-slate-50 ' 
             onClick={() => {
              setDarkTheme(false);
              localStorage.removeItem("theme")
             }}/>  
             : 
              <MdDarkMode className='cursor-pointer'
              onClick={()=>{
                setDarkTheme(true);
                localStorage.setItem('theme', "true")
              }}
              />}
              </button>
                
            </div> 

                 {activeUser && <Link href={`/profile/${activeUser?.id}`} className=" max-md:hidden max-md:mr-5">
              <div className=' dark:text-slate-300 text-dark'>

                <div className="w-8 h-8 border-2 rounded-full border-dark dark:border-light">  
                <Image
               alt="Image"
               src={userImage}
               width={40}
               height={40}
               className="rounded-full"
               />
                </div>

              </div>
                  </Link> }

                <div className=" flex rounded-lg max-md:hidden mr-5 ">
                <div className={cn("rounded-md pr-2 text-sm border-2 text-dark dark:bg-dark bg-light dark:border-light  dark:text-light border-dark flex gap-2",{
                'text-sm border-2 bg-gradient-to-r dark:from-dark cursor-pointer dark:via-light dark:to-light from-light via-dark to-dark ease-linear transition-all duration-700 hover:text-light bg-[200%_auto] hover:bg-right dark:hover:text-black dark:hover:bg-black hover:border-dark ': !isPending
                })}>
                <button disabled ={isPending}  className='flex justify-start pl-2 font-bold text-sm py-0.5 font-mono' onClick={() => {
                  if(!user){
                    signIN()
                  } else{
                    signOUT()
                  }

                  }}
                  > {user ? "Log-out" : "Log-in"}</button>
                <button disabled ={isPending} >
                <FaGoogle className={cn('fill-light dark:fill-black',{
                  "fill-black dark:fill-light": isPending
                })}/>
                </button>
                </div>
                </div>

                <Sheet >
              <SheetTrigger asChild>
              <div className='mr-5  max-sm:mt-2 md:hidden items-center flex justify-center cursor-pointer'>
                    <div className='w-5 h-5'>
                      <Icons.nav className='dark:fill-light fill-dark'/>
                    </div>
                  </div>
              </SheetTrigger>
              <SheetContent className="w-36 md:h-48 flex flex-col bg-light text-dark font-mono border-none rounded-md overflow-auto md:hidden">
                <SheetHeader className="flex justify-center pl-2 items-start">
                  <SheetTitle>
                  <div className= 'w-10 dark:fill-slate-300 fill-dark ml-0'>
                      <Link href={'/'} className=" flex flex-col justify-center  ">
                      <div className="text-dark rounded-lg">
                      <Image src={'/green-city.png'} alt="hy" width={1000} height={100}/>
                      </div>
                      <h3 className="text-sm dark:text-slate-300 text-dark font-bold tracking-widest"><span className="text-blue-500">m</span>ar<span className="text-yellow-500">k</span>a</h3>
                      </Link>
                  </div>
                  </SheetTitle>
                  
                  <SheetDescription>
                    <h3>our platform is easy and simple to use</h3>
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-3 flex flex-col w-full  text-light md:hidden h-screen">
                  <div className="flex w-32 mx-auto rounded-md mb-4 hover:bg-black text-black hover:text-light bg-light">

                    {darkTheme ? <div  className="flex px-2 py-1 rounded-md hover:bg-black group border-2 border-black text-black hover:text-light bg-light w-full items-center justify-between gap-5 transition-all duration-200 cursor-pointer" onClick={() => {
                      setDarkTheme(false);
                      localStorage.removeItem("theme")
                    }}> <h1 className="font-semibold text-sm" >light</h1>  <button className='border-2 rounded-full w-5 h-5 group-hover:border-light dark:border-light dark:text-slate-300 border-black text-dark dark:hover:text-slate-100 transition-all duration-200 md:hidden '><MdOutlineLightMode className='cursor-pointer fill-black group-hover:fill-light'
                   /> </button> </div>  
                    :
                    <div className="rounded-md flex px-2 py-1 border-2 border-black  hover:bg-black group text-black hover:text-light bg-light w-full items-center justify-between gap-5 transition-all duration-200 cursor-pointer"onClick={()=>{
                      setDarkTheme(true);
                      localStorage.setItem('theme', "true")
                    }}> <h1 className="font-semibold text-sm" >dark</h1>  <button className='border-2 group-hover:border-light rounded-full w-5 h-5 dark:border-light dark:text-slate-300 border-black text-dark dark:hover:text-slate-100 transition-all duration-200 md:hidden '><MdDarkMode className='cursor-pointer group-hover:fill-light fill-black'
                   /> </button> </div> 
                      }

                     
                  </div>
                  
                   {activeUser && <div className='font-medium md:hidden hover:bg-zinc-200  hover:border-black hover:text-black bg-black ransition-all duration-200 flex items-center justify-center border-y-2 border-light w-full'>
                    <Link href={`/profile/${activeUser.id}`} className="py-1">
              <div className="">
                <h1 className="text-sm text-center font-semibold">user</h1>
              </div>
              </Link> 
                </div> }
                
                
                  {activeUser !== undefined && activeUser.email === Eyueal ? <div hidden={activeUser.email !== Eyueal} className="flex flex-col bg-black w-full text-center">
                <Link href='/upload/upload-catagory' hidden={activeUser?.email  !== Eyueal || pathname.includes('upload/upload-catagory') || !activeUserSession} className="w-full ransition-all duration-200 hover:border-black hover:text-black hover:bg-light border-b-2 flex items-center justify-center  border-light bg-black">
              <div className="py-1">
                <h1 className="text-sm font-semibold">catagory</h1>
              </div>
              </Link>
              <Link href='/upload/upload-profile' hidden={activeUser?.email  !== Eyueal || pathname.includes('/upload/upload-profile') || !activeUserSession} className="w-full ransition-all duration-200 hover:bg-light border-b-2 flex items-center justify-center hover:text-black bg-black hover:border-black border-light">
              <div className="py-1">
                <h1 className="text-sm font-semibold">profile</h1>
              </div>
              </Link>
              <Link href='/upload/upload-post' hidden={activeUser?.email  !== Eyueal || pathname.includes('upload/upload-post') || !activeUserSession} className="w-full ransition-all duration-200 hover:bg-light border-b-2 flex items-center justify-center hover:text-black bg-black hover:border-black border-light">
              <div className="py-1">
                <h1 className="text-sm font-semibold">post</h1>
              </div>
              </Link>
              <Link href='/profile/traders' hidden={activeUser?.email  !== Eyueal || pathname.includes('profile/traders') || !activeUserSession}  className="w-full group ransition-all duration-200 border-b-2 flex items-center justify-center hover:bg-light hover:text-black bg-black hover:border-black border-light">
              <div className="flex flex-row gap-1 justify-center py-1">
                <h1 className="text-sm font-semibold">Traders</h1>
                <Users className="dark:stroke-light w-4 h-4 stroke-dark dark:hover:stroke-slate-200 hover:stroke-black fill-light group-hover:fill-zinc-400  dark:fill-dark"/>
                
              </div>
              </Link>
              </div>
              : activeUser !== undefined && activeUser.accepted === "accept" && activeUser.role === "merchant" ?  <div hidden={activeUser.accepted !== "accept" || activeUser.role !== "merchant"} className="flex flex-col bg-black w-full text-center">
                <Link href='/upload/upload-post' hidden={activeUser?.role !== "merchant" ||  pathname.includes('upload/upload-post')} className="w-full border-b-2 flex items-center ransition-all duration-200 justify-center hover:bg-light hover:text-black bg-black hover:border-black border-light">
              <div className="py-1">
                <h1 className="text-sm font-semibold">Post</h1>
              </div>
              </Link>
                <Link href='/upload/upload-profile' hidden={activeUser?.role !== "merchant" ||  pathname.includes('/upload/upload-profile')} className="w-full ransition-all duration-200 border-b-2 flex items-center justify-center hover:bg-light hover:text-black bg-black hover:border-black border-light">
              <div className="py-1">
                <h1 className="text-sm font-semibold">profile</h1>
              </div>
              </Link>
              <Link href='/profile/traders' hidden={activeUser?.email  === Eyueal || pathname.includes('profile/traders') || !activeUserSession} className="w-full group border-b-2 ransition-all duration-200 flex items-center justify-center hover:bg-light hover:text-black bg-black hover:border-black border-light">
              <div className="flex flex-row gap-1 py-1 justify-center">
                <h1 className="text-sm font-semibold">Traders</h1>
                <Users className="dark:stroke-light w-4 h-4 group-hover:fill-zinc-400 stroke-dark dark:hover:stroke-slate-200 hover:stroke-black fill-light dark:fill-dark"/>
              </div>
              </Link>
              </div> : <Link href='/profile/traders' hidden={activeUser?.email  === Eyueal || pathname.includes('profile/traders') || !activeUserSession} className={cn("w-full group border-b-2 ransition-all duration-200 flex items-center justify-center hover:bg-light hover:text-black bg-black hover:border-black border-light",{ "border-y-2": activeUser === undefined})}>
              <div className="flex flex-row gap-1 py-1 justify-center">
                <h1 className="text-sm font-semibold">Traders</h1>
                <Users className="dark:stroke-light w-4 h-4 group-hover:fill-zinc-400 stroke-dark dark:hover:stroke-slate-200 hover:stroke-black fill-light dark:fill-dark"/>
              </div>
              </Link>

}
                 
            <div className='group flex gap-2 w-32 mx-auto items-center justify-center mt-10 cursor-pointer hover:text-light hover:bg-black bg-light text-black border-2 transition-all duration-200 md:hidden border-black rounded-md'>
            <button className=' flex justify-start pl-2 py-1 font-bold text-sm ' onClick={() => {
            if(!activeUser){
              signIN()
            } signOUT()
            }}
            >{activeUser ? "Logout" : "Login"}</button>
            <button className="py-1">
            <FaGoogle className='group-hover:fill-light fill-black'/>
            </button>
            
              </div>             
   </div>

              
                 <SheetFooter>
                  <SheetClose asChild>
                    
                  </SheetClose>
                </SheetFooter> 
              </SheetContent>
            </Sheet>
            
         
        </div>
            </div> 
        </div>
      
  )
}


export default Heading;