import React, { useState, useEffect, useContext } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import axios from "axios";
import { MyContext } from "../../App";

const HomeSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { AppUrl } = useContext(MyContext);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${AppUrl}/api/banners/active`);
        if (response.status === 200) {
          setBanners(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [AppUrl]);

  if (loading) {
    return (
      <div className="homeSlider py-4">
        <div className="container mx-auto px-4">
          <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] bg-gray-200 animate-pulse rounded-[10px] sm:rounded-[20px]"></div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="homeSlider py-4">
      <div className="container mx-auto px-4">
        <Swiper
          spaceBetween={10}
          navigation={{
            enabled: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 5,
              navigation: { enabled: false }, 
            },
            640: {
              slidesPerView: 1, 
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 1, 
              spaceBetween: 10,
            },
          }}
          modules={[Autoplay, Navigation]}
          className="sliderHome"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner._id || index}>
              <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden">
                {banner.link ? (
                  <a href={banner.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={banner.image}
                      alt={banner.title || "Banner"}
                      className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                ) : (
                  <img
                    src={banner.image}
                    alt={banner.title || "Banner"}
                    className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;