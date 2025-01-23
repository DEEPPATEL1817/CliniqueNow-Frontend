import React, { useContext, useState } from 'react'
// import { assets } from '../assests/assets'
import { AppContext } from '@/context/AppContext.jsx'
import { assets } from '@/assests/assets'
import { fromJSON } from 'postcss'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {

  //temp data
  // const [userData, setUserData] = useState({
  //   name: "Deep Patel",
  //   image: assets.profile_pic,
  //   email: 'deppatel@outlook.com',
  //   phone: '+91 9854126588',
  //   address: {
  //     line1: "Aazad chok,rajori",
  //     line2: "behind lokmanya marge,Maharastra"
  //   },
  //   gender: 'Male',
  //   DOB: '1994-02-28'
  // })

  const {userData,setUserData ,token ,backendUrl ,loadUserProfileData} = useContext(AppContext)

  const [edit, setEdit] = useState(false)

  const [image, setImage ] = useState(false)

  const updateUserProfileData = async () => {
    try {
      
      const formData = new formData()

      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)

      image && formData.append('image',image)

      const {data} = await axios.post(backendUrl + '/api/user/update-profile',formData,{headers:{token}})

      if(data){
        toast.success(data.message)
        await loadUserProfileData()
        setEdit(false)
      }
      else{
        console.log("error",error)
        toast.error(data.message)
      }
    } catch (error) {
      console.log("error in updating profile", error)
      toast.error(error.message)

    }
  }


  return userData &&  (
    <div className='flex flex-col gap-2 max-w-lg text-sm'>

      {
        edit ? 
        <label htmlFor="image">
          <div className='inline-block cursor-pointer relative'>
            <img src={image ? URL.createObjectURL(image) : userData.image} alt="" className='w-36 rounded opacity-75' />
            <img src={image ? '' : assets.upload_icon} alt="" className='w-10 absolute bottom-12 right-12' />
          </div>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
        </label> : <img src={userData.image} className='w-36 rounded' alt="" />
      }


      {
        edit
          ? <input type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' />
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}  </p>
      }
      <hr className='bg-zinc-400 h-[1px border-none]' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3  text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            edit
              ? <input className='bg-gray-100 max-w-52 ' type="text" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
              : <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address:</p>
          {
            edit
              ? <p>
                <input type="text" value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} className='bg-gray-100' />
                <br />
                <input type="text" value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} className='bg-gray-100' />
              </p>
              : <p className='text-gray-500'>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-500'>
          <p className='font-medium'>Gender:</p>
          {
            edit
              ? <select value={userData.gender} onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} className='max-w-20 bg-gray-100'>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              : <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium '>DOB:</p>
          {
            edit ? <input type="date" value={userData.DOB} onChange={(e) => setUserData(prev => ({ ...prev, DOB: e.target.value }))} className='max-w-28 bg-gray-100'/> 
            : <p className='text-gray-400'>{userData.DOB}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          edit 
          ?<button className='border border-primary px-8 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all' onClick={updateUserProfileData}>Save</button> 
          :<button className='border border-primary px-8 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all' onClick={()=>setEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile