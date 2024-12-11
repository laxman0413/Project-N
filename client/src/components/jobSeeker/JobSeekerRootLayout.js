import React from 'react';
import { Outlet } from 'react-router-dom';
import UserLoginContextStore from './JobseekerloginContext/UserloginContextstore';
import Footer from '../Footer';

function JobSeekerRootLayout() {
  return (
    <div>
      <UserLoginContextStore>
        <Outlet />
      </UserLoginContextStore>
    </div>
  );
}

export default JobSeekerRootLayout;