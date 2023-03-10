import React ,{ useEffect, useState } from "react";
import AppRouter from "./Router";
import {authService} from "../fBase";
import { onAuthStateChanged } from "firebase/auth";


function App() {
  const[init, setInit] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState("")
  useEffect(()=>{
    onAuthStateChanged(authService,(user)=>{
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[]);
  return (
    <>
      {init?<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />:"Initializing..."}
    </>
  );
}

export default App;
