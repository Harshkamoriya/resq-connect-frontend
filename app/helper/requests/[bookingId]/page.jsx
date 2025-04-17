"use client"

import HelperBookingComponent from "components/HelperRequestPage";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Get bookingId from URL params
const Page = ({ params }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { bookingId } = React.use(params);

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
    <div className="p-4">
      <HelperBookingComponent booking={bookingData} />
    </div>
  );
};

export default Page;
