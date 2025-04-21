"use client"

import HelperBookingComponent from "components/HelperRequestPage";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatModalWrapper from "components/wrappers/chatModelWrapper";
import MapComponent from "components/MapComponent";
import { useAppContext } from "app/context/Appcontext";

// Get bookingId from URL params
const Page = ({ params }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen , setIsOpen] =useState(true);
  const [showModal , setShowModal] =useState(false);
  const {user } =useAppContext();
  const [helpersDetails , setHelpersDetails] = useState([]);
  const [userLat , setUserLat] = useState("");
  const [userLon , setUserLon] = useState("");


  const { bookingId } = React.use(params);

  useEffect(() => {
      try {
        const helpersStr = localStorage.getItem("helpersDetails")
        if (helpersStr) {
          const parsedHelpers = JSON.parse(helpersStr)
          setHelpersDetails(parsedHelpers)
        }
        setUserLat(user.location.latitude);
        setUserLon(user.location.longitude);
      } catch (error) {
        console.error("Error parsing helpers data:", error)
      }
    }, [])
  

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/api/booking/details/${bookingId}`);
        console.log(res,"response of booking data")


        if (res.data.success) {
          setBookingData(res.data);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading booking details...</div>;
  }

  if (!bookingData) {
    return <div className="p-4 text-red-500">Failed to load booking data.</div>;
  }

  return (
    <>
     <div className="p-4">
      <HelperBookingComponent booking={bookingData} />
      <ChatModalWrapper Open={isOpen} onClose={()=>setShowModal(false)} bookingId={bookingId} currentUser={user} />
    </div>
    {/* <MapComponent userLat={userLat} userLon={userLon}  helpers={helpersDetails} selectedHelperId={helperId} /> */}
    {/* no it is wrong you have to make a seperate map component i guess i guess for an helper the helper is the user and the customer is like someone else */}
    <div>
     
    </div>
    </>
   
  );
};

export default Page;
