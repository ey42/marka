import { user } from './../../../auth-schema';
import { post, profile } from './../../drizzle/db/schema';
import { publicProcedure, router } from "../trpc";
import { db } from '@/drizzle'
import * as schema from "@/drizzle/db/schema"
import { z } from "zod";
import * as uuid from 'uuid';
import { TRPCError } from "@trpc/server";
import EventEmitter, { on } from "events";
import { asc, desc, eq } from "drizzle-orm";
import { getStorage } from "@/supabase/storage/Storages";
import { FunctionDate } from '@/Component/Database';
import { sql } from 'drizzle-orm';


// const ee = new EventEmitter();
const postSchema : z.ZodType<postProps[]>  = z.array(z.object({
    title: z.string(),
    description: z.string().nullable(),
    catagory: z.string(),
    userId: z.string(),
    id: z.string(),
    file: z.array(z.string()),
    profileId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    isSold: z.boolean().nullable(),
    soldDate: z.string(),
    price: z.string()
}))

export const DatabaseRouter = router({
    uploadCatagories: publicProcedure.input(z.object({
        Imagefile: z.string(),
        categories: z.string(),
        description: z.string(),
        userId: z.string()
    })).mutation(async({input}) => {
        
        const {Imagefile,categories,description, userId} = input;
        const AllCatagory:Catagoryprops[] =  await db.select().from(schema.catagories)
        const catagoryName:string[] = AllCatagory.map((name) => name.categories)
        const indexCatagory = catagoryName.indexOf(categories!);
        const users = await db.select().from(schema.user)
        const user = users.find((user) => user.id === userId)
        try {
       if(user?.email === "eyuealzerihun1@gmail.com" && user.role === "merchant" && userId === user.id){
        if(indexCatagory !== -1){
            const deletedFileName = Imagefile.split('/').pop() as string
            console.log(deletedFileName + " delete file name from database b/c there is catagory by this name")
            const storage = getStorage()
            await storage.from("Images").remove([`catagoryImage/${deletedFileName}`])
            console.log("successfully deleted this file from database " + deletedFileName)
          throw new TRPCError({
            code:"CONFLICT",
            message:"there is a catagory name like you type, try another"})
        }else{
           const fileName = Imagefile.split('/').pop()
           console.log("outside " + fileName)
           if(fileName !== undefined && fileName.includes('.jpeg')){
            console.log("inside " + fileName)
           const UUID:string = uuid.v4();
           const now = new Date();
           await db.insert(schema.catagories).values({categories: categories.replace(/ /g, '_') ,id: UUID ,Imagefile: Imagefile, description: description, createdAt: now})
           return {success: true} 
           } else{
            throw new Error("error because image is undefined")
           }
        }} else{
            const deletedFileName = Imagefile.split('/').pop() as string
            console.log(deletedFileName + " delete file name from database b/c you are not the owner ")
            const storage = getStorage()
            await storage.from("Images").remove([`catagoryImage/${deletedFileName}`])
            console.log("successfully deleted this file from database " + deletedFileName)
            throw new TRPCError({
                code:"UNAUTHORIZED",
                message: "you are not the person to upload a catagory"
            });
        }
    } catch (err) {
        const deletedFileName = Imagefile.split('/').pop() as string
        console.log(deletedFileName + " delete file name from database b/c catch")
        const storage = getStorage()
        await storage.from("Images").remove([`catagoryImage/${deletedFileName}`])
        console.log("successfully deleted this file from database " + deletedFileName)
        throw new TRPCError({
            code:"GATEWAY_TIMEOUT",
            message: `error on server: ${err}`
        })
    }
      
    }),
    uploadPost: publicProcedure.input(z.object({
        imagefile: z.array(z.string()),
        title: z.string(),
        description: z.string(),
        catagory: z.string(),
        userID: z.string(),
        prices: z.string(),
        city: z.string(),
   })).mutation(async({input}) => {
    const {imagefile,title,catagory,description,userID, prices,city} = input;
    const profiles: profileProp[] = await db.query.profile.findMany({
        where: (profile, {eq}) => eq(profile.userId, userID)
    })
    const profile = profiles.find((profile) => profile.userId === userID ) as profileProp
    const users = await db.select().from(schema.user)
    const user = users.find((user) => user.id === userID)
    console.log("starting uploading to post table...")

    try {
    if(user?.role === "merchant" && (catagory !== undefined || catagory !== null || catagory !== "" || city !== null || city !== "")  && profile){
        console.log("the user is verified merchant and all data are right")
           const UUID:string = uuid.v4();
           const now = new Date();
           await db.insert(schema.post).values({city: city, userId: userID ,profileId: profile.id ,title: title ,catagory: catagory.replace(/ /g, '_') ,id: UUID ,file: imagefile, description: description, createdAt: now, price: prices as string})
              return {success: true}
        }else{
            const deletedFileName = imagefile.map(file => file.split('/').pop() as string)
            console.log(deletedFileName + " delete file name from database")
            const storage = getStorage()
            for(const file of deletedFileName){
                await storage.from("Images").remove([`postImage/${file}`])
                console.log("unauthorized or undefined form successfully deleted this file from database " + file)
            }
            throw new TRPCError({
                code:"UNAUTHORIZED",
                message:"you are not authorized for posting"})
        }
            
    } catch (error) {
        const deletedFileName = imagefile.map(file => file.split('/').pop() as string)
            console.log(deletedFileName + " delete file name from database")
            const storage = getStorage()
            for(const file of deletedFileName){
                await storage.from("Images").remove([`postImage/${file}`])
                console.log("unauthorized or undefined form successfully deleted this file from database " + file)
            }
        throw new TRPCError({
            code:"UNAUTHORIZED",
            message:`server error uploading post: ${error}`})
    }
   }),
   getPosts: publicProcedure.input(z.object({
    id: z.string(),
    catagory: z.string().optional(),

})).query(async({input}) => {
   const {id,} = input;
   try {
    const postCount = await db.select({ count: sql`COUNT(*)` }).from(schema.post).where(eq(schema.post.userId, id))
    const posts = await db.query.post.findMany({
        where: (post, {eq}) => eq(post.userId, id),
       with:{
        author : true, 
        likeAndDislikePost: true,
        postCatagory :true,
        postProfile: true,
        postSeen: true
       },
       orderBy: (post) => desc(post.createdAt)
    }) 
        const postCatagory: string[] = posts.map((c) => c.catagory)
        return {posts, postCatagory,postCount}
    
 
    
} catch (error) {
    throw new TRPCError({code:"INTERNAL_SERVER_ERROR", message:'error getting post'})
}
   }),
   getAllPosts: publicProcedure.query(async() => {
    try{
    const postCount = await db.select({ count: sql`COUNT(*)` }).from(schema.post)
    const allPosts = await db.query.post.findMany({
       with:{
        author : true, 
        likeAndDislikePost: true,
        postCatagory :true,
        postProfile: true,
        postSeen: true
       },
       orderBy: (post) => desc(post.createdAt)
    }) 
        return {allPosts, postCount}
} catch(error){
    throw new TRPCError({code: "NOT_FOUND", message: "error getting all posts" })
}
   }),
    getCatagoriesName: publicProcedure.query(async function ()  {
        
        const AllCatagory:Catagoryprops[] =  await db.select().from(schema.catagories).orderBy(asc(schema.catagories.categories))
        const catagoryName:string[] = AllCatagory.map((name) => name.categories)
        return catagoryName as string[]
    }),
    getUsers: publicProcedure.input(z.object({id: z.string()})).query(async({input}) => {
        const id = input.id
        const user:userProps[] = await db.select().from(schema.user) as userProps[]
        const session:sessionProps[] = await db.select().from(schema.session)
       
        if(user && session){
            const activeUser = user.find((u) => u.id === id ) as userProps
             const activeSessions = session.find((s) => s.userId === id) as sessionProps
            return {activeUser: activeUser as userProps ,activeSessions: activeSessions as sessionProps ,user: user as userProps[]} 
        } else{
            console.log("user undefined in the trpc")
            return 
        }
        
        
    }),
    uploadProfile: publicProcedure.input(z.object({
        types: z.string(),
        instagrams: z.string(),
        telegrams: z.string(),
        facebooks: z.string(),
        xs: z.string(),
        descriptions: z.string(),
        imageFiles: z.union([
            z.undefined(),
            z.string(),
          ]) ,
        companyNames: z.string(),
        phoneNumber1s: z.string(),
        phoneNumber2s: z.string(),
        update: z.boolean(),
        userIds: z.string()
    })).mutation(async({input}) => {
        const {imageFiles,companyNames,descriptions,facebooks,instagrams,phoneNumber1s,phoneNumber2s,telegrams,types,xs,update,userIds} = input
        const users = await db.select().from(schema.user)
        const user = users.find((user) => user.id === userIds)
        const profiles = await db.select().from(schema.profile) as profileProp[]
        const profile = profiles.find((profile) => profile.userId === userIds ) as profileProp
        const storage = getStorage()
        try {
            
        if(userIds === user?.id){
          
            if((companyNames === "" || companyNames === undefined || imageFiles === "" || imageFiles === undefined) && update === false) {
                const deletedFileName = imageFiles?.split('/').pop() as string
                console.log(deletedFileName + " delete file name from database")
                await storage.from("Images").remove([`profileImage/${deletedFileName}`])
                console.log("successfully deleted this file from database " + deletedFileName)
                throw new TRPCError({code:"NOT_FOUND", message:"company name is must to save your profile in creating mode "})
            }

        if (update === true && profile) {
               const {companyName,description,facebook,imageFile,instagram,phoneNumber1,phoneNumber2,telegram,type,userId,x,} = profile
               const setCompany = companyNames ? companyNames : companyName;
               const setdescription = descriptions ? descriptions : description;
               const setFacebook = facebooks ? facebooks : facebook;
               const setImageFile = imageFiles && await storage.from("Images").remove([`profileImage/${userIds}`])  ? imageFiles: imageFile;
               const setInstagram = instagrams ? instagrams : instagram;
               const setPhoneNumber1 = phoneNumber1s ? phoneNumber1s : phoneNumber1;
               const setPhoneNumber2 = phoneNumber2s ? phoneNumber2s : phoneNumber2;
               const setTelegram = telegrams ? telegrams : telegram;
               const setType = types ? types : type;
               const setX = xs ? xs : x;
               const setUserId = userIds ? userIds : userId
               const now = new Date();
            await db.update(schema.profile)
            .set({
             companyName: setCompany,
             description: setdescription,
             facebook: setFacebook,
             imageFile: setImageFile as string,
             instagram: setInstagram,
             phoneNumber1: setPhoneNumber1,
             phoneNumber2: setPhoneNumber2,
             telegram: setTelegram,
             type: setType,
             updatedAt: now,
             x: setX,
             userId: setUserId
            })
            .where(eq(schema.profile.userId, userIds));
            return{success : true , message: "succussfully updating your profile "}
        }
        else if(update === false && profile){
            const deletedFileName = imageFiles?.split('/').pop() as string
            console.log(deletedFileName + " delete file name from database")
            const storage = getStorage()
            await storage.from("Images").remove([`profileImage/${deletedFileName}`])
            console.log("successfully deleted this file from database " + deletedFileName)
            return {success: false , message: "you already have a profile if you want update please select update to TRUE"}
        } else if(update === false && !profile) {
            const now = new Date();
            const UUID:string = uuid.v4();
            await db.insert(schema.profile).values({ companyName: companyNames,
                description: descriptions,
                facebook: facebooks,
                imageFile: imageFiles as string,
                instagram: instagrams,
                phoneNumber1: phoneNumber1s,
                phoneNumber2: phoneNumber2s,
                telegram: telegrams,
                type: types,
                createdAt: now,
                x: xs,
                userId: userIds,
                id: UUID,        
            })
           await db.update(schema.user).set({role: "merchant"}).where(eq(schema.user.id, userIds))
            return{success : true , message: "succussfully inserting your profile"}
        } else{
            const deletedFileName = imageFiles?.split('/').pop() as string
            console.log(deletedFileName + " delete file name from database")
            const storage = getStorage()
            await storage.from("Images").remove([`profileImage/${deletedFileName}`])
            console.log("successfully deleted this file from database " + deletedFileName)
        }
    } else {
        // if((profile?.imageFile !== null || profile?.imageFile !== undefined || profile?.imageFile !== '' )  && !profile.imageFile?.includes(`${imageFiles}`)){
            const deletedFileName = imageFiles?.split('/').pop() as string
            console.log(deletedFileName + " delete file name from database")
            const storage = getStorage()
            await storage.from("Images").remove([`profileImage/${deletedFileName}`])
            console.log("successfully deleted this file from database " + deletedFileName)
        // }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "unauthorized to update a file"
        })   
    }
} catch (error) {
    const deletedFileName = imageFiles?.split('/').pop() as string
    console.log(deletedFileName + " delete file name from database")
    const storage = getStorage()
    await storage.from("Images").remove([`profileImage/${deletedFileName}`])
    console.log("successfully deleted this file from database " + deletedFileName)         
}
    }),
    getProfile: publicProcedure.input(z.object({
        id: z.string(),
    })).query(async({input}) => {
        const {id} = input
        const users: userProps[] = await db.query.user.findMany({
            where: (user, {eq}) => eq(user.id, id),
            with:{
                userContent: true
            }
        }) as userProps[]
        const user = users.find((user) => user.id === id)
        if(id === user?.id && user.role === "merchant"){
            return {user}
        } else{
throw new TRPCError({
    code:"UNAUTHORIZED",
    message: "unauthorized usage"
})
        }
       
        
    }),
    updatePost: publicProcedure.input(z.object({
        postId: z.string(),
        Sold: z.boolean(),
        Description: z.string(),
        imageFile: z.union([
            z.undefined(),
            z.string()
        ]),
        Title: z.string(),
        Catagory: z.string(),
        update: z.boolean(),
        userIds: z.string()

    })).mutation(async({input}) => {
    const {Catagory,Description,Title,Sold,postId,imageFile,update,userIds}  = input;
    const posts = await db.query.post.findFirst({
        where: (post, {eq}) => eq(post.id, postId),
       with:{
        author: true, 
        likeAndDislikePost: true,
        postCatagory :true,
        postProfile: true,
        postSeen: true
       }
    }) as postProps

    const {catagory,description,file,isSold,title} = posts
    try {
        
            const now = new Date();
            await db.update(schema.post)
            .set({
            catagory: Catagory ? Catagory : catagory,
            description: Description ? Description : description,
            file: imageFile ? imageFile : file,
            title: Title ? Title : title,
            updatedAt: now,
            isSold: Sold ? Sold : isSold
            })
            .where(eq(schema.post.userId, userIds));
            return{success : true , message: "succussfully updating your post "}
       
    } catch (error) {
        throw new TRPCError({code: "NOT_FOUND", message: "error updating post" })
    }
    }),
    soldPost: publicProcedure.input(z.object({
        Sold: z.boolean(),
        id: z.string()
})).mutation( async({input}) => {
    const {id, Sold} = input
    const posts = await db.query.post.findMany({
        where: (post, {eq}) => eq(post.userId, id),
       with:{
        author : true, 
        likeAndDislikePost: true,
        postCatagory :true,
        postProfile: true,
        postSeen: true
       },
    }) as postProps[]
    const now = new Date()
    const date = now.getTime()
    
    try {
        console.log("starting...")
        if(Sold === true){
        console.log("sold true")
        console.log(`will delete after 7 days`)
        await db.update(schema.post)
        .set({
        isSold: Sold,
        soldDate: date.toString()
        }).where(eq(schema.post.id, id));
    }else{
        console.log("sold false isSold date string")
        await db.update(schema.post).set({
        isSold: Sold,
        soldDate: null
        }).where(eq(schema.post.id, id));
        console.log('it work')
   
    }
        return{ success : true , message: Sold === true ? "post sold successfully" : "not sold"}
    } catch (error) {
       throw new TRPCError({code: "UNPROCESSABLE_CONTENT", message:"error to sold the product"})
    }
}),
    deleteSolded: publicProcedure.query(async() => {
        const posts = await db.query.post.findMany({
           with:{
            author : true, 
            likeAndDislikePost: true,
            postCatagory :true,
            postProfile: true,
            postSeen: true
           },
        }) 
        const now:Date = new Date()
        const date = now.getTime()
        const time = FunctionDate(date)
        
        try {
             posts.map(async(p) => {
                console.log("start here bro")
                if(p.soldDate !== null && p.isSold === true ) {
                    console.log("sold-date not null")
                    console.log(`current date is : ${time.days - Number(p.soldDate)}`)
                    if(time.days - FunctionDate(Number(p.soldDate)).days >= 1){
                        const post = posts.find((po) => po.id === p.id) as postProps
                        console.log("end here bro")
                        await db.delete(schema.post).where(eq(schema.post.id, post.id))
                        console.log("deleted")

                        const deletedFileName = post.file.map(file => file.split('/').pop() as string)
                        console.log(deletedFileName + " delete file name from database")
                        const storage = getStorage()
                        for(const file of deletedFileName){
                        await storage.from("Images").remove([`postImage/${file}`])
                        
                        return {success: true , message: "successfully delete the post"}
                    }
                }

        }})
        } catch (error) {
            throw new TRPCError({code:"NOT_FOUND", message:"error deleting sold post"})
        }
       
    }),
    getProfiles: publicProcedure.query(async() => {
        try {
            const acceptedCount = await db.select({ count: sql`COUNT(*)` }).from(schema.user).where(eq(schema.user.accepted, "accept"))  
            const rejectedCount = await db.select({ count: sql`COUNT(*)` }).from(schema.user).where(eq(schema.user.accepted, "reject"))
            const profiles = await db.query.profile.findMany({
                with:{
                    userContent: true
                },
             })
            return {profiles, acceptedCount, rejectedCount}
        } catch (error) {
            throw new TRPCError({code:"NOT_FOUND", message:"error getting profiles"})
        }
      
    }),
    deletePostById: publicProcedure.input(z.object({
        postId: z.string()
    })).mutation(async({input}) => {
        const {postId} = input;
        const post = await db.query.post.findFirst({
            where: (post, {eq}) => eq(post.id, postId)
        }) as postProps

        try {
             await db.delete(schema.post).where(eq(schema.post.id, postId))
             const deletedFileName = post.file.map(file => file.split('/').pop() as string)
             console.log(deletedFileName + " delete file name from database")
             const storage = getStorage()
             for(const file of deletedFileName){
             await storage.from("Images").remove([`postImage/${file}`])
            
         }
             return{ success : true , message: "succussfully deleting your post "}
        } catch (error) {
            throw new TRPCError({code:"NOT_FOUND", message:"error deleting post"})
        }
       
    }),
    getPostWithCatagory: publicProcedure.input(z.object({
        catagory: z.string()
    })).query(async({input}) => {
        const {catagory} = input;
        try {
        const postCount = await db.select({ count: sql`COUNT(*)` }).from(schema.post).where(eq(schema.post.catagory, catagory))
        const posts = await db.query.post.findMany({
            where: (post, {eq}) => eq(post.catagory, catagory),
           with:{
            author : true, 
            likeAndDislikePost: true,
            postCatagory :true,
            postProfile: true,
            postSeen: true
           },
           orderBy: (post) => desc(post.createdAt)
        })
        return {posts, postCount}
    } catch (error) {
        throw new TRPCError({code:"NOT_FOUND", message:"error getting post with catagory"})
    }
    }),
    updateUser: publicProcedure.input(z.object({
        id: z.string(),
        value: z.string(),
        imageFiles: z.string(),
    })).mutation(async({input}) => {
        const {id, value, imageFiles} = input
        const users = await db.select().from(schema.user)
        const user = users.find((user) => user.id === id)
        try {
            if(id === user?.id && user.role === "merchant" && value === "accept"){
                console.log("accepting the user for merchant")
            await db.update(schema.user).set({accepted: "accept"}).where(eq(schema.user.id, id))
            return {success: true, message: "successfully accepted the user"}
            } else if(id === user?.id && user.role === "merchant" && value === "reject"){
                console.log("rejecting the user for merchant")
                await db.delete(schema.profile).where(eq(schema.profile.userId, id))
                await db.update(schema.user).set({accepted: "reject", role: "customer"}).where(eq(schema.user.id, id))
                const deletedFileName = imageFiles?.split('/').pop() as string
                const storage = getStorage()
                await storage.from("Images").remove([`profileImage/${deletedFileName}`])
                console.log(" delete " + deletedFileName + " file name from storage by rejecting the user")

                return {success: true, message: "successfully rejected the user"}
            } else{
                throw new TRPCError({code:"UNAUTHORIZED", message:"you are not the owner of this user"})
            }
        } catch (error) {
            throw new TRPCError({code:"NOT_FOUND", message:"error accepting the user"})
        }
        })
})