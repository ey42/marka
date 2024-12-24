import Trader from '@/Component/user/Trader'
import React from 'react'


interface PageProps {
    params: {
      traderId: string
    }
  }

const page = ({params}: PageProps) => {
    const id = params.traderId
    
  return (
    <div>
      <Trader id={id}/>
    </div>
  )
}

export default page
