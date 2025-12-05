import React from "react";
import { Button } from "@mui/material";
import { IoHomeOutline, IoSearchOutline, IoBagOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { RiAccountBox2Line } from "react-icons/ri";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";

const MobileNav = () => {
  const context = useContext(MyContext);

  // Check if context is available
  if (!context) {
    throw new Error("MobileNav must be used within MyContext Provider");
  }

  return (
    <div className="mobileNav fixed bottom-0 left-0 p-1 px-2 w-full bg-white z-[999] shadow-md border-t flex justify-between md:hidden">
      <Link to="/">
        <Button
          className="flex flex-col items-center !p-0 !w-[50px] !min-w-[50px] !capitalize !text-gray-600"
          disableRipple
          aria-label="Go to home"
        >
          <IoHomeOutline size={20} className="mb-1" />
          <span className="text-[14px] leading-none">Home</span>
        </Button>
      </Link>

      <Button
        className="flex flex-col items-center !p-0 !w-[50px] !min-w-[50px] !capitalize !text-red-600"
        disableRipple
        onClick={context.toggleDrawer(true)}
        aria-label="Open filters"
      >
        <FiFilter size={20} className="mb-1" />
        <span className="text-[14px] leading-none">Filters</span>
      </Button>

      <Link to="/search">
        <Button
          className="flex flex-col items-center !p-0 !w-[50px] !min-w-[50px] !capitalize !text-gray-600"
          disableRipple
          aria-label="Go to search"
        >
          <IoSearchOutline size={20} className="mb-1" />
          <span className="text-[14px] leading-none">Search</span>
        </Button>
      </Link>

      <Link to="/mylist">
        <Button
          className="flex flex-col items-center !p-0 !w-[50px] !min-w-[50px] !capitalize !text-gray-600"
          disableRipple
          aria-label="Go to wishlist"
        >
          <CiHeart size={20} className="mb-1" />
          <span className="text-[14px] leading-none">Wishlist</span>
        </Button>
      </Link>

      <Link to="/orders">
        <Button
          className="flex flex-col items-center !p-0 !w-[50px] !min-w-[50px] !capitalize !text-gray-600"
          disableRipple
          aria-label="Go to orders"
        >
          <IoBagOutline size={20} className="mb-1" />
          <span className="text-[14px] leading-none">Orders</span>
        </Button>
      </Link>

      <Link to="/my-account">
        <Button
          className="flex flex-col items-center !p-0 !w-[50px] !min-w-[50px] !capitalize !text-gray-600"
          disableRipple
          aria-label="Go to account"
        >
          <RiAccountBox2Line size={20} className="mb-1" />
          <span className="text-[14px] leading-none">Account</span>
        </Button>
      </Link>
    </div>
  );
};

export default MobileNav;