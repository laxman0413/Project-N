import Admin from './components/Admin';
import './App.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import JobProvider from './components/JobProvider';
import JobSeeker from './components/JobSeekers.js';
import Home from './components/Home';
import RootLayout from './RootLayout';
import JobProvider1 from './components/JobProvider1.js';
import JobSeeker1 from './components/JobSeeker1.js';
import Admin1 from './components/Admin1.js';
const router=createBrowserRouter([
  {
    path:'/',
    element:<RootLayout />,
    children:[
      {
        index: true,
        element: <Home />,
      },
      {
        path:'/admin',
        element:<Admin />,
      },
      {
        path:'/jobseeker',
        element:<JobSeeker />,
      },
      {
        path:'/jobprovider',
        element:<JobProvider />,
      },
      {
        path:'/admin-1',
        element:<Admin1/>,
      },
      {
        path:'/jobprovider-1',
        element:<JobProvider1/>,
      },
      {
        path:'/jobseeker-1',
        element:<JobSeeker1/>,
      },

    ]
  }
])
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
