import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
             <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    *{
                        font-family: "Geist", sans-serif;
                    }
                `}
            </style>
            <div className='bg-gray-100 pt-20 px-4'>
                <footer className="bg-white w-full max-w-[1350px] mx-auto text-black pt-8 lg:pt-12 px-4 sm:px-8 md:px-16 lg:px-28 rounded-tl-3xl rounded-tr-3xl overflow-hidden">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-12">
                        
                        <div className="lg:col-span-3 space-y-6">
                            <a href="#" className="block">
                          <img src={assets.logo} alt="logo" className="h-[45px] invert" />    
                        </a>
                            <p className="text-sm/6 text-neutral-600 max-w-96">Discover the world's most extraordinary places to stay,      from boutique hotels to luxury villas and private islands.</p>
                            <div className="flex gap-5 md:gap-6 order-1 md:order-2">
                                
                                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                                    <img src={assets.twitterIcon} alt="logo" />  
                                </a>
                                
                                
                                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                                  <img src={assets.linkendinIcon} alt="logo" />  

                                </a>
                               

                                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                                 <img src={assets.instagramIcon} alt="logo" />  
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-28 items-start">


                            <div>
                                <h3 className="font-medium text-sm mb-4">COMPANY</h3>
                                <ul className="space-y-3 text-sm text-neutral-800">
                                    <li><a href="#" className="hover:text-neutral-700">About</a></li>
                                    <li><a href="#" className="hover:text-neutral-700">Ratings</a></li>
                                    <li><a href="#" className="hover:text-neutral-700">Blogs</a></li>
                                    <li><a href="#" className="hover:text-neutral-700">Partners</a></li>
                                </ul>
                            </div>

                        
                            <div className="col-span-2 md:col-span-1">
                                <h3 className="font-medium text-sm mb-4">SUPPORT</h3>
                                <ul className="space-y-3 text-sm text-neutral-800">
                                    <li><a href="#" className="hover:text-neutral-700">About</a></li>
                                    <li className="flex items-center gap-2">
                                        <a href="#" className="hover:text-neutral-700">Careers</a>
                                    </li>
                                    <li><a href="#" className="hover:text-neutral-700">Privacy policy</a></li>
                                    <li><a href="#" className="hover:text-neutral-700">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto mt-12 pt-4 border-t border-neutral-300 flex justify-between items-center">
                        <p className="text-neutral-600 text-sm">© 2026 Stayzo</p>
                        <p className='text-sm text-neutral-600'>All right reserved.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-slate-100 rounded-full blur-[100px] pointer-events-none"/>
                        <h2 className=" text-center font-extrabold leading-[0.74] text-transparent text-[clamp(3rem,15vw,15rem)] [-webkit-text-stroke:1.5px_#D4D4D4] mt-6" >
                        StaYzo
                        </h2>
                    </div>
                </footer>
            </div>
    </div>
  )
}

export default Footer