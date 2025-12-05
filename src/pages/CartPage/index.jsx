import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import Button from "@mui/material/Button";
import { IoBagCheckOutline } from "react-icons/io5";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
const CartPage = () => {
  const [sizeanchorEl, setSizeAnchorEl] = React.useState(null);
  const[selectedSize,setSelectedSize] = useState('S')
  const [qtyanchorEl, setQtyAnchorEl] = React.useState(null);
  const[selectedQty,setSelectedQty] = useState(1)

  const openSize = Boolean(sizeanchorEl);
  const openQty = Boolean(qtyanchorEl);
  const handleClickSize = (event) => {
    
    setSizeAnchorEl(event.currentTarget);
  };
  const handleClickQty = (event) => {
    
    setQtyAnchorEl(event.currentTarget);
  };
  const handleCloseQty = (value) => { 
    setQtyAnchorEl(null);
    if (value!==null) {
      setSelectedQty(value)
    }
  };
  const handleCloseSize = (value) => { 
    setSizeAnchorEl(null);
    if (value!==null) {
      setSelectedSize(value)
    }
  };
  return (
    <section className="section py-10 pb-10">
      <div className="container w-[80%] max-w-[80%] flex gap-2">
        <div className="leftPart w-[70%]">
          <div className="shadow-md  bg-white rounded-md">
            <div className="py-2 px-3  border-b border-[rgba(0,0,0,0.2)] ">
              <h2>Your Cart</h2>
              <p className="mt-0">
                There are <span className="font-bold text-primary">2</span>{" "}
                Products in your cart
              </p>
            </div>
            <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.2)] ">
              <div className="img w-[10%] rounded-md overflow-hidden">
                <Link to="/productDetails/1212" className="group">
                  <img
                    src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/psblog/b/9/1105_813/b-blog-7.jpg"
                    className="w-full group-hover:scale-105 transition-all"
                    alt=""
                  />
                </Link>
              </div>

              <div className="info w-[90%] relative">
                <span className="text-[13px]">Sangria</span>
                <h3 className="text-[13px]">
                  <Link className="link font-[500] transition">
                    A-Line Kurti With Sharara & Dupatta.
                  </Link>
                </h3>
                <Link className=" !absolute top-0 right-0  !rounded-md">
                  <RxCross1 className="" />
                </Link>
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <span onClick={handleClickSize} className="flex items-center justify-center bg-[#f1f1f1]  text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer">
                        Size :{selectedSize} <IoIosArrowDown />
                      
                      </span>
                      <Menu
                        id="basic-menu"
                        anchorEl={sizeanchorEl}
                        open={openSize}
                        className="w-[100px] rounded-md "
                        onClose={()=>handleCloseSize(null)}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem className="!text-[12px]" onClick={()=>handleCloseSize('S')}>S</MenuItem>
                        <MenuItem className="!text-[12px]" onClick={()=>handleCloseSize('M')}>M</MenuItem>
                        <MenuItem className="!text-[12px]" onClick={()=>handleCloseSize('L')}>L</MenuItem>
                        <MenuItem className="!text-[12px]" onClick={()=>handleCloseSize('XL')}>S</MenuItem>
                        <MenuItem className="!text-[12px]" onClick={()=>handleCloseSize('XXL')}>M</MenuItem>
                        <MenuItem className="!text-[12px]" onClick={()=>handleCloseSize('XXXL')}>L</MenuItem>
                      </Menu>
                      

                    </div>
                    <div className="relative">
                      <span onClick={handleClickQty} className="flex items-center justify-center bg-[#f1f1f1]  text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer">
                        Qty : {selectedQty} <IoIosArrowDown />
                      </span>
                      {
                         <Menu
                         id="basic-menu"
                         anchorEl={qtyanchorEl}
                         open={openQty}
                         className="w-[100px] rounded-md "
                         onClose={()=>handleCloseQty(null)}
                         MenuListProps={{
                           "aria-labelledby": "basic-button",
                         }}
                       >
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(1)}>1</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(2)}>2</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(3)}>3</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(4)}>4</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(5)}>5</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(6)}>6</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(7)}>7</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(8)}>8</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(9)}>9</MenuItem>
                         <MenuItem className="!text-[12px]" onClick={()=>handleCloseQty(10)}>10</MenuItem>
                       </Menu>
                      }
                    </div>
                 </div>
                <div className="flex items-center gap-4 mt-4">
                  <span className="newPrice  text-black font-semibold">
                    $100.00
                  </span>
                  <span className="price line-through text-gray-500 text-[15 px] font-[500]">
                    $100.00
                  </span>
                  <span className="newPrice  text-primary font-semibold">
                    55% OFF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightPart w-[30%]">
          <div className="rounded-md shadow-md bg-white p-5">
            <h3 className="pb-3 font-[600]">Cart Totals</h3>
            <hr />
            <p className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-[500]">sunTotal:</span>
              <span className="text-primary font-bold">13,0000.00</span>
            </p>
            <p className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-[500]">Shipping:</span>
              <span className="text-primary font-bold">Free</span>
            </p>
            <p className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-[500]">Estimate for</span>
              <span className="font-bold">Free</span>
            </p>
            <p className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-[500]">Total</span>
              <span className="font-bold">5600</span>
            </p>

            <Button className="btn-org btn-lg w-full flex gap-1">
              <IoBagCheckOutline className="text-[20px] font-[500] " />
                Checkout
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
