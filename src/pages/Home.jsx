import React from 'react'
import Navbar from "../components/Navbar"
import Herosection from "../components/Herosection"
import Speciality from "../components/Speciality"
import Calltoaction from "../components/Calltoaction"
import Statusbar from "../components/Statusbar"
import WhyUs from "../components/WhyUs"
import Footer from "../components/Footer"
const Home = () => {
  return (
<div className='w-full h-full bg-gray-50'>
      <Navbar/>
      <Herosection/>
      <Calltoaction/>
      <Statusbar/>
      <Speciality/>
      <WhyUs/>
      <Footer/>
    </div>
  )
}

export default Home