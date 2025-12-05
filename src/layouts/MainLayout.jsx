import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Drawer from "@mui/material/Drawer";
import { IoMdClose } from "react-icons/io";
import CartPanelData from "../components/CartPanelData";
import { MyContext } from "../App";

const MainLayout = () => {
  const context = useContext(MyContext);
  const closeCart = () => context?.setOpenCartPanel?.(false);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />

      <Drawer open={!!context?.openCartPanel} anchor="right" className="cartBar">
        <div className="flex items-center gap-3 py-3 px-5 justify-between text-[15px] font-[500] border-b border-[rgba(0,0,0,0.2)]">
          <h4>Shopping Cart ({context?.cartLen || 0})</h4>
          <button onClick={closeCart} className="p-1" aria-label="Close cart panel">
            <IoMdClose className="text-[20px] cursor-pointer" />
          </button>
        </div>
        <CartPanelData lenghtOfCart={context?.setCartLen || (()=>{})} />
      </Drawer>
    </>
  );
};

export default MainLayout;
