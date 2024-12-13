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
import React, { useContext, useState } from 'react'
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
import { ArrowUpFromLine, MonitorUp, Search, UserPen, Users } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";



const {useSession} = Authclient



const Heading = () => {
  const pathname = usePathname()
  console.log(pathname.includes('post/upload-catagory') + " pathname")
  
  const {data, isPending, error} = useSession()
  
  const session = data?.session;
  const {data: success} = trpc.database.getUsers.useQuery({id: session?.userId as string})

  const activeUserSession = success?.activeSessions
  const activeUser = success?.activeUser
  const user = success?.user


  const usersImage: (string | null)[] = []
  const userImage = activeUser?.image as string

if(user === undefined){
console.log("user is undefined ")
}else{
  user.map((user) => usersImage.push(user.image))
  usersImage.map((image) => image!)
}

  const {darkTheme, setDarkTheme} = useContext(ThemeContext)

 console.log(pathname)
  return (

    <div className='w-full backdrop-blur-3xl ' >
          <div className=" flex justify-between max-md:h-14 gap-4  border-dark dark:border-light border-b-[0.5px] ">
         <div className='flex flex-row max-md:hidden justify-center gap-4 max-md:justify-start items-center pt-3 my-auto max-lg:mb-2'>
          <div className='flex justify-center gap-4 ml-2 max-md:hidden'>
          <div className="ml-3 ">
          <div className='w-10 dark:fill-slate-50 fill-dark border-2 dark:border-slate-50 border-dark rounded-lg flex flex-col justify-center'>
            <Link href={'/'} className=" dark:fill-slate-50 fill-dark">
            <Icons.Logo />
            </Link>
          </div>
            <h3 className=" text-sm tracking-wider dark:text-slate-50 text-center text-dark font-bold font-mono"><span className="text-blue-500">m</span>ar<span className="text-yellow-500">k</span>a</h3>
          </div>

          </div>
         {/* {activeUser && <Link href={`/profile/${activeUser?.id}`}>
              <div className=' dark:text-slate-300 text-dark max-md:hidden'>

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
                </Link> } */}
                {activeUser?.email === 'eyuealzerihun1@gmail.com' && activeUser.role === "merchant" ? (
                  <NavigationMenu className="max-md:hidden ">
                    <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="transition-colors duration-300 rounded-sm font-mono font-semibold h-7 text-sm text-white hover:bg-dark bg-dark hover:text-white dark:bg-slate-50 dark:text-dark hover:dark:bg-slate-50 hover:dark:text-dark data-[state=open]:bg-dark data-[state=open]:text-white dark:data-[state=open]:bg-slate-50 dark:data-[state=open]:text-dark dark:data-[active]:bg-slate-300 dark:data-[active]:text-dark data-[active]:bg-black data-[active]:text-white dark:focus:text-black dark:focus:bg-slate-100 focus:text-white focus:bg-black px-2 py-2 max-lg:w-8 max-lg:h-8" > <div className="flex gap-2 "><h1 className="max-lg:hidden text-sm">upload</h1> <MonitorUp /></div> </NavigationMenuTrigger>
          <NavigationMenuContent className=" w-full flex-col gap-2 backdrop-blur-sm dark:bg-light bg-dark dark:text-dark text-light">
            {/* <h1 className="py-2 text-lg text-center bg-slate-100">uploads</h1> */}
            <div className="flex flex-col w-56 h-full ">
                <Link href='/upload/upload-catagory' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-catagory') || !activeUserSession} className=" group  max-md:hidden">
              <div className="flex flex-row justify-between transition-all duration-300 px-2 py-2">
              <ArrowUpFromLine className="group-hover:-translate-y-2 transition-transform duration-500 stroke-light dark:stroke-dark group-hover:stroke-light dark:group-hover:stroke-dark"/> <h1 className="text-md font-semibold font-serif">catagory</h1>
              </div>
              </Link>
              <Link href='/upload/upload-post' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-post') || !activeUserSession} className="group max-md:hidden ">
              <div className="flex flex-row justify-between transition-all duration-300  px-2 py-2 ">
                 <ArrowUpFromLine className="group-hover:-translate-y-2 transition-transform duration-500 stroke-light dark:stroke-dark group-hover:stroke-light dark:group-hover:stroke-dark"/> <h1 className="text-md font-semibold font-serif">post</h1>
              </div>
              </Link>
              <Link href={`/upload/upload-profile`}  hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-profile') || !activeUserSession} className="group max-md:hidden ">
              <div className="flex flex-row justify-between transition-all duration-500 px-2  py-2 ">
              <UserPen className="group-dark:hover:stroke-dark transition-transform duration-500 group-hover:-translate-y-2 group-hover:stroke-light dark:group-hover:stroke-dark stroke-light dark:stroke-dark"/><h1 className="text-md font-semibold font-serif">profile</h1>
              </div>
              </Link>
              </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
       
      </NavigationMenuList>
                  </NavigationMenu>
                ):(activeUser?.role === "merchant" ? (<NavigationMenu className="max-md:hidden">
                  <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="transition-colors rounded-sm font-mono font-semibold h-7 text-sm duration-100 text-white hover:bg-dark bg-dark hover:text-white dark:bg-slate-50 dark:text-dark hover:dark:bg-slate-50 hover:dark:text-dark data-[state=open]:bg-dark data-[state=open]:text-white dark:data-[state=open]:bg-slate-50 dark:data-[state=open]:text-dark dark:data-[active]:bg-slate-300 dark:data-[active]:text-dark data-[active]:bg-black data-[active]:text-white dark:focus:text-black dark:focus:bg-slate-100 focus:text-white focus:bg-black px-2 py-2 max-lg:w-8 max-lg:h-8"> <div className="flex gap-2 "> <h1 className="max-lg:hidden text-sm">uploads</h1> <MonitorUp /></div> </NavigationMenuTrigger>
        <NavigationMenuContent className=" w-full flex-col gap-4 backdrop-blur-sm dark:bg-light bg-dark text-light dark:text-dark">
          <div className="flex flex-col w-56 h-full ">
              <Link href='/upload/upload-catagory' hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-catagory') || !activeUserSession} className=" group rounded-lg max-md:hidden">
            <div className="flex flex-row justify-between transition-all duration-300 px-2 rounded-lg py-2">
            <ArrowUpFromLine className="group-hover:-translate-y-2 transition-all duration-500 stroke-light group-hover:stroke-light dark:group-hover:stroke-dark"/> <h1 className="text-md font-semibold font-serif">catagory</h1>
            </div>
            </Link>
            <Link href='/upload/upload-post' hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-post') || !activeUserSession} className="group rounded-lg max-md:hidden ">
            <div className="flex flex-row justify-between transition-all duration-300 px-2 rounded-lg py-2 ">
               <ArrowUpFromLine className="group-hover:-translate-y-2 transition-all duration-500 dark:stroke-dark stroke-light group-hover:stroke-light dark:group-hover:stroke-dark"/> <h1 className="text-md font-semibold font-serif">post</h1>
            </div>
            </Link>
            <Link href={`/upload/upload-profile`} hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-post') || !activeUserSession} className="group rounded-lg max-md:hidden ">
            <div className="flex flex-row justify-between transition-all duration-500 px-2 rounded-lg py-2 ">
            <UserPen className="dark:hover:stroke-dark transition-all duration-500 group-hover:-translate-y-2 group-hover:stroke-light dark:group-hover:stroke-dark stroke-light dark:stroke-dark"/><h1 className="text-md font-semibold font-serif">profile</h1>
            </div>
            </Link>
            </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
     
    </NavigationMenuList>
                </NavigationMenu>):"")}

                <div className="cursor-pointer">
                  <Link href={`#`}>
                  <Users className="dark:stroke-light stroke-dark hover:stroke-black hover:fill-gray-500"/>
                  </Link>
                </div>
              
         </div>
       
            <div className='flex justify-center max-md:justify-start items-center gap-1 max-md:ml-0'>
           
                 { pathname !== "/" ? (<div className="max-md:ml-5 bg-transparent">
                    <div className="flex md:w-72 gap-1 max-sm:w-40 h-9 flex-row border-2 dark:border-light  border-dark rounded-md items-center"> 
                    <Search height={20} className="dark:stroke-light stroke-dark"/>
                      <input type="text" className="outline-none w-full bg-transparent placeholder:font-semibold placeholder:text-slate-500 font-bold font-mono text-sm text-dark dark:text-light focus:placeholder:text-transparent dark:placeholder:text-slate-400" placeholder="search..."/>
                    </div>
                  </div>) : <div className="max-md:ml-5 flex flex-col dark:text-light text-dark items-center bg-transparent">
                    <h1 className="font-bold font-mono text-3xl max-md:-mb-2"><span className="text-blue-500">m</span>ar<span className="text-yellow-500">k</span>a<span className="text-red-500">.</span>c<span className="text-green-500">o</span>m</h1>
                    <p className="font-semibold text-lg max-md:mb-2">market center!</p>
                    </div>}
      
            </div>
           
            <div className="flex flex-row justify-center items-center">
            <div className='flex group max-md:hidden justify-center items-center'>
              <button className='z-10  w-10 h-6 text-dark text-xl '>
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

                 {/* <div className=" flex rounded-lg max-md:hidden mr-5 ">
              <div className='text-sm duration-300 border-2 hover:bg-neutral-800 hover:text-white dark:hover:text-black dark:hover:bg-slate-200 dark:border-slate-50 dark:bg-light dark:text-dark  cursor-pointer flex gap-2 bg-dark border-dark text-light  rounded-md pr-2'>
              <button className=' flex justify-start pl-2  font-bold text-sm py-0.5 ' onClick={() => {
                if(!user){
                  signIN()
                } signOUT()
                }}
                >{activeUser ? "Logout" : "Login"}</button>
              <button>
              <FaGoogle className=''/>
              </button>
              </div>
              </div> */}
                 {activeUser ? <Link href={`/profile/${activeUser?.id}`} className="mr-10">
              <div className=' dark:text-slate-300 text-dark max-md:hidden'>

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
                </Link> : 
                <div className=" flex rounded-lg max-md:hidden mr-5 ">
                <div className='text-sm duration-300 border-2 hover:bg-neutral-800 hover:text-white dark:hover:text-black dark:hover:bg-slate-200 dark:border-slate-50 dark:bg-light dark:text-dark  cursor-pointer flex gap-2 bg-dark border-dark text-light  rounded-md pr-2'>
              <button className=' flex justify-start pl-2  font-bold text-sm py-0.5 ' onClick={() => {
                if(!user){
                  signIN()
                } 
                }}
                > Login</button>
              <button>
              <FaGoogle className=''/>
              </button>
              </div>
              </div>}

                <Sheet >
              <SheetTrigger asChild>
              <div className='mr-5  max-sm:mt-2 md:hidden items-center flex justify-center cursor-pointer'>
                    <div className='w-5 h-5'>
                      <Icons.nav className='dark:fill-slate-300 fill-dark'/>
                    </div>
                  </div>
              </SheetTrigger>
              <SheetContent className="w-36 md:h-48  bg-inherit border-none rounded-md overflow-auto md:hidden">
                <SheetHeader className="flex justify-center items-start">
                  <SheetTitle className="text-dark border-2 border-dark rounded-lg text-left ">
                  <div className=' w-10 dark:fill-slate-300 fill-dark ml-0'>
                      <Link href={'#'}>
                      <Icons.Logo />
                      </Link>
                  </div>
                  </SheetTitle>
                  <h3 className="pl-1.5 text-[12px] dark:text-slate-300 text-dark font-bold">N.E.B</h3>
                  <SheetDescription>
                    <h3>our platform is easy and simple to use</h3>
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-3 flex flex-col gap-4 py-4 md:hidden h-screen">
                  <div className="flex items-center justify-between gap-5 transition-all hover:-translate-y-1 duration-500 cursor-pointer">
                    <div>
                      <h1 className="font-semibold font-serif text-dark dark:bg-slate-300">{darkTheme ? "Light" : "Dark"}</h1>
                    </div>
                  
                    <button className='border-2 rounded-full w-5 h-5 dark:border-slate-300 dark:text-slate-300 border-dark text-dark dark:hover:text-slate-100 transition duration-150 md:hidden '>
                      
                    {darkTheme ? <MdOutlineLightMode className='cursor-pointer '
                    onClick={() => {
                      setDarkTheme(false);
                      localStorage.removeItem("theme")
                    }}/> 
                    :
                      <MdDarkMode className='cursor-pointer '
                      onClick={()=>{
                        setDarkTheme(true);
                        localStorage.setItem('theme', "true")
                      }}
                      />}

                      </button>
                  </div>
                  <Link href="#">
                   {activeUser && <div className='font-medium md:hidden hover:bg-dark rounded-lg'>
                    <Link href={`/profile/${activeUser.id}`} className="">
              <div className="hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-dark dark:border-slate-300 bg-slate-300 dark:bg-dark text-dark dark:text-slate-300 px-2 rounded-lg">
                <h1 className="text-sm font-semibold font-serif">user</h1>
              </div>
              </Link>
                </div> }
                </Link>
                
                  {activeUser?.email === 'eyuealzerihun1@gmail.com' && activeUser.role === "merchant" ?<div className="flex flex-col gap-4">
                <Link href='/upload/upload-catagory' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-catagory') || !activeUserSession} className=" hover:bg-dark rounded-lg dark:hover:bg-slate-300 transition-all duration-300">
              <div className="hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-dark dark:border-slate-300 bg-slate-300 dark:bg-dark text-dark dark:text-slate-300 px-2 rounded-lg">
                <h1 className="text-sm font-semibold font-serif">catagory</h1>
              </div>
              </Link>
              <Link href='/upload/upload-post' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-post') || !activeUserSession} className="hover:bg-dark rounded-lg dark:hover:bg-slate-300 transition-all duration-300">
              <div className="hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-dark dark:border-slate-300 bg-slate-300 dark:bg-dark text-dark dark:text-slate-300 px-2 rounded-lg">
                <h1 className="text-sm font-semibold font-serif">post</h1>
              </div>
              </Link>
              <Link href='#' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-post') || !activeUserSession} className="hover:bg-dark rounded-lg dark:hover:bg-slate-300 transition-all duration-300">
              <div className="hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-dark dark:border-slate-300 bg-slate-300 dark:bg-dark text-dark dark:text-slate-300 px-2 rounded-lg">
                <h1 className="text-sm font-semibold font-serif">profile</h1>
              </div>
              </Link>
              </div>
              : <div className="flex flex-col gap-4">
                <Link href='/upload/upload-post' hidden={activeUser?.role !== "merchant" ||  pathname.includes('upload/upload-post')} className="md:hidden hover:bg-dark dark:hover:bg-slate-300 rounded-lg transition-all duration-300">
              <div className="hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-dark dark:border-slate-300 bg-slate-300 dark:bg-dark text-dark dark:text-slate-300 px-2 rounded-lg">
                <h1 className="text-sm font-semibold font-serif">Post</h1>
              </div>
              </Link>
              <Link href='/upload/upload-profile' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-post') || !activeUserSession} className="hover:bg-dark rounded-lg dark:hover:bg-slate-300 transition-all duration-300">
              <div className="hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-dark dark:border-slate-300 bg-slate-300 dark:bg-dark text-dark dark:text-slate-300 px-2 rounded-lg">
                <h1 className="text-sm font-semibold font-serif">profile</h1>
              </div>
              </Link>
              </div>

}
<div className=" dark:hover:bg-slate-300 hover:bg-dark rounded-lg flex justify-start transition-all duration-300">       
            <div className='transition-all hover:-translate-y-1 duration-300 flex gap-2 cursor-pointer bg-slate-300 text-dark dark:text-slate-300 border-2  rounded-lg w-full dark:bg-slate-300 md:hidden border-dark'>
            <button className=' flex justify-start pl-2 font-bold text-sm font-serif' onClick={() => {
            if(!activeUser){
              signIN()
            } signOUT()
            }}
            >{activeUser ? "Logout" : "Login"}</button>
            <button>
            <FaGoogle className='pr2'/>
            </button>
            </div>
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
