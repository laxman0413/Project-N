import React,{useState} from "react"
import axios from "axios";
import { Logincontex } from "../JobProviderloginContext/Logincontext";

const UserLoginContextStore = ({children}) => {

    let [currentuser,setcurrentuser]=useState({})
    let [error,setError]=useState("")
    let [userloginStatus,setuserLoginStatus]=useState(false)

    const LoginUser=(userObj)=>{
      axios
      .post("https://nagaconnect-iitbilai.onrender.com/jobProvider/login",userObj)
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
