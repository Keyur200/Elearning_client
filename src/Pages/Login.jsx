import React, { useState } from 'react'
import { FaMailBulk, FaRegUser } from 'react-icons/fa'
import { IoMdLocate } from 'react-icons/io'
import { IoLocateOutline, IoLocationOutline } from 'react-icons/io5'
import { MdKey, MdLocationCity, MdOutlineEmail } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/UserContext.jsx'
const Login = () => {
  const [email, setemail] = useState()
  const [pass, setpass] = useState()
  const navigate = useNavigate()
  const [user, setUser] = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('http://localhost:5000/auth/login', {
        email, password:pass
      }, { withCredentials: true })
      if (data.error) {
        toast.error(data.error)
      }
      else {
        toast.success("Login successfully.")
        setUser(data)
        console.log(data?.user)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex w-auto h-auto items-center justify-center pt-10 flex-col'>
      <div className='border border-[#e9e7e7] rounded-xl shadow-xl flex flex-col py-10 px-8'>

        <form onSubmit={handleSubmit} className=' flex flex-col gap-5 '>
          <h2 className='text-2xl font-bold pb-5'>Login </h2>
          <div className='flex items-center pb-1 px-3  gap-5 border-b-2 border-b-[#eeecec]'>
            <MdOutlineEmail className='text-[#ff385c] text-lg' />
            <input type="email" value={email} onChange={(e) => setemail(e.target.value)} placeholder='Email' className='outline-none' />
          </div>
          <div className='flex items-center pb-1 px-3  gap-5 border-b-2 border-b-[#eeecec]'>
            <MdKey className='text-[#ff385c] text-lg' />
            <input type="password" value={pass} onChange={(e) => setpass(e.target.value)} placeholder='Password' className='outline-none' />
          </div>
          <button type='submit' className='bg-[#ff385c] border-2 border-[#ff385c] transition transform duration-500 hover:bg-[#fbdee2] hover:text-[#ff385c] py-3 px-5 text-xl text-white font-semibold rounded-full mt-4' >Login</button>
        </form>
        <div className='flex gap-1 w-full justify-center pt-1 text-sm '>Create a new account? <Link to={'/register'} className='font-semibold text-[#ff385c]'>Register</Link></div>
        <div className='flex w-full justify-between items-center pt-5'>
          <hr className='border w-full' />
          <span className='px-2 font-semibold text-[#ff385c]'>OR</span>
          <hr className='border w-full' />
        </div>
      </div>
    </div>
  )
}

export default Login