import './App.css';
import { createBrowserRouter, RouterProvider,} from "react-router-dom";
import Home from './components/Home';
import JobProviderHome from './components/jobProvider/JobProviderHome';
import JobProviderRegister from './components/jobProvider/JobProviderRegister';
import JobProviderLogin from './components/jobProvider/JobProviderLogin';
import JobSeekerDashboard from './components/jobSeeker/JobSeekerDashboard';
import JobSeekerHome from './components/jobSeeker/JobSeekerHome';
import JobSeekerRegister from './components/jobSeeker/JobSeekerRegister';
import JobSeekerLogin from './components/jobSeeker/JobSeekerLogin';
import JobProviderDashboard from './components/jobProvider/JobProviderDashboard';
import RootLayout from './components/RootLayout';
import JobProviderRootLayout from './components/jobProvider/JobProviderRootLayout';
import JobSeekerRootLayout from './components/jobSeeker/JobSeekerRootLayout';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import JobSeekerProfile from './components/jobSeeker/JobSeekerProfile';
import AppliedJobs from './components/jobSeeker/AppliedJobs';
import ListOfApplications from './components/jobProvider/ListOfApplications';
import Advertise from './components/advertisement/Advertise';
import Theme from './components/advertisement/Theme';
import ResetPassword from './components/jobSeeker/ResetPassword';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  const RouterObj=createBrowserRouter([
    {
      path:'/',
      element:<RootLayout />,
      children:[
        {
          path:"/",
          element: <Home/>
        },
        {
          path:'/job-provider',
          element:<JobProviderRootLayout />,
          children:[
            {
              path:'/job-provider',
              element:<JobProviderHome />,
            },
            {
              path:'/job-provider/register',
              element:<JobProviderRegister />
            },
            {
              path:'/job-provider/login',
              element:<JobProviderLogin />
            },
            {
              path:'/job-provider/dashboard',
              element:<JobProviderDashboard />
            },
            {
              path:'/job-provider/application/:jobId',
              element:<ListOfApplications/>
            }
          ]
        },
        {
          path:'/job-seeker',
          element:<JobSeekerRootLayout />,
          children:
          [
            {
              path:'/job-seeker',
              element:<JobSeekerHome />,
            },
            {
              path:'/job-seeker/register',
              element:<JobSeekerRegister/>
            },
            {
              path:'/job-seeker/login',
              element:<JobSeekerLogin />
            },
            {
              path:'/job-seeker/dashboad',
              element:<JobSeekerDashboard/>
            },
            {
              path:'/job-seeker/profile',
              element:<JobSeekerProfile />
            },
            {
              path:'/job-seeker/applied-jobs',
              element:<AppliedJobs />
            },
            {
              path:'/job-seeker/reset-password',
              element:<ResetPassword />
            }
          ]
        },
        {
          path:'/advertise',
          element:<ThemeProvider theme={Theme}><Advertise /></ThemeProvider>
        },
        {
          path:'/admin',
          element:<AdminLogin />
        },
        {
          path:"/admin-dashboard",
          element:<AdminDashboard />
        }
      ]
    }
  ])

  return (
    <div className="App">
      <RouterProvider router={RouterObj} />    
    </div>
  );
}

export default App;


