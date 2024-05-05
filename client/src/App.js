import './App.css';
import { Link } from "react-router-dom"
import { createBrowserRouter, RouterProvider,} from "react-router-dom";
import RootLayout from './components/rootLayout/RootLayout';
import LoginForm from './components/login/LoginForm';
import RegisterFrom from './components/register/RegisterForm';

function App() {
  const RouterObj=createBrowserRouter([
    {
      path:'/',
      element:<RootLayout />,
      children:
      [
        {
          path:'/register',
          element: <RegisterFrom />
        },
        {
          path:'/login',
          element: <LoginForm />
        },
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
