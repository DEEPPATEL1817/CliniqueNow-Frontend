import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assests/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl,token , getDoctorsData } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState(null)
  const [docSlot, setDocSlot] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate ()

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)

    console.log("doctorInformaationn",docInfo)
  }

  const getAvailableSlots = async () => {

    if (!docInfo) return;
    //clear previous slots
    setDocSlot([])

    //getting current date
    let today = new Date()
    for (let i = 0; i < 7; i++) {
      //get date with index 

      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      //setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() +1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true


        if(isSlotAvailable){

          //add slot to array 
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        //increment current time by 30 minutes

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlot(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('login to book appointment')
      return navigate('/login')
    }
    console.log("tokenOfappointment:",token)
    try {
      const date = docSlot[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      console.log(slotDate)

      const {data} = await axios.post(backendUrl + '/api/user/book-appointment',{docId, slotDate, slotTime},{headers:{token}})
      console.log("data of doctors appointment",data)
      if(data){
        toast.success(data.message)
        console.log("data data",data)
        getDoctorsData()
        navigate('/my-appointments')
      }
      else{
        toast.error(data?.message || 'Failed to book appointment')
        console.log("this slot is already booked for this Doctor")
      }

    } catch (error) {
      console.log("error in ",error)
      toast.error('Doctor is not available' || error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {     
      getAvailableSlots()
    }
  }, [docInfo])

  useEffect(() => {
    console.log("doctor slot info",docSlot)
  }, [docSlot])

  return docInfo && (
    <div>
      {/* doctor details */}

      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg ' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* Doctor info : name,degree, exp */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full' >{docInfo.experience}</button>
          </div>

          {/* About doctor */}

          <div >
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/* BOOKING SLOTS */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium w-full text-gray-700 '>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlot.length && docSlot.map((item, index) => (
            <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* time slot */}
        {/* <div className='flex items-center gap-3 w-8/12 overflow-x-scroll mt-4 '>
          {docSlot.length && docSlot[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'} `} key ={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div> */}

<ScrollArea className=" whitespace-nowrap mt-4 ">

        <div className="flex items-center gap-3 w-8/12 overflow-x-scroll whitespace-nowrap mt-4">
          {docSlot.length && docSlot[slotIndex].map((item, index) => (
            <p
            onClick={() => setSlotTime(item.time)}
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime
              ? 'bg-primary text-white'
              : 'text-gray-400 border border-gray-300'
              }`}
              key={index}
              >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <ScrollBar className="mt-2 " orientation="horizontal" />
        </ScrollArea>
         


        {/* booking button */}

        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full cursor-pointer my-6'>Book an appointment</button>
      </div>

      {/* listing Related Doctors */}

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment