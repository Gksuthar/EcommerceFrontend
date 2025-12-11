import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import './index.css';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';

const CategorySlider = () => {
  const context = useContext(MyContext);
  const categories = context?.categoryData || [];
  console.log('[DEBUG] CatSlider categories length:', categories.length, categories && categories.slice ? categories.slice(0,5) : categories);
  // Home me Hero section after
  return (
    <div className="homecatSlider py-3 sm:py-8 pt-4">
      <div className="container">
        <Swiper
          slidesPerView={7}
          spaceBetween={15}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            0: {
              slidesPerView: 3,
            },
            480: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 5,
            },
            1024: {
              slidesPerView: 7,
            },
          }}
        >
          {categories.length === 0 && (
            <div className="text-center w-full py-8">
              <p className="text-sm text-gray-500">No categories available</p>
            </div>
          )}
          {categories.length > 0 && (() => {
            return categories.map((cat, idx) => {
              // prefer first image from backend if present and looks like a URL; otherwise use fallback
              let imageSrc = null;
              if (cat.images && cat.images.length > 0) imageSrc = cat.images;
              const image = imageSrc;
              const routeName = `/productListning/${encodeURIComponent(cat.name)}`;
                return (
                <SwiperSlide key={idx}>
                  <Link to={routeName}>
                  <div className="item py-3 sm:py-7 px-3 bg-white rounded-sm text-center flex flex-col items-center justify-center">
                    <img src={image} alt={cat.name} className="transition-all w-25 h-20 object-cover" />
                    <h3 className="text-[16px] font-[500] mt-3">{cat.name}</h3>
                  </div>
                  </Link>
                </SwiperSlide>
                );
            });
          })()}

        </Swiper>
      </div>
    </div>
  );
};

export default CategorySlider;
