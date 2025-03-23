import React from 'react'
import { assets } from '../assests/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

                {/* left  */}
                <div >
                    <img className='mb-5 w-40' src={assets.logoN6} alt="" />
                    <p className='w-full md:w-2/3 leading-6 text-gray-600 py-1'>Johnathan Doe
                        Sunrise Residency, Tower B, Flat No. 1203
                        4567 Oakwood Avenue, Near Greenway Park
                        Downtown District, Springfield, IL 62704
                        USA</p>
                </div>

                {/* center  */}
                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <NavLink to="/">
                            <li className='py-1 hover:text-blue-400'>Home</li>
                        </NavLink>

                        <NavLink to='/about'>
                            <li className='py-1 hover:text-blue-400'>About us</li>
                        </NavLink>

                        <NavLink to='/contact'>
                            <li className='py-1 hover:text-blue-400'>Contact us</li>
                        </NavLink>

                        <li className='py-1'>Privacy policy</li>
                    </ul>
                </div>

                {/* right  */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91 9875487212</li>
                        <li>CliniqueNow@hotmail.com</li>
                    </ul>
                </div>
            </div>

            {/* copyright */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ CliniqueNow - All Right Reserved</p>
            </div>
        </div>
    )
}

export default Footer