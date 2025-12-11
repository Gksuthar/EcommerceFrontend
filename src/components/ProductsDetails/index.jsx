import { useContext, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import QtyBox from "../../components/QtyBox";
import { MyContext } from "../../App";
import axios from "axios";
import toast from 'react-hot-toast';

const ProductDetailsComponents = ({ data, length }) => {
  const [productActionIndex, setProActionIndex] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const context = useContext(MyContext) || {};
  // Guard against undefined context (component may be rendered outside provider in some usages)
  const AppUrl = context.AppUrl || "http://localhost:2000";
  const setProductActionIndex = (index) => {
    setProActionIndex(index);

  };
    useEffect(() => {
      if (typeof data?.size === "string") {
        const arr = data?.size?.split(",").map((s) => String(s).trim()).filter(Boolean);
        setSizes(arr);
        if (arr.length > 0) setProActionIndex(0); 
      } else if (Array.isArray(data?.size)) {
        const arr = data?.size.map((s) => String(s).trim()).filter(Boolean);
        setSizes(arr);
        if (arr.length > 0) setProActionIndex(0); 
      } else {
        setSizes([]);
        setProActionIndex(null);
      }
    }, [data?.size]);
  
  const addToCart = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error("Please log in to add items to cart");
        return;
      }
      // Enforce single size selection if sizes exist
      const selectedSize = sizes?.length ? sizes[productActionIndex ?? 0] : null;
      // Optionally block adding to cart if size is required
      if (sizes?.length && (productActionIndex === null || productActionIndex === undefined)) {
        toast.error("Please select a size before adding to cart");
        return;
      }
      const response = await axios.post(
        `${AppUrl}/api/cart/create`,
        { productId: id, quantity: quantity, // backend ignores size for now; kept for future
          ...(selectedSize ? { size: selectedSize } : {}) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error("Failed to add to cart");
    }
  };

  const addProductInWichList = async (id, rating, price, oldPrice, brand, discount) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${AppUrl}/api/mylist/addToMyList`, { productId: id, rating, price, oldPrice, brand, discount }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 201) {
        console.log("The prodcut is added in cart")
      }

    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
          {data?.name}
        </h1>
        
        {/* Brand & Rating Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Brand:</span>
            <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
              {data?.brand}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Rating name="product-rating" value={data?.rating ?? 0} size="small" readOnly precision={0.5} />
            <span className="text-sm text-gray-600">
              ({length} {length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-light-gray from-blue-50 to-indigo-50 rounded-xl p-5 border border-gray-200 hover:scale-100 transition-transform duration-200">
        <div className="flex items-baseline gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ₹{data?.price}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ₹{data?.oldPrice}
            </span>
          </div>
          
          {data?.discount && (
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {data.discount}% OFF
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-green-700">
            {data?.countInStock > 0 ? `In Stock (${data.countInStock} units)` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-gray-700 leading-relaxed text-sm">
          {data?.description}
        </p>
      </div>

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Select Size:
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {sizes.map((item, index) => (
              <button
                key={index}
                onClick={() => setProductActionIndex(index)}
                className={`px-4 py-2 min-w-[60px] border-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  productActionIndex === index
                    && 'bg-primary text-white  shadow-md scale-105'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-green-800">Free Shipping</p>
          <p className="text-xs text-green-600">Estimated delivery: 2-3 business days</p>
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4 pt-4 ">
        <div className="flex items-center gap-3">
          <span className="text-sm  font-semibold text-gray-700">Quantity:</span>
          <div className="w-28 text-primary">
            <QtyBox qtyValue={quantity} setQtyValue={setQuantity} />
          </div>
        </div>
        
        <button
          onClick={() => addToCart(data?._id)}
          className="flex-1 bg-primary  to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </button>
      </div>

      {/* Wishlist & Compare */}
      <div className="flex items-center gap-6 pt-2 border-t border-gray-200">
        <button
          onClick={() => addProductInWichList(data?._id, data.rating, data.price, data.oldPrice, data.brand, data.discount)}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium text-sm transition-colors group"
        >
          <FaRegHeart className="group-hover:scale-110 transition-transform" />
          Add to Wishlist
        </button>
        
        <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors group">
          <IoGitCompareOutline className="group-hover:scale-110 transition-transform" />
          Add to Compare
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsComponents;
