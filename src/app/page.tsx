import Landing from '@/Component/catagory/Landing';
import { db } from '@/drizzle'
import * as schema from "@/drizzle/db/schema"

export default async function Home() {
 const AllCatagory:Catagoryprops[] =  await db.select().from(schema.catagories)
  return (
    <div className= "dark:text-light text-dark mt-4 h-full flex gap-2 flex-wrap justify-evenly items-start w-full">
     <Landing AllCatagory={AllCatagory}/>
    </div>
  );
}
 