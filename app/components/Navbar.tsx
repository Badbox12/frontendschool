"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
const Navbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsNavbarOpen(false);
      }
    };

    const test = window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("overflow-y-hidden", isNavbarOpen);
    console.log(
      "This is: " +
        document.body.classList.toggle("overflow-y-hidden", isNavbarOpen)
    );
  }, [isNavbarOpen]);
  const handleNav = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <nav className="max-w-screen-full h-20 flex md:flex-row flex-col items-start justify-center md:items-center  md:justify-between px-4 bg-blue-300 border-b-gray-700">
      {/* Logo */}
      <div className="w-10 h-10 md:flex hidden bg-gray-500 font-serif rounded-full  justify-center items-center text-white">
        <Link href={"/"}>សាលា</Link>
      </div>
      {/* Desktop Navigation */}
      
      <ul className="md:flex hidden px-2 flex-col md:flex-row cursor-pointer font-bold text-lg">
      <Link href={"/"} className="text-gray-600 md:mr-12 hover:text-blue-600">
          {" "}
         ទំព័រដើម
        </Link>
        <Link href={"/student"} className="text-gray-600 md:mr-12 hover:text-blue-600">
          {" "}
          សិស្សតាមកម្រិតថ្នាក់
        </Link>
        <Link
          href={"/about"}
          className="text-gray-600 md:mr-12 hover:text-blue-600"
        >
          តារាងប្រចាំខែ
        </Link>
        <Link
          href={"/about"}
          className="text-gray-600 md:mr-12 hover:text-blue-600"
        >
          តារាងប្រចាំឆមាស
        </Link>
        <Link
          href={"/about"}
          className="text-gray-600 md:mr-12 hover:text-blue-600"
        >
          តារាងប្រចាំខែឆ្នាំ
        </Link>
      </ul>
      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {isNavbarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          isNavbarOpen
            ? " z-10 fixed right-0 top-0 md:hidden flex flex-col w-[60%]  h-screen pt-4 items-center space-y-4 border-r border-r-gray-900 bg-blue-300 ease-in duration-500"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
      >
          <Link href={"/"}>
          <li
            onClick={() => setIsNavbarOpen(false)}
            className="text-gray-600 py-4 md:mr-12 hover:text-blue-600"
          >
            ទំព័រដើម
          </li>
        </Link>
        <Link href={"/student"}>
          <li
            onClick={() => setIsNavbarOpen(false)}
            className="text-gray-600 py-4 md:mr-12 hover:text-blue-600"
          >
            សិស្សតាមកម្រិតថ្នាក់
          </li>
        </Link>
        <Link href={"/about"}>
          <li
            onClick={() => setIsNavbarOpen(false)}
            className="text-gray-600 py-4  md:mr-12 hover:text-blue-600"
          >
            តារាងប្រចាំខែ
          </li>
        </Link>
        <Link href={"/about"}>
          <li
            onClick={() => setIsNavbarOpen(false)}
            className="text-gray-600 py-4 md:mr-12 hover:text-blue-600"
          >
            តារាងប្រចាំឆមាស
          </li>
        </Link>
        <Link href={"/about"}>
          <li
            onClick={() => setIsNavbarOpen(false)}
            className="text-gray-600 py-4  md:mr-12 hover:text-blue-600"
          >
            តារាងប្រចាំខែឆ្នាំ
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
