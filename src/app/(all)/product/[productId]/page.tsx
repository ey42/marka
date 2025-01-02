import Product from '@/Component/Post/Product'
import React from 'react'

interface PageProps{
    params: {
        productId: string
    }
}
const page = async({params}: PageProps) => {
  return (
    <div>
       <Product id={params.productId}/>
    </div>
  )
}

export default page