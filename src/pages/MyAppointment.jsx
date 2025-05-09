import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Appointment from './Appointment'

const MyAppointment = () => {

  const {backendUrl , token ,getDoctorsData} = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  const months = ["",'Jan',"Feb","March","April","May","Jun","July","Aug","Sep","Oct","Nov","Dec"]

  // const slotDateFormat = (slotDate) => {
  //   const dateArray = slotDate.split('_')
  //     return dateArray[0] + " " + months[Number(dateArray[1]) + " " + dateArray[2]]
  // }


  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };
  

  const getUserAppointments = async () =>  {
    try {
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
      console.log("data of user appointment",data)
      if (data) {
        setAppointments(data.appointments.reverse())
        
      }
    } catch (error) {
      console.log("error in fetching all appointments",error)
      toast.error(error.massage)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      console.log("appointmetid", appointmentId)

      const {data} = await axios.post(backendUrl + "/api/user/cancel-appointment", {appointmentId},{headers:{token}})

      console.log("data of cancel ",data)
      if(data){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log("error in Cancelling appointment",error)
      toast.error(error.massage)
    }
  }

  useEffect(()=>{
    if(token){
      getUserAppointments()
      
    }
  },[token])


  useEffect(() => {
    console.log("All Appointments of user :", appointments);
  }, [appointments]);

  
  return  (
    <div>
      
        <p className='pb-3 mt-12 font-medium text-zinc-700 border-b '>My Appointment</p>
        <div>
          {appointments.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={index}>
              <div>
                <img className='w-32 bg-indigo-100' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold '>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address}</p>
                {/* <p className='text-xs'>{item.address.line2}</p> */}
                <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col justify-end gap-2'>
                {!item.cancelled && !item.isCompleted && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-md hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
               {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-md hover:bg-red-500 hover:text-white transition-all duration-300'>Cancel Appointment</button>  }

               {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 text-red-500 rounded transition duration-500 '>Appointment Cancelled</button>}

               {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
              </div>
            </div>
          ))}
        </div>
      
    </div>
  )
}

export default MyAppointment

