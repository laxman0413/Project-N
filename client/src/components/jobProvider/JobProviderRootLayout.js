import React from 'react'
import { Outlet } from 'react-router-dom'
import UserLoginContextStore from './JobProviderloginContext/UserloginContextstore'

function JobProviderRootLayout() {
  return (
    <div>
      <UserLoginContextStore>
        <Outlet />
      </UserLoginContextStore>
    </div>
  )
}

export default JobProviderRootLayout