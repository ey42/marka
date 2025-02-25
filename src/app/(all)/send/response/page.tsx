import AdminResponse from '@/Component/AdminResponse'
import React from 'react'

interface PageProps {
    params: {
      responseId: string
    }
  }
const page = ({params}:PageProps) => {
    const responseId = params.responseId  === undefined ? '' : params.responseId
  return (
    <div>
      <AdminResponse/>
    </div>
  )
}

export default page
