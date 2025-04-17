"use client"

import { useSession } from 'next-auth/react'
import React from 'react'
import { createContext } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'


export const Appcontext = createContext();
export const useAppContext = ()=>{
    return useContext(Appcontext)
}
export const AppcontextProvider = (props) => {

    const [services , setServices] = useState(["mechanic"]);
    const [selectedHelperId , setSelectedHelperId] = useState("");
    // const [session , setSession] = useState(null);
    const {data : session , status} =useSession();
    const hasFetched = useRef(false); // ✅ prevent duplicate fetch in dev

    const [helperId , setHelperId] =useState(null);

    const [userLocation , setUserLocation] = useState({
      name:'',
      lat:null,
      lon:null,
    })
    const [userInfo , setUserInfo] = useState( {});
    const [helpersDetails ,setHelpersDetails] = useState([])


    // async function fetchServices() {
    //     try {
    //       const response = await fetch("/api/services"); // Replace with your actual API endpoint
    //       const data = await response.json();
    //       setServices(data);
    //     } catch (error) {
    //       console.error("Error fetching services:", error);
    //     }
    //   }

    // useEffect(() => {
    //   const fetchData = async () => {
    //     const res = await fetch("/api/auth/session"); // or your custom route
    //     const data = await res.json();
    //     console.log(data , "session data")
    //     setSession(data);
    //   };
    //   fetchData();
    // }, []);

    useEffect(() => {
      if (session && !hasFetched.current) {
        hasFetched.current = true;
        const fetchData = async () => {
          const res = await fetch("/api/auth/fetch-helperId");
          const data = await res.json();
          console.log(data, "data fetched successfully");
          setHelperId(data.helperId);
          setUserInfo(data.session.user);
        };
        fetchData();
      }
    }, [session]);

    // useEffect(() => {
    //   const fetchHelperIdData = async () => {
    //     const res = await fetch("/api/auth/fetch-helperId"); // or your custom route
    //     const data = await res.json();
    //     console.log(data , "data fetched successfully")
    //     setHelperId(data.helperId);
        
    //   };
    //   fetchHelperIdData();
    // }, []);

    useEffect(() => {
      console.log(selectedHelperId,"selectedHelperId is this ")
      }, []);
      useEffect(() => {
        console.log(selectedHelperId,"selectedHelperId is this ")
        }, [userLocation]);



      const value  =  {
        // fetchServices
        selectedHelperId,
        setSelectedHelperId,
        userLocation,
        setUserLocation,
        helpersDetails,
        setHelpersDetails,
        helperId , setHelperId,
        userInfo , setUserInfo
        // session, setSession
      }
  return (
   <Appcontext.Provider value={value}>
    {props.children}
   </Appcontext.Provider>
  )
}

