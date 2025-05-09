 
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
  

<footer className="bg-white w-full rounded-lg shadow  ">
    <div className=" mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 md:flex hidden bg-gray-500 font-serif rounded-full  justify-center items-center text-white">
        <Link href={"/"}>សាលា</Link>
      </div>
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-700 ">Cam Sala</span>
            </div>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">About</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contact</a>
                </li>
            </ul>
        </div>
        <hr className="my-6 border-gray-600 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="" className="hover:underline">camsala™</a>. All Rights Reserved.</span>
    </div>
</footer>


  )
}

export default Footer