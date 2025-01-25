import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) =>{

    const currencySymbol = '$'

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors , setDoctors] = useState ([])

    const [token,setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)

    const [userData , setUserData] = useState(false)
    


    const getDoctorsData = async () => {
        try {
            console.log('fetching doctor from :',backendUrl + '/api/doctor/list')
            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            console.log("doctors data" , data)
            if (data) {
                setDoctors(data.doctors)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log("d" ,error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            console.log('My Profile data',data)

            if(data){
                setUserData(data.userData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log("d" ,error)
            toast.error(error.message)
        }
    }

    const value= {
        doctors, getDoctorsData, currencySymbol, token, setToken, backendUrl,userData,setUserData,loadUserProfileData
    }



    useEffect(()=> {
        if (token) {
            loadUserProfileData()
        }
        else{
            setUserData(false)
        }
    },[token])

    useEffect(() => {
        getDoctorsData()
    } ,[])

    return (
        <AppContext.Provider value={value}>
            {props.children}


        </AppContext.Provider>
    )
}

export default AppContextProvider