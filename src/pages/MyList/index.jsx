import React from "react";
import { useNavigate } from "react-router-dom";
import ProductItemListView from '../../components/ProductListingListView/index'
import UserSiteBarManager from "../../components/userSiteBarManager/index";
const CartPage = () => {
  const navigate = useNavigate()
  
  return (
    <div className="py-10 w-full">
      <div className="container flex gap-5">
        <UserSiteBarManager/>
        <div className="productItem rounded-sm border-1 h-[500px] overflow-y-scroll border-[rgba(0,0,0,0.1)] w-[75%] bg-white shadow-md flex mt-4">
          <div className="flex flex-col gap-2">
            <ProductItemListView/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
