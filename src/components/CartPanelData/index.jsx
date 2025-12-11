import { Button } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../../App";

const CartPanelData = ({lenghtOfCart}) => {
  const context = useContext(MyContext)
  const url = context.AppUrl;
  const token = localStorage.getItem('accessToken');
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    const getCartData = async () => {
      try {
        const response = await axios.get(`${url}/api/cart/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setCartData(response.data.data);
          lenghtOfCart(response.data.data.length);
        }
      } catch (error) {
        console.log("Error fetching cart data:", error);
      }
    };
    // Only fetch cart when a token is present (avoid 401s and unnecessary requests)
    if (token) getCartData();
  }, []);
  console.log(cartData)
  const navigate = useNavigate()
  const redirectOnCheckout=()=>{
    navigate('/checkout')
  }
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/cart/daleteCart`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data : { _id: id }
      });
      if (response.status === 200) {
        setCartData(cartData.filter(item => item._id !== id));
        lenghtOfCart((item)=>item-1) 
      }
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  return (
    <>
      <div className="scroll h-[60%]  w-full overflow-y-auto">
        {cartData && cartData.map((item, index) => (
          <div key={index} className="cartItem w-full flex items-center gap-4 border-b border[rgba(0,0,0,0.2)] pb-4">
            <div className="img w-[30%] overflow-hidden h-[80px] rounded-md">
              <img
                src={`${item.productId?.images[0]}`} 
                alt="cartImg"
                className="w-[100px] h-full "
              />
            </div>
            <div className="info w-[70%] relative">
              <h4 className="text-[13px] w-[90%] font-[500]">
                {item.productId?.name.substring(0,50)}...
              </h4>
              <p className="flex items-center mt-4 mb-4 gap-4">
                <span>
                  Qty : <span>{item.quantity}</span>
                </span>
                <span className="font-[500]">Price  {item.productId?.price}</span>
                <span className="text-primary font-[500]">TotalPrice  {item.productId?.price*item.quantity}</span>
              </p>

              <MdOutlineDeleteOutline 
                className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all duration-300" 
                onClick={() => handleDelete(item?._id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bottomSection h-[30%] absolute bottom-[0px]  left-[10px] w-full overflow-hidden pr-5">
        <div className="bottomInfo w-full border-t px-4 py-3 border-[rgba(0,0,0,0.2)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="font-[600] text-[14px]">{cartData.length} item(s)</span>
            <span className="text-primary font-bold">499</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-[600] text-[14px]">Shipping</span>
            <span className="text-primary font-bold">99</span>
          </div>
        </div>

        <div className="bottomInfo w-full border-t px-4 gap-2 py-3 border-[rgba(0,0,0,0.2)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="font-[600] text-[14px]">Total(tax excl.)</span>
            <span className="text-primary font-bold">199</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="font-[600] text-[14px]">Total(tax incl.)</span>
            <span className="text-primary font-bold">199</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-[600] text-[14px]">Taxes</span>
            <span className="text-primary font-bold">99</span>
          </div>
        </div>
        <br />
        <div className="container flex items-center justify-between gap-5">
          <Button className="btn-org btn-lg w-[50%]" >View Cart</Button>
          <Button onClick={redirectOnCheckout} className="btn-org btn-lg w-[50%]" >Check Out</Button>
        </div>
      </div>
    </>
  );
};

export default CartPanelData;