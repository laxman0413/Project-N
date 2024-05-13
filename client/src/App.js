import './App.css';
import { createBrowserRouter, RouterProvider,} from "react-router-dom";
import RootLayout from './components/rootLayout/RootLayout';
import LoginForm from './components/login/LoginForm';
import RegisterForm from './components/register/RegisterForm'
import JobProvider from './components/JobProvider';
import JobSeeker from './components/JobSeeker';

function App() {
  const RouterObj=createBrowserRouter([
    {
      path:'/',
      element:<RootLayout />,
    },
    {
      path:'/login',
      element:<LoginForm />,
    },
    {
      path:'/register',
      element:<RegisterForm />,
    },
    {
      path:'/jobprovider',
      element:<JobProvider />,
    },
    {
      path:'/jobseeker',
      element:<JobSeeker />,
    }
  ])

  return (
    <div className="App">
      <RouterProvider router={RouterObj} />
      
      
      
    </div>
  );
}

export default App;


