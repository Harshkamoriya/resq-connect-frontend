import React from 'react'

import ETAComponent from './Eta'
const HelpersList = ({ latitude , longitude ,helpers}) => {
  return (
    <>

       <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Helpers</h2>

    
        <div className="space-y-4 flex-col items-start">
          {helpers.map((helper) => (
            <div key={helper._id} className="p-4 border rounded-lg shadow-md flex justify-between gap-8 items-center">
              <div>
                <h3 className="text-lg font-semibold">{helper.name}</h3>
                <p className="text-sm text-gray-600">{helper.location.name}</p>
                <p className="text-sm text-red-600">{helper.serviceType}</p>
                <ETAComponent  userLat ={latitude} userLon ={longitude} helpers={helpers}  />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mx-3">
                Request Service
              </button>
            </div>
          ))}
        </div>
      
    </div>
    
    
    </>
  )
}

export default HelpersList
