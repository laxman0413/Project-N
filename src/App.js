import Admin from './components/Admin';
import './App.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import JobProvider from './components/JobProvider';
import JobSeeker from './components/JobSeeker.js';
import Home from './components/Home';
import RootLayout from './RootLayout';
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
