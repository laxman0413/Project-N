import React from 'react'
import { Outlet } from 'react-router-dom'

function JobProviderRootLayout() {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default JobProviderRootLayout