"use client"


import { ChangeEvent } from "react"

export const Images = (file: Blob, e: ChangeEvent<HTMLInputElement>) : Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
    if((file instanceof Blob)){
        
        console.log(`this file is blob type in Image.ts: ${file}`)
      const reader = new FileReader()
        reader.readAsDataURL(file)
       console.log(reader)
        reader.onload = () => {
          console.log("type of reader.result image.ts "+typeof reader.result )
          const result = reader.result 
          const resulttoString = result?.toString()!
            const image = document.createElement("img")
            image.src = resulttoString
            image.onload = () => {
          const canvas = document.createElement("canvas")
          if(image.width >= image.height){
            const Width: number = 800;
            const ratio = Width / image.width
            canvas.width = Width
            canvas.height = image.height * ratio
            const context = canvas.getContext("2d")
            console.log(`img w: ${image.width} h: ${image.height} w > h`)
            context?.drawImage(image, 0, 0, canvas.width, canvas.height)
            const new_image_url: string | undefined = context?.canvas.toDataURL("image/jpeg", 90)
            console.log( new_image_url)
            console.log(`w: ${canvas.width} h: ${canvas.height}`)
            e.preventDefault()
            if(typeof new_image_url === undefined ){
                reject(new Error("image type undefined"))
            } else{
            resolve( new_image_url) 
        }
          }
          else{
            const Height = 800;
            const ratio = Height / image.height
            canvas.height = Height;
            canvas.width = image.width * ratio
            const context = canvas.getContext("2d")
            console.log(`img w: ${image.width} h: ${image.height}  h > w`)
            context?.drawImage(image, 0, 0, canvas.width, canvas.height)
            const new_image_url : string | undefined = context?.canvas.toDataURL("image/jpeg", 90)
            
            console.log( new_image_url)
            console.log(`w: ${canvas.width} h: ${canvas.height}`)
            e.preventDefault()
            if(typeof new_image_url === undefined ){
                reject(new Error("image type undefined"))
            } else{
                resolve( new_image_url) 
        }
          }
          
        } 
        }}
         else {
          reject(new Error("Invalid file type")) 
        }
    
    })
}
