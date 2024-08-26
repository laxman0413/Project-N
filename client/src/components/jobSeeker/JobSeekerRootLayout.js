import React from 'react';
import { Outlet } from 'react-router-dom';
import UserLoginContextStore from './JobseekerloginContext/UserloginContextstore';
import Footer from '../Footer';

function JobSeekerRootLayout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <UserLoginContextStore>
        <Outlet />
        <Footer style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </UserLoginContextStore>
    </div>
  );
}

export default JobSeekerRootLayout;