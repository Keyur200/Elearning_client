import React from 'react'
import { FaRegUserCircle, FaSearch } from 'react-icons/fa'
import { HiMiniBars3 } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/UserContext'
import toast from 'react-hot-toast'
const Navbar = ({ toggle, setToggle }) => {
    const [user, setUser] = useAuth()
    const navigate = useNavigate()
    
    return (
        <div className='flex items-center justify-between py-5 px-20'>
            <Link to={'/'} className='text3xl font-semibold '>e-Leaning</Link>
            
            <div onClick={() => setToggle(true)} className={`flex gap-3 relative items-center border border-[#DDDDDD] py-2 px-3 rounded-full cursor-pointer hover:shadow-lg ${toggle ? 'shadow-lg' : ''}`}>
                <HiMiniBars3 className='' />

                <div className={`${!user ? 'px-3 py-3' :'py-2 px-3'} bg-black text-center text-white py-2 px-3 rounded-full text-[9px] uppercase`}>{user && user?.name?.substring(0, 1)}</div>

                {
                    toggle && !user && (
                        <div className='absolute flex gap-2 flex-col z-50 w-[200px] items-start top-14 right-0 shadow-lg py-3  rounded-xl  border border-[#DDDDDD] bg-white'>
                            <Link to={'/login'} className='hover:bg-[#f7f6f6] w-full text-start py-2 px-4 font-semibold hover:text-[#FF385C]'>Login</Link>
                            <Link to={'/register'} className='hover:bg-[#f7f6f6] w-full text-start py-2 px-4 font-semibold hover:text-[#FF385C]'>Create a new account</Link>
                        </div>
                    )
                }
                {
                    toggle && user && (
                        <div className='absolute flex gap-2 flex-col z-50 w-[200px] items-start top-14 right-0 shadow-lg py-3  rounded-xl  border border-[#DDDDDD] bg-white'>
                            <Link to={'/profile'} className='hover:bg-[#f7f6f6] w-full text-start py-2 px-4 font-semibold hover:text-[#FF385C]'>Profile</Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar