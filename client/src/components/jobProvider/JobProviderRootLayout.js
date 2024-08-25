import React from 'react'
import { Outlet } from 'react-router-dom'
import UserLoginContextStore from './JobProviderloginContext/UserloginContextstore'
import Footer from '../Footer';
function JobProviderRootLayout() {
  return (
    <div>
      <UserLoginContextStore>
        <Outlet />
        <Footer style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </UserLoginContextStore>
    </div>
  )
}

export default JobProviderRootLayout