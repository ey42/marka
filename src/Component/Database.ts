import { db } from '@/drizzle'
import * as schema from "@/drizzle/db/schema"
import * as uuid from 'uuid';




export const catagory: string[] = ["cosmetics","bonda","kitchen equipments","furnitures","mobile and its accessories", "computer and its accessories", "car and its accessories","house", "children clothes and shoes", "others","shoes", "clothes", "musical instruments", "dikor equipment", "gifts"]

export interface Catagoryprops {
    id:string;
    categories: string;
    description: string | null;
    Imagefile: string | string[]
  }
  // export const catagories: Catagoryprops[]  = [{id , catagories  }]

//   const AllCatagory:Catagoryprops[] =  await db.select().from(schema.catagories)

 
  
export async function convertBlobUrlToFIle(url: string){

if(url === undefined || url.length === -1) return undefined
  const response = await fetch(url);
  const blob = await response.blob() as Blob;
  const fileName = Math.random().toString(36).slice(2,9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`,{type: mimeType})
  console.log(file.name)
  return file
  
}

export function extractTimeAndDate(timestamp: string): { time: string; date: string } {
  const dateObject = new Date(timestamp);

  const time = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = dateObject.toLocaleDateString();

  return { time, date };
}
  
export function formatCurrency(
  value: number,
  options: {
    locale?: string;// locale for fomatting, defaults to "en-US"
    currency?: string;
    minimumFractionDigits?: number;// min number of decimal place
    maximumFractionDigits?: number;// max number of decimal place
    style?: "currency" | "decimal"; // style of formating
    useGrouping?: boolean; // whether to use grouping (e.g., thousand separator)
  } = {}
): string {

  const {currency,locale,maximumFractionDigits,minimumFractionDigits,style,useGrouping } = options

  if (typeof value !== "number" || !isFinite(value)){
    throw new TypeError("Invalid number provided for formatting.")
  }
// define options for currency formatting
  const formatOptions: Intl.NumberFormatOptions = {
    style,
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping
  };

  try {
    return new Intl.NumberFormat(locale, formatOptions).format(value)
  } catch (error: any) {
    throw new Error(`failed to format currency: ${error.message}`)
  }
}



