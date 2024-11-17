import { createSupabaseClient } from "../client";
import * as uuid from "uuid"
import { db } from '@/drizzle'
import * as schema from "@/drizzle/db/schema"



export type UploadProps = {
    file: File | undefined,
    bucket: string;
    folder?: string,
    catagoryName: string[],
    catagory: string,
    
  }

export function getStorage(){
    const {storage} = createSupabaseClient()
    return storage
  }

export async function uploadImagetoCatagoryStorage({file, bucket, folder, catagoryName, catagory}: UploadProps){
try {
  if(file?.type !== "image/jpeg"){
    return undefined 
  }
  const indexCatagory = catagoryName.indexOf(catagory)
  if(indexCatagory !== -1){
    console.log(`there is catagory by this ${catagory} name`)
  }else{
    if(catagory === undefined || catagory === ""){
      console.log("image upload failed caused by non catagory selection")
    }
    console.log(file)
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf(".")+1)
    const path = `${folder ? folder + "/": ""}${catagory}.${fileExtension}`
  
    const storage = getStorage()
  
  const {data} = await storage.from(bucket).upload(path, file)
  const imageUrl = `/storage/v1/object/public/${bucket}/${data?.path}`
  return imageUrl
  }
} catch (error) {
   return `error image uploading ${error}`
}
 
  
  }
export async function uploadImagetoPostStorage({file, bucket, folder, title, catagory}: { 
  file: File | undefined,
  bucket: string;
  folder?: string,
  title: string,
  catagory: string,
}){
try {
   if(file?.type === "image/jpeg"){
    console.log(file.type)
    if(catagory === undefined || catagory === ""){
      console.log("error uploading image to storage due to catagory === undefined or empty string")
      return
    }else{
    const UUID:string = uuid.v4();
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf(".")+1)
    const path = `${folder ? folder + "/": ""}${UUID + title}.${fileExtension}`
  
    const storage = getStorage()
  
  const {data} = await storage.from(bucket).upload(path, file)
  const imageUrl = `/storage/v1/object/public/${bucket}/${data?.path}`

  return imageUrl
    }
   } else{
    console.log("image type is not .jpeg")
    return 
   }
} catch (error) {
   return `error image uploading ${error}`
}
 
  
  }

  export async function uploadProfileImage({file, bucket, folder, company, update, userId, profile} : { 
    file: File | undefined,
    bucket: string;
    folder?: string,
    company: string,
    update: boolean,
    userId: string,
    profile: string
  }){
    try {
      
      if(file?.type === "image/jpeg" && update === false ){
        
        console.log(file.type)
       if((company === undefined || company === "") && update === false){
         console.log("error uploading image to storage due to company === undefined or empty string")
         return
       }else{
     
      if(update === false && profile){
        console.log("error you submit with out click update")
        return 
      } else{
       
       const UUID:string = uuid.v4();
       const fileName = file.name;
       const fileExtension = fileName.slice(fileName.lastIndexOf(".")+1)
       const path = `${folder ? folder + "/": ""}${UUID + company}.${fileExtension}`
     
       const storage = getStorage()
     
       const {data} = await storage.from(bucket).upload(path, file)
       const imageUrl = `/storage/v1/object/public/${bucket}/${data?.path}`
       return imageUrl
      }
       }
      
       
      } else if(file?.type === "image/jpeg" && update === true){
          const deletedFileName = profile.split('/').pop() as string
          console.log(deletedFileName)
          const storage = getStorage()
          await storage.from(bucket).remove([`${folder}/${deletedFileName}`])
          console.log("successfully deleted this file " + deletedFileName)
          const UUID:string = uuid.v4();
          const fileName = file.name;
          const fileExtension = fileName.slice(fileName.lastIndexOf(".")+1)
          const path = `${folder ? folder + "/": ""}${UUID + company}.${fileExtension}`
          const {data} = await storage.from(bucket).upload(path, file)
          const imageUrl = `/storage/v1/object/public/${bucket}/${data?.path}`
          console.log("file doesn't have type but update true")
          return imageUrl
              
      } else if(file?.type !== "image/jpeg" && update === true){
        return undefined
      } else{
        console.log("image type is not .jpeg or .jpg or .png")
        return 
      }
   } catch (error) {
      return `error image uploading ${error}`
   }
  }
 

 