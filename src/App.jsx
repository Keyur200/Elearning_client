import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './Pages/Register'
import { Toaster } from 'react-hot-toast'
import Login from './Pages/Login'
import Navbar from './Components/Navbar'

function App() {

  const [toggle,setToggle] = useState(false)
  return (
    <BrowserRouter>
      <Navbar toggle={toggle} setToggle={setToggle}  />
      <Routes>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
