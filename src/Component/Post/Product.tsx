"use client"
import { trpc } from '@/app/_trpc/client'
import React, { useState } from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ClipboardCheck, Copy, Phone, ShoppingCart, Trash2 } from 'lucide-react'
import { Icons } from '../Icons'
import { extractTimeAndDate, Eyueal } from '../Database'
import { useRouter, useSearchParams } from 'next/navigation'
import { Authclient } from "@/lib/auth-client";
import PaginationComponent from '../paginationComponent'
import { toast } from "sonner"




const Product = ({id}: {id: string}) => {
  const {useSession} = Authclient
  const {data: sess} = useSession()
  const user = sess?.user
  const router = useRouter()
  const {refetch} = trpc.database.deleteSolded.useQuery()  
  const {data: data, refetch: fetchAgain, isPending: fetching} = trpc.database.getAllPosts.useQuery()
  const posts = data?.allPosts
  const post = posts?.find((post) => post.id === id)
  const [isCopied, setIsCopied] = useState(false)
  const [isCopied1, setIsCopied1] = useState(false)
      const {mutate: upload,  } = trpc.database.soldPost.useMutation({
        onSuccess: () => {
          router.refresh()
           refetch()
           fetchAgain()
           router.push('/')
           toast.success("post solded successfully")
        },
        onError: (err) => {
          toast.error('Error on solding post:');
        refetch()
        },})
  const {mutate: deletedId} = trpc.database.deletePostById.useMutation({
          onSuccess: () => {
            console.log('Success! Deleting post...');
            fetchAgain()
            router.push('/')
           toast.success("post deleted successfully")
            
          },
          onError: (err) => {
            toast.error('Error deleting post:');
            refetch()
            fetchAgain()
          },
        })
  const Result = posts && posts.filter((p) => {
    const postTitle = post?.title.toLowerCase() as string
    return p.title.includes(postTitle)
  }) 

  const searchParams = useSearchParams()
  const resultCount = Result?.length as number
  const totalPages = Math.ceil(resultCount / 50)
  const currentPage = Number(searchParams.get('page')) || 1
 
        const handleDelete = () => {
          const comfirmed = window.confirm('are you sure you want to delete the post?')
          if(comfirmed && user?.email === Eyueal){
          deletedId({postId: id})
          router.push('/') 
        } else if(comfirmed && user?.id !== post?.author.id){
            deletedId({postId: id})
            router.push('/')
          }          
        }
        const handleSold = ({sold, id}: {sold: boolean, id: string}) => {
          upload({id: id as string, Sold: sold as boolean})
          refetch()
          fetchAgain()
        }


  const copyToClipboard = (text: string) => {
    try {
       navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  }
  const copyToClipboard1 = (text: string) => {
    try {
       navigator.clipboard.writeText(text)
      setIsCopied1(true)
      setTimeout(() => {
        setIsCopied1(false)
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='flex justify-center items-center flex-col text-black mt-10 dark:text-light'>
    <div hidden={fetching} className='flex gap-4 items-center justify-center'>
     { user?.email === Eyueal ? <div className='flex gap-4 mb-10 items-center justify-center'>
      <button onClick={handleDelete}>
      <Trash2 width={50} height={50} className='hover:stroke-red-600 transition-all duration-200 hover:fill-red-400'/>
      </button>  <button className={cn('border-2 border-light font-bold bg-dark px-4 h-8 text-lg text-light font-mono rounded-md dark:border-dark dark:bg-light hover:dark:bg-slate-400 dark:text-black hover:bg-black transition-colors duration-200',{
        "hidden": user?.id !== post?.author.id,
      })} onClick={() => handleSold({id: post?.id!, sold: !post?.isSold as boolean})}>{post?.isSold === true ? "un-sold" : "sold"}</button></div> : <div  className={cn('flex gap-4 mb-10 items-center justify-center',{
        "hidden": user?.id !== post?.author.id,
      })}><button onClick={handleDelete}>
      <Trash2 width={50} height={50} className='hover:stroke-red-600 transition-all duration-200 hover:fill-red-400'/>
      </button> <button className='border-2 border-light font-bold bg-dark px-4 h-8 text-lg text-light font-mono rounded-md dark:border-dark dark:bg-light hover:dark:bg-slate-400 dark:text-black hover:bg-black transition-colors duration-200' onClick={() => handleSold({id: post?.id!, sold: !post?.isSold as boolean})}>{post?.isSold === true ? "un-sold" : "sold"}</button></div> }
        </div>
      <MaxWidthWrapper className = 'flex bg-dark border-4 rounded-md border-dark dark:bg-light dark:border-light flex-col gap-10'>
      <div className='flex flex-row max-md:flex-col justify-center gap-10 text-sm mx-2 font-mono p-5'>
        <div className=' max-md:border-none border-r-4 pr-4 dark:border-dark border-light flex flex-col  gap-10'> 
          <div className='flex justify-center dark:text-black  text-3xl text-light tracking-wider font-bold'><h1>{(post?.title)?.toUpperCase()}</h1></div>
          <div className='flex justify-center border-b-4 dark:border-dark border-light'>
            <div className={cn('pb-5 ',{
              'contrast-50': post?.isSold === true
            })}> 
            <Image src={post !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(post.file as string[])[0]}`:''} alt={post !== undefined ? post.title : "image of the post"} objectFit='cover' width={400} height={100} className='rounded-md border-2 border-light dark:border-light '/>
            </div>
        
          </div>
          <div className='grid grid-cols-3 gap-5 justify-center flex-1'>
           {post?.file !== undefined && (post?.file as string[]).map((file, index) => (
            index === 0 ? null : (
              <div className={cn('flex gap-5 ',{
                'contrast-50': post?.isSold === true
              })} key={index}>
                <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${file}`} alt={post.title} width={100} height={100} className='w-40 h-40 rounded-md border-2 border-light dark:border-dark' loading='lazy'/>
              </div>
            )

           ))}
          </div>
        </div>
        <div className='border-l-2 dark:border-light border-dark p-2'>
           <div className='flex flex-col gap-10'> 
            <div className='flex bg-light dark:bg-dark flex-col justify-center items-center p-5 font-bold  gap-4 border-2 border-dark dark:border-light rounded-md'>
              <h1 className='text-2xl tracking-wider  px-5'>{post?.isSold !== true ? `${post?.price} ETB` : "solded"}</h1>
              <h1 className={cn("text-lg text-center bg-black text-white font-bold border-y-2 border-x-[1px] mb-2 rounded-md px-5 border-dark dark:border-light w-full", {
                "text-red-500": post?.isSold === true
              })}>{post?.isSold === true ? "its already sold please try to check another items" : "for sell" }</h1>
              {!post?.isSold && <p>contact us to get the product</p>}
            </div>
            <div className='flex dark:bg-dark bg-light flex-col border-2 border-dark dark:border-light rounded-md gap-3 p-2'>
              <div className='flex gap-2 border-b-2 border-dark dark:border-light pb-2 font-semibold'>
              <div className='flex justify-between gap-2 items-center'>
                <Image src={`${post?.author.image !== undefined ? post?.author.image  as string : ""}`} alt='user Image' width={300} height={300} className='w-8 h-8 rounded-full'/>
                <h1>{post?.author.name}({post?.postProfile.companyName})</h1>
              </div>
              </div>
              <div className='flex gap-4 items-center font-semibold'>
                <h1><Phone /></h1>
                <div className='flex flex-col gap-1'>
                <h1 className='cursor-pointer flex hover:underline group' onClick={() => post?.postProfile?.phoneNumber1 && copyToClipboard(post.postProfile.phoneNumber1)}>{post?.postProfile.phoneNumber1}<Copy className={`w-4 group-hover:stroke-slate-400 h-4 ml-2 ${isCopied ? "hidden" : ""}`}/> {isCopied && <ClipboardCheck className='w-4 h-4 ml-2'/>}</h1>
                <h1 className='cursor-pointer flex hover:underline group' onClick={() => post?.postProfile?.phoneNumber2 && copyToClipboard1(post.postProfile.phoneNumber2)}>{post?.postProfile.phoneNumber2} <Copy className={`w-4 h-4 ml-2 group-hover:stroke-slate-400 ${isCopied1 ? "hidden" : ""}`}/> {isCopied1 && <ClipboardCheck className='w-4 h-4 ml-2'/>}</h1>
                </div>
                </div>
              <div className='flex gap-2 items-center font-semibold truncate'>
                <h1>email :</h1>
                <Link className="hover:underline" target='_blank' href={`https://mail.google.com/mail/u/0/#search/${post?.author.email}`}>{post?.author.email}</Link>
                </div>
              
                <Link target='_blank' className='hover:underline flex items-center gap-4  bg-dark transition-all duration-200 hover:bg-black text-light dark:text-black hover:dark:bg-slate-300 dark:bg-light rounded-md font-semibold' href={post?.postProfile.telegram ? post?.postProfile.telegram.includes('https://t.me/') ? post?.postProfile.telegram : `https://t.me/${post?.postProfile.telegram}` : "#"}><h1><Icons.Telegram className='w-8 h-8 fill-light dark:fill-background'/> </h1>@{post?.postProfile.telegram?.includes('https://t.me/') ? post?.postProfile.telegram?.split('/').pop() : post?.postProfile?.telegram}</Link>
              
                
                <Link target='_blank' className='hover:underline flex items-center gap-4  bg-dark transition-all duration-200 hover:bg-black text-light hover:dark:bg-slate-300 dark:text-black dark:bg-light rounded-md font-semibold' href={post?.postProfile.instagram ? post?.postProfile.instagram.includes('https://www.instagram.com/') ? post?.postProfile.instagram : `https://www.instagram.com/${post?.postProfile.instagram}` : "#"}><h1><Icons.Instagram className='p-1 w-8 h-8 fill-light  dark:fill-black'/></h1>@{post?.postProfile.instagram?.includes('https://www.instagram.com/') ? post?.postProfile.instagram?.split('/').pop() : post?.postProfile?.instagram}</Link>
               
              
               
                <Link target='_blank' className='hover:underline flex items-center gap-4 transition-all duration-200 bg-dark hover:bg-black text-light dark:text-black hover:dark:bg-slate-300 dark:bg-light rounded-md font-semibold' href={post?.postProfile.facebook ? post?.postProfile.facebook.includes('https://www.facebook.com/') ? post?.postProfile.facebook : `https://www.facebook.com/${post?.postProfile.facebook}` : "#"}> <h1><Icons.FaceBook className='w-8 h-8 fill-light dark:fill-black'/> </h1> @{post?.postProfile.facebook?.includes('https://www.facebook.com/') ? post?.postProfile.facebook?.split('/').pop() : post?.postProfile?.facebook}</Link>
           
              
               
                <Link target='_blank'className='hover:underline flex items-center gap-4 bg-dark transition-all duration-200 hover:bg-black text-light dark:text-black dark:bg-light hover:dark:bg-slate-300 rounded-md font-semibold' href={post?.postProfile.x ? post.postProfile?.x?.includes('https://x.com/') ? post.postProfile?.x : `https://x.com/${post.postProfile?.x}` : "#"}> <h1><Icons.Tweeter className='w-8 h-8 fill-light dark:fill-black'/></h1>@{post?.postProfile.x?.includes('https://x.com/') ? post?.postProfile.x?.split('/').pop() : post?.postProfile?.x}</Link>
                
              </div>
            <div className='flex flex-col dark:bg-dark bg-light gap-2 border-2 border-dark dark:border-light rounded-md p-2'>
              <h1 className='text-black dark:text-light font-semibold  underline'>description</h1>
              <p className='text-black dark:text-light'>catagory: {post?.catagory}</p>
              <p className='text-black dark:text-light'>Item: {post?.title}</p>
              <p className='text-black dark:text-light'>details: {post?.description}</p>
              <p className='text-black dark:text-light'>days: before {post?.createdAt ? extractTimeAndDate(post.createdAt).diffInDays : 'N/A'} days</p>

            </div>
           </div>
        </div>
      </div>
    </MaxWidthWrapper>

    <div className='flex flex-col gap-10 items-center justify-center mt-10'>
        {resultCount >= 1 &&  (<h1 className='text-4xl flex gap-2 tracking-wide font-bold'>
          SIMILAR {resultCount === 1 ? "ITEM" : "ITEMS"} <ShoppingCart className='w-10 h-10'/ >
        </h1>)}
        <div className={cn('grid bg-zinc-200 rounded-lg dark:bg-zinc-800 p-10 items-center justify-center gap-10 gap-y-20  max-md:gap-5 grid-flow-row grid-cols-4 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 max-md:gap-y-20',{
          "hidden": resultCount === 0 || posts === undefined
        })}>
        {Result !== undefined && Result.map((p) => (
          <div className='border-2 border-dark dark:border-light rounded-md hover:shadow-lg hover:shadow-black dark:hover:shadow-zinc-400 transition-shadow duration-100' key={p.id}>
        <Link href={`/product/${p.id}`} key={p.id} className=' flex-col w-[256px] gap-4 overflow-hidden rounded-md '>
            <div>
                <div className={cn("",{
                "contrast-50": p.isSold === true,

                })}>
                    <Image src={p.file !== undefined ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${(p.file as string)[0]}`:''} alt="company Image" width={256} height={208} className="w-64 h-52 rounded-t-md"/>
                </div>
            </div>
            <div className='flex text-sm font-mono border-t-2 border-light dark:border-dark justify-between gap-2 px-2 bg-dark text-light dark:bg-light dark:text-dark font-semibold '>
            <div className='flex flex-col gap-[2px] mt-[2px]'>
                <h1>{p.title}</h1>
                <h1>{p.catagory}</h1>
            </div>
            <div className='flex flex-col justify-between'>
                <h1 className={cn("mt-1",{
                    "text-red-500 font-bold": p.isSold
                })}>{p.isSold ? "solded" : "for sell"}</h1>
                <h1>{p.price}</h1>
            </div>
            </div>
        </Link>
        </div>
    ))}
    </div>
    <div className='mt-10' hidden={((totalPages === 1) || (totalPages === 0) ? true : false) || posts === undefined}>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => {
            const pages = new URL(window.location.href)
            pages.searchParams.set('page', page.toString())
            router.push(pages.toString())
        }}/>
        </div>
    </div>
    </div>
  )
}

export default Product
