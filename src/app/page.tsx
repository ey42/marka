import Landing from "@/Component/Landing";
import { db } from '@/drizzle'
import * as schema from "@/drizzle/db/schema"

export default async function Home() {
 const AllCatagory:Catagoryprops[] =  await db.select().from(schema.catagories)
  return (
    <div className= " dark:bg-dark bg-slate-300 dark:text-slate-300 text-dark mt-4 flex flex-wrap justify-evenly items-start w-screen">
     <Landing AllCatagory={AllCatagory}/>
    </div>
  );
}
 