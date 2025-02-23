import ProfileUpload from '@/Component/user/ProfileUpload'
import React from 'react'

interface PageProps {
    params: {
      requestId: string
    }
  }
const page = ({params}:PageProps) => {
    const requestId = params.requestId  === undefined ? '' : params.requestId
  return (
    <div>
      <ProfileUpload/>
    </div>
  )
}

export default page
