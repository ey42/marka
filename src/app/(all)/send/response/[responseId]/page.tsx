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
      hy {responseId}
    </div>
  )
}

export default page
