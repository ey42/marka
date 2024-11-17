import {createAuthClient} from "better-auth/react"

export const Authclient = createAuthClient({
    baseURL: "http://localhost:3000"
})

export const {signIn,signOut,} = Authclient

export const signOUT = async() => {
    await signOut()
    console.log("logout")
    }
    
    export const signIN = async() => {
        try {
              await signIn.social({
            provider: "google",
            callbackURL: "/"
        })    
        console.log("sign in by google")
        } catch (error) {
            console.log(`sign-in error: ${error}`)
        }finally{
        console.log("finally");
        
        }
      
        }