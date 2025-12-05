import React, { useContext } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductListing from "./components/ProductListing";
import CategoryPage from "./pages/Category/CategoryPage";
import ProductDetails from "./pages/ProdcutDetails"; // Fixed typo in import
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { CgClose } from "react-icons/cg";
import ProductDetailsComponents from "./components/ProductsDetails/index";
import ProductZoom from "./components/productZoom";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import MainLayout from "./layouts/MainLayout.jsx";
import CartPage from "./pages/CartPage/index";
import Verify from "./pages/Varify"; // Fixed typo in import
import { Toaster } from "react-hot-toast";
import ForgetPassword from "./pages/ForgetPassword/index";
import MyAccount from "./pages/MyAccount/index";
// import MyList from "./pages/MyList/index";
import Orders from "./pages/Orders/index";
import Checkout from "./components/checkout/index";
import BlogDetail from "./pages/BlogDetail/index";
import "swiper/css";
import "react-loading-skeleton/dist/skeleton.css";
import WhichList from "./components/whichlist"; 
import { AppProvider, MyContext } from "./context/AppContext";

function AppContent() {
  const { openProductDetailsModal, handleCloseProductDetailsModal, data } = useContext(MyContext);

  return (
    <>
      <Routes>
        <Route element={<MainLayout /> }>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productListning/:category" element={<ProductListing />} />
          <Route path="/category/:main" element={<CategoryPage />} />
          <Route path="/category/:main/:sub" element={<CategoryPage />} />
          <Route path="/category/:main/:sub/:third" element={<CategoryPage />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/newpassword" element={<ForgetPassword />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/myList" element={<WhichList />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/productDetails/:id" element={<ProductDetails />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Route>
      </Routes>
      <Toaster />
      <Dialog
        open={openProductDetailsModal}
        fullWidth={true}
        maxWidth="lg"
        onClose={handleCloseProductDetailsModal}
        className="productDetailsModal"
      >
        <DialogContent className="overflow-y-scroll">
          <Typography id="modal-modal-description" sx={{ mt: 2 }} component="div">
            <div className="flex items-center w-full rounded-md productDetailsModalContainer relative">
              <Button
                onClick={handleCloseProductDetailsModal}
                className="!h-[40px] !min-w-[40px] !w-[40px] !rounded-full !text-black !absolute !top-[0px] !right-[0px]"
                aria-label="Close product details"
              >
                <CgClose className="text-[20px]" />
              </Button>
              <div className="flex flex-col sm:flex-row w-full">
                <div className="w-full sm:w-[40%]">{data && <ProductZoom data={data} />}</div>
                <div className="w-full sm:w-[60%] px-4 sm:px-10 sm:ml-5">
                  {data && <ProductDetailsComponents data={data} />}
                </div>
              </div>
            </div>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
export { MyContext } from "./context/AppContext";