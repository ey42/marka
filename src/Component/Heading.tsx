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
import React, { useContext } from 'react'
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
import { ArrowUpFromLine, MonitorUp, UserPen } from "lucide-react";
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
  return (
    // <MaxWidthWrapper>
    <div className='w-screen backdrop-blur-lg rounded-md' >
          <div className=" flex justify-between gap-4 border-dashed border-dark dark:border-slate-400 border-b-[0.5px] ">
         <div className='flex flex-row justify-center max-md:justify-start items-center pt-3 my-auto max-lg:mb-2'>
          <div className='flex justify-center gap-4 ml-2 max-md:hidden'>
          <div className="ml-3 ">
          <div className='w-10 dark:fill-slate-300 fill-dark border-2 dark:border-slate-300 border-dark rounded-lg flex flex-col justify-center'>
            <Link href={'/'} className=" dark:fill-slate-300 fill-dark">
            <Icons.Logo />
            </Link>
          </div>
            <h3 className=" text-[10px] dark:text-slate-300 text-dark font-bold">N.E.N.B.A</h3>
          </div>

          </div>
         {activeUser && <Link href={`/profile/${activeUser?.id}`}>
              <div className='mr-5 dark:text-slate-300 text-dark max-md:hidden ml-6'>

                <div className="w-8 h-8 border-2 rounded-full border-dark dark:border-slate-300">  
                <Image
               alt="Image"
               src={userImage}
               width={40}
               height={40}
               className="rounded-full"
               />
               {/* <img src={userImage} alt="hey" /> */}
                </div>

              </div>
                </Link> }
                {activeUser?.email === 'eyuealzerihun1@gmail.com' && activeUser.role === "merchant" ? (
                  <NavigationMenu className="max-md:hidden ">
                    <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="transition-colors duration-100 bg-slate-300 text-dark lg:border-2 border-dark hover:bg-dark hover:text-slate-300 dark:bg-dark dark:text-slate-300 dark:border-slate-300 hover:dark:border-dark hover:dark:bg-slate-300 hover:dark:text-dark data-[state=open]:bg-dark data-[state=open]:text-slate-300 dark:data-[state=open]:bg-slate-300 dark:data-[state=open]:text-dark dark:data-[active]:bg-slate-300 dark:data-[active]:text-dark data-[active]:bg-dark data-[active]:text-slate-300 dark:focus:text-dark dark:focus:bg-slate-300 focus:text-slate-300 focus:bg-dark px-2 py-2 max-lg:w-8 max-lg:h-8" > <div className="flex gap-2 "><h1 className="max-lg:hidden">uploads</h1> <MonitorUp /></div> </NavigationMenuTrigger>
          <NavigationMenuContent className=" w-full flex-col gap-2 backdrop-blur-sm bg-black">
            {/* <h1 className="py-2 text-lg text-center bg-slate-100">uploads</h1> */}
            <div className="flex flex-col w-56 h-full  ">
                <Link href='/upload/upload-catagory' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-catagory') || !activeUserSession} className=" group  max-md:hidden">
              <div className="flex flex-row justify-between transition-all duration-300 text-slate-300 dark:text-slate-300 px-2  py-2 group-hover:bg-slate-300 group-hover:text-dark group-dark:hover:bg-slate-300 group-dark:hover:text-dark">
              <ArrowUpFromLine className="group-hover:-translate-y-2 transition-transform duration-1000 stroke-slate-300 group-hover:stroke-dark"/> <h1 className="text-md font-semibold font-serif">catagory</h1>
              </div>
              </Link>
              <Link href='/upload/upload-post' hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-post') || !activeUserSession} className="group max-md:hidden ">
              <div className="flex flex-row justify-between transition-all duration-300 text-slate-300 dark:text-slate-300 px-2 py-2 group-hover:bg-slate-300 group-hover:text-dark group-dark:hover:bg-slate-300 group-dark:hover:text-dark">
                 <ArrowUpFromLine className="group-hover:-translate-y-2 transition-transform duration-1000 stroke-slate-300 group-hover:stroke-dark"/> <h1 className="text-md font-semibold font-serif">post</h1>
              </div>
              </Link>
              <Link href={`/upload/upload-profile`}  hidden={activeUser?.email  !== 'eyuealzerihun1@gmail.com' || pathname.includes('upload/upload-profile') || !activeUserSession} className="group max-md:hidden ">
              <div className="flex flex-row justify-between transition-all duration-300 text-slate-300 dark:text-slate-300 px-2  py-2 group-hover:bg-slate-300 group-hover:text-dark group-dark:hover:bg-slate-300 group-dark:hover:text-dark">
              <UserPen className="group-dark:hover:stroke-dark transition-transform duration-1000 group-hover:-translate-y-2 group-hover:stroke-dark stroke-slate-300"/><h1 className="text-md font-semibold font-serif">profile</h1>
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
        <NavigationMenuTrigger className="bg-slate-300 text-dark border-2 border-dark hover:bg-dark hover:text-slate-300 dark:bg-dark dark:text-slate-300 dark:border-slate-300 hover:dark:border-dark hover:dark:bg-slate-300 hover:dark:text-dark data-[state=open]:bg-dark data-[state=open]:text-slate-300 dark:data-[state=open]:bg-slate-300 dark:data-[state=open]:text-dark dark:data-[active]:bg-slate-300 dark:data-[active]:text-dark data-[active]:bg-dark data-[active]:text-slate-300 dark:focus:text-dark dark:focus:bg-slate-300 focus:text-slate-300 focus:bg-dark px-2 py-2"> <div className="flex gap-2 ">uploads <MonitorUp /></div> </NavigationMenuTrigger>
        <NavigationMenuContent className=" w-60">
          <div className="flex flex-col gap-4 w-56 h-full bg-slate-200 ">
              <Link href='/upload/upload-catagory' hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-catagory') || !activeUserSession} className=" group rounded-lg max-md:hidden">
            <div className="flex flex-row justify-between transition-all duration-300 text-dark dark:text-slate-300 px-2 rounded-lg py-2 group-hover:bg-dark group-hover:text-slate-300 group-dark:hover:bg-slate-300 group-dark:hover:text-dark">
            <ArrowUpFromLine className="group-hover:-translate-y-2 transition-all duration-300 stroke-dark group-hover:stroke-slate-300"/> <h1 className="text-md font-semibold font-serif">catagory</h1>
            </div>
            </Link>
            <Link href='/upload/upload-post' hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-post') || !activeUserSession} className="group rounded-lg max-md:hidden ">
            <div className="flex flex-row justify-between transition-all duration-300 text-dark dark:text-slate-300 px-2 rounded-lg py-2 group-hover:bg-dark group-hover:text-slate-300 group-dark:hover:bg-slate-300 group-dark:hover:text-dark">
               <ArrowUpFromLine className="group-hover:-translate-y-2 transition-all duration-300 stroke-dark group-hover:stroke-slate-300"/> <h1 className="text-md font-semibold font-serif">post</h1>
            </div>
            </Link>
            <Link href={`/upload/upload-profile`} hidden={activeUser?.role  !== 'merchant' || pathname.includes('upload/upload-post') || !activeUserSession} className="group rounded-lg max-md:hidden ">
            <div className="flex flex-row justify-between transition-all duration-300 text-dark dark:text-slate-300 px-2 rounded-lg py-2 group-hover:bg-dark group-hover:text-slate-300 group-dark:hover:bg-slate-300 group-dark:hover:text-dark">
            <UserPen className="dark:hover:stroke-dark transition-all duration-300 group-hover:-translate-y-2 group-hover:stroke-slate-300 stroke-dark"/><h1 className="text-md font-semibold font-serif">profile</h1>
            </div>
            </Link>
            </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
     
    </NavigationMenuList>
                </NavigationMenu>):"")}

         </div>
       
            <div className='flex gap-3 justify-center max-md:justify-start items-center mb-2 max-md:ml-0 my-auto'>
             
              
                {user?.map((profile,i) => (
                profile.role === "merchant" ? (
                  
               
                  <Link href={`/profile/${profile.id}`} replace={true}>
                  {/* <Link href='#'> */}
                    <div key={i} className=" flex-col overflow-hidden dark:border-slate-300  dark:text-slate-300 w-30 h-30 flex items-center justify-center cursor-pointer" >
                      <Image
                      src={profile.image!}
                      alt=''
                      width={50}
                      height={50}
                      className="rounded-full max-md:w-7 max-md:h-7 max-sm:w-6 max-sm:h-6  w-8 h-8 border-2 border-dark dark:border-dark"
                      />
                      <p className="text-[8px] overflow-hidden max-sm:hidden">{profile.name.split(' ')[0]}</p>
                    </div>
                    </Link>
                  
                 ): " "))}  
                
            </div>
           
            <div className="flex flex-row justify-between items-center gap-4">
            <div className='flex group max-md:hidden justify-center items-center'>
              <button className='z-10 flex flex-row dark:justify-start justify-end rounded-md w-10 h-6 text-dark text-xl bg-slate-300 dark:bg-dark border-2 border-dark dark:border-slate-300 transition-all duration-100'>
             {darkTheme ? <MdOutlineLightMode className='cursor-pointer text-slate-300 ' 
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
              <p className={`z-0 -ml-9 font-bold focus:visible group-hover:-translate-y-6 transition-transform duration-700`}>{darkTheme === true ? "dark" : "light"}</p>
                
            </div> 

                 <div className=" flex flex-1 hover:bg-dark dark:hover:bg-slate-300 rounded-lg max-md:hidden mr-5 transition-all duration-300">
              <div className='hover:-translate-y-1 transition-all duration-300 border-2  dark:border-slate-300 dark:bg-dark dark:text-slate-300  cursor-pointer flex gap-2 bg-slate-300 border-dark text-dark  rounded-md pr-2'>
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
              </div>

                <Sheet >
              <SheetTrigger asChild>
              <div className='mr-5 my-auto mb-2 max-sm:mt-2 max-md:mb-4 md:hidden items-center flex justify-center cursor-pointer'>
                    <div className='w-5 h-5'>
                      <Icons.nav className='dark:fill-slate-300 fill-dark'/>
                    </div>
                  </div>
              </SheetTrigger>
              <SheetContent className="w-36 md:h-48  bg-inherit border-none rounded-md overflow-auto md:hidden">
                <SheetHeader className="flex justify-center items-start mt-0">
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
        // {/* </MaxWidthWrapper> */}
  )
}


export default Heading;
