import React, { useContext, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductItem from "../productItem/index";
import { Navigation } from "swiper/modules";
import { MyContext } from "../../App";
import Pagination from '@mui/material/Pagination';

const ProductsSlider = ({ items, selectedTab }) => {
  const context = useContext(MyContext);
  const products = context.allProduct
    ? context.allProduct.filter((pro) => pro.catName === selectedTab)
    : [];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const productsPerPage = 2;
  const [currentPage,setCurrentPage] = useState(1)

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);



  const handlePageChange=(event,value)=>{
    setCurrentPage(value)
  }
  return (
    <section className="ProductsSlider py-5">
      <div className="container">
        {isMobile ? (
          <>
          <div className="grid grid-cols-2 gap-4">
            {products && paginatedProducts.map((item, index) => (
              <div key={index}>
                <ProductItem item={item} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
            </>
        ) : (
          <Swiper
            spaceBetween={15}
            navigation={true}
            freeMode={true}
            modules={[Navigation]}
            className="mySwiper"
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: items || 4,
              },
            }}
          >
            {products && products.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default ProductsSlider;
