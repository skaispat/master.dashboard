import React from 'react'
import Navbar from '../components/Navbar'
import HeroSlider from '../components/HeroSlider'
import Products from '../components/Products'
import Services from '../components/Services'
import BrandLogos from '../components/BrandLogos'
import Clients from '../components/Clients'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="w-full">
      <main className="m-0 p-0">
        <HeroSlider />
        <Products />
        <Services />
        {/* <BrandLogos /> */}
        <Clients />
      </main>
      <Footer />
    </div>
  )
}

export default Home
