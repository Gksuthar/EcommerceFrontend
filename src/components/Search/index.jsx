import React from 'react'
import './style.css'
import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";

const Search = ({setSearch,search}) => {
  return (
    <div className='searchBox w-full h-[50px] bg-[#e5e5e5] rounded-[5px] p-2 flex items-center relative'>
      <input 
        type='text'
        value={search}
        onChange={(e)=>setSearch(e.target.value)} 
        placeholder='Search for products...' 
        className='w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]' 
      />
      <Button className='absolute  right-1 !w-[35px] !min-w-[37px] h-[37px] !rounded-full z-50 !text-black'>
        <IoSearch className='text-[#2a2a2a] text-[24px]' />
      </Button>
    </div>
  )
}

export default Search;
