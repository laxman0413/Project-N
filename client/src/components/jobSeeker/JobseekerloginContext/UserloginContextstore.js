import React,{useState} from "react"
import { Logincontex } from "./Logincontext";
import axios from "axios";

const UserLoginContextStore = ({children}) => {

    let [currentuser,setcurrentuser]=useState({})
    let [error,setError]=useState("")
    let [userloginStatus,setuserLoginStatus]=useState(false)

    const LoginUser=(userObj)=>{
      axios
      .post("http://localhost:3001/jobseeker/login",userObj)
      .then((response)=>{
        if(response.status===200){
          setcurrentuser({...response.data.payload});
          setuserLoginStatus(true)
          localStorage.setItem("token",response.data.token)
        }else{
          setError(response.data.message)
        }
      })
      .catch((error)=>{
        setError(error.message)
      })
    };
    const LogoutUser=()=>{
      
      localStorage.clear();

      setuserLoginStatus(false);
    }
  return (
    <div>
        <Logincontex.Provider value={[currentuser,error,userloginStatus,LoginUser,LogoutUser]}>
            {children}
        </Logincontex.Provider>
    </div>
  )
};

export default UserLoginContextStore;
