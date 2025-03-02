"use client"
import React, { useState } from 'react'
import { Icons } from './Icons'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { Eyueal } from './Database'

const Footer = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isCopied1, setIsCopied1] = useState<boolean>(false)
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
    <div className='flex h-full justify-end bottom-0 w-full'>
    <div className='border-t-dark bg-dark dark:bg-light dark:border-t-light overflow-hidden border-t-4 flex flex-col justify-center items-center gap-20 w-full bottom-0  dark:text-dark text-light'>
      <h1 className='footer-h1 mt-5 font-bold font-serif text-9xl'><span className='text-blue-500'>M</span>ar<span className='text-yellow-500'>k</span>a<span className='text-red-500'>.</span>c<span className='text-green-500'>o</span>m</h1>
        <div className='flex justify-center items-center w-full'>
            <div className='fot flex flex-row max-md:grid max-md:grid-cols-2  max-md:gap-30 max-sm:grid-cols-1 justify-evenly gap-10 w-full'>
              <div className='flex flex-col gap-4 max-md:border-b-2 max-md:border-light pb-4 dark:max-md:border-dark items-center'>
                <div className='font-bold'>ABOUT US</div>
                <p className='w-52 text-sm font-semibold'>OUR platform is free and easy to use and also its very easy to get product from the sellers with their social media account or with their contact, thank you for choosing us.</p>
              </div>
              <div className='flex flex-col gap-4 max-md:border-b-2 max-md:border-light pb-4 dark:max-md:border-dark items-center'>
                <div>
                <h1 className='font-bold'>SUPPORT US</h1>
                </div>
                <div>
                <div className='flex gap-4'> <h1 className='font-bold'>CBE</h1> <h1>1000577906975</h1></div>
                <div className='flex gap-4'> <h1 className='font-bold'>Bank of abyssinia</h1> <h1>114036455</h1> </div>
                <div className='flex gap-4'> <h1 className='font-bold'>Awash </h1> <h1>01320219837300</h1></div>
                </div>
                
              </div>
              <div className='flex flex-col gap-4 max-md:border-b-2 max-md:border-light pb-4 dark:max-md:border-dark items-center'>
              <h1 className='font-bold'>CONTACT US</h1>
              <div className='flex flex-col gap-2'>
                <div className="flex flex-row gap-2">
                <Phone className='w-7 h-7 pb-1'/>
                <h1 className='font-bold'>0967283176</h1>
                </div>
                <div className="flex flex-row gap-2">
                <Phone className='w-7 h-7 pb-1'/>
                <h1 className='font-bold'>0945547043</h1>
                </div>
                <div className="flex flex-row gap-2">
                <Mail className='w-7 h-7 pb-1'/>
                <h1 className='font-bold'>{Eyueal}</h1>
                </div>
                <div className="flex flex-row gap-2">
                <MapPin className='w-7 h-7 pb-1'/>
                <h1 className='font-bold'>Ethiopia.Addis Ababa</h1>
                </div>
              </div>
              </div>
              <div className='flex max-md:border-b-2 max-md:border-light pb-4 dark:max-md:border-dark flex-col items-center gap-4'>
                <h1 className='font-bold'>FOLLOW US</h1>
                <div className='grid grid-cols-3 gap-2'>
                <Link target='_blank' href='https://www.facebook.com/eyuealll'><Icons.FaceBook className='fill-light dark:fill-black w-10 h-10'/></Link>
                <Link href='https://www.instagram.com/eyuealll' target='_blank'><Icons.Instagram className='fill-light dark:fill-black w-8 h-10'/></Link>
                <Link target='_blank' href='https://t.me/eyuealll'><Icons.Telegram className='fill-light dark:fill-black w-8 h-10'/></Link>
                <Link href='https://x.com/eyuealll' target='_blank'><Icons.Tweeter className='w-10 h-10 fill-light dark:fill-black'/></Link>
              </div>
              </div>
            </div>
        </div>
        <div className='w-full border-t-4 border-light dark:border-dark flex items-center justify-center h-16 bottom-0 bg-dark dark:bg-light text-clip'>
        <h1 className='text-light dark:text-black font-bold text-center'>&copy; 2025 marka.com</h1>
        </div>   
    </div>
    </div>
  )
}

export default Footer