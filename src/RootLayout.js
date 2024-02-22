import React from 'react'
import { Outlet } from 'react-router-dom';
import Menu from './components/Menu';
function RootLayout() {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default RootLayout