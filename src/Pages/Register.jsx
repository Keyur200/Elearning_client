import React, { useState } from 'react'
import { FaMailBulk, FaRegUser } from 'react-icons/fa'
import { IoMdLocate } from 'react-icons/io'
import { IoLocateOutline, IoLocationOutline } from 'react-icons/io5'
import { MdKey, MdLocationCity, MdOutlineEmail } from 'react-icons/md'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [name,setname] = useState()
  const [email,setemail] = useState()
  const [pass,setpass] = useState()
  const [roleId,setroleId] = useState()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post('http://localhost:5000/auth/register', {
        name,email,password:pass,roleId
      })
      if(data.error){
        toast.error(data.error)
      }
      else{
        toast.success("Registarion successfully.")
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='flex w-auto h-auto items-center justify-center pt-10'>
    <form onSubmit={handleSubmit} className='border border-[#e9e7e7] rounded-xl shadow-xl flex flex-col py-10 px-8'>
      <h2 className='text-2xl font-bold pb-5'>Create New Account</h2>
      <div className='flex items-center pb-1 px-3 pt-5 gap-5 border-b-2 border-b-[#eeecec]'>
        <FaRegUser className='text-[#ff385c] text-lg' />
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)} placeholder='Username' className='outline-none' />
      </div>
      <div className='flex items-center pb-1 px-3 pt-5 gap-5 border-b-2 border-b-[#eeecec]'>
        <MdOutlineEmail  className='text-[#ff385c] text-lg' />
        <input type="email" value={email} onChange={(e)=>setemail(e.target.value)} placeholder='Email' className='outline-none' />
      </div>
      <div className='flex items-center pb-1 px-3 pt-5 gap-5 border-b-2 border-b-[#eeecec]'>
        <MdKey  className='text-[#ff385c] text-lg' />
        <input type="password" value={pass} onChange={(e)=>setpass(e.target.value)}  placeholder='Password' className='outline-none' />
      </div>

      <div className='flex items-center pb-1 px-3 pt-5 gap-5 border-b-2 border-b-[#eeecec]'>
        <MdKey  className='text-[#ff385c] text-lg' />
        <input type="text" value={roleId} onChange={(e)=>setroleId(e.target.value)}  placeholder='Role ' className='outline-none' />
      </div>

      <button type='submit' className='bg-[#ff385c] border-2 border-[#ff385c] transition transform duration-500 hover:bg-[#fbdee2] hover:text-[#ff385c] py-3 px-5 text-xl text-white font-semibold rounded-full mt-8' >Create</button>
      <div className='flex gap-1 w-full justify-center pt-1 text-sm '>Already have an account? <Link to={'/login'} className='font-semibold text-[#ff385c]'>Login</Link></div>
    </form>

  </div>
  )
}

export default Register