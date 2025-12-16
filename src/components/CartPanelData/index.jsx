import { Button } from "@mui/material";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../../App";

const CartPanelData = ({ lenghtOfCart }) => {
  const context = useContext(MyContext);
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
  }, [token, url, lenghtOfCart]);

  const navigate = useNavigate();
  const redirectToCheckout = () => {
    navigate('/checkout');
  };
  const redirectToCart = () => {
    navigate('/cart');
  };

  const totals = useMemo(() => {
    const itemCount = cartData.reduce((acc, item) => acc + (item?.quantity || 0), 0);
    const subTotal = cartData.reduce((acc, item) => {
      const price = item?.productId?.price || 0;
      const qty = item?.quantity || 0;
      return acc + price * qty;
    }, 0);
    const shipping = itemCount ? 99 : 0;
    const taxes = itemCount ? 99 : 0;
    const totalWithTax = subTotal + shipping + taxes;

    return {
      itemCount,
      subTotal,
      shipping,
      taxes,
      totalWithTax,
    };
  }, [cartData]);

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
        lenghtOfCart((item)=>item-1);
      }
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  return (
    <div className="cart-panel flex h-full flex-col px-5 pb-6 pt-4">
      <div className="flex-1 overflow-y-auto pr-2">
        {cartData && cartData.length > 0 ? (
          cartData.map((item, index) => (
            <div key={index} className="cartItem w-full border-b border-[rgba(0,0,0,0.1)] pb-4 mb-4 flex items-center gap-4">
              <div className="img w-[30%] overflow-hidden h-[80px] rounded-md">
                <img
                  src={`${item.productId?.images[0]}`}
                  alt="cartImg"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="info w-[70%] relative">
                <h4 className="text-[13px] w-[90%] font-[500]">
                  {item.productId?.name?.substring(0, 50)}...
                </h4>
                <p className="flex items-center mt-4 mb-4 gap-4 text-[13px]">
                  <span>
                    Qty : <span>{item.quantity}</span>
                  </span>
                  <span className="font-[500]">Price {item.productId?.price}</span>
                  <span className="text-primary font-[500]">Total {item.productId?.price * item.quantity}</span>
                </p>

                <MdOutlineDeleteOutline
                  className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all duration-300"
                  onClick={() => handleDelete(item?._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            Your cart is empty.
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-[rgba(0,0,0,0.1)] pt-4">
        <div className="flex items-center justify-between text-sm font-[600]">
          <span>{totals.itemCount} item(s)</span>
          <span className="text-primary font-bold">{totals.subTotal}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm font-[600]">
          <span>Shipping</span>
          <span className="text-primary font-bold">{totals.shipping}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm font-[600]">
          <span>Taxes</span>
          <span className="text-primary font-bold">{totals.taxes}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm font-[600]">
          <span>Total</span>
          <span className="text-primary font-bold">{totals.totalWithTax}</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <Button onClick={redirectToCart} className="btn-org btn-lg w-[50%]">
            View Cart
          </Button>
          <Button
            onClick={redirectToCheckout}
            className="btn-org btn-lg w-[50%]"
            disabled={!cartData.length}
          >
            Check Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPanelData;