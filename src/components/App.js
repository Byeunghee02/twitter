import React ,{ useEffect, useState } from "react";
import AppRouter from "./Router";
import {authService} from "../fBase";
import { onAuthStateChanged } from "firebase/auth";


function App() {
  const[init, setInit] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(authService.currentUser);
  useEffect(()=>{
    onAuthStateChanged(authService,(user)=>{
      if(user){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[]);
  return (
    <>
      {init?<AppRouter isLoggedIn={isLoggedIn}/>:"Initializing..."}
      <footer>&copy; {new Date().getFullYear()} twitter </footer>
    </>
  );
}

export default App;
