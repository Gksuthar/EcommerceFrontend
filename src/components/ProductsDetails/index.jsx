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
      // Normalize sizes to an array and ensure single-select with a default
      if (typeof data?.size === "string") {
        const arr = data?.size?.split(",").map((s) => String(s).trim()).filter(Boolean);
        setSizes(arr);
        if (arr.length > 0) setProActionIndex(0); // default select first size
      } else if (Array.isArray(data?.size)) {
        const arr = data?.size.map((s) => String(s).trim()).filter(Boolean);
        setSizes(arr);
        if (arr.length > 0) setProActionIndex(0); // default select first size
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
    <div className="">
      <h1 className="text-[22px] font-[600] mb-2"> {data?.name}</h1>

      <div className="flex item-center gap-3 items-center">
        <span className="text-gray-400">
          Brands :
          <span className="font-[500] text-black text-[13px] opacity-75">
            {" "}
            {data?.brand}
          </span>
        </span>
        <Rating name="size-small" value={data?.rating ?? 0} size="small" readOnly />
        <span className="text-[13px] cursor-pointer text-gray-400">
          Review ({length})
        </span>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <span className="price line-through text-gray-500 text-[18px] font-[600]">
          ₹ {data?.oldPrice}
        </span>
        <span className="newPrice  text-primary text-[18px] font-bold">
          ₹ {data?.price}
        </span>

        <span>
          Availible in Stock :{" "}
          <span className="text-green-400 text-[14px] font-bold">
            {" "}
            {data?.countInStock}
          </span>
        </span>
      </div>
      <br />
      <p className="mt-3 pr-[10px] text-[12px]">
        {data?.description}
      </p>

      <div className="flex items-center gap-2 mt-3 ">
        <span className="text-[13px] font-[600]">Size :</span>
        <div className="flex items-center gap-2 actions   ">
          {sizes.map((item, index) => (
            <Button
              key={index}
              onClick={() => setProductActionIndex(index)}
              className={`${productActionIndex === index ? "!bg-primary  !text-white" : ""
                } !text-[12px]  !h-[30px] !w-[50px] !min-w-[50px] `}
            >
              {item}
            </Button>
          ))}

        </div>

      </div>
      <p className="mb-2 mt-4 text-[12px] text-gray-400">
        Free Shipping (Est. Delivery Time 2-3 Days)
      </p>

      <div className="flex items-center mt-4 gap-4">
        <div className="qtyBoxWrapper w-[70px]  ">
          <QtyBox qtyValue={quantity} setQtyValue={setQuantity} />
        </div>
        <Button className="btn-org" onClick={() => addToCart(data?._id)}>ADD TO CART</Button>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <span onClick={() => addProductInWichList(data?._id, data.rating, data.price, data.oldPrice, data.brand, data.discount)} className="flex items-center gap-2 text-[15px] link cursor-pointer font-[500] transition">
          <FaRegHeart />
          Add to Wishlist{" "}
        </span>
        <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-[500] transition">
          <IoGitCompareOutline />
          Add to Compare{" "}
        </span>
      </div>
    </div>
  );
};

export default ProductDetailsComponents;
