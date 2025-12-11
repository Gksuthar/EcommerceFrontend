import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import HomeSlider from "../../components/HomeSlider";
import CategorySlider from "../../components/CatSlider";
import { TbTruckDelivery } from "react-icons/tb";
import AdsBannerSlider from "../../components/AdsBannerSlider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import ProductsSlider from "../../components/ProductsSlider";
import BlogItem from "../../components/BlogItem";
import AdsBannerSliderV2 from "../../components/AdsBannerSliderV2";
import FeatureProduct from "../../components/FeautureProduct";
import { MyContext } from "../../App";

const Home = () => {
  const [value, setValue] = useState(0);
  const context = useContext(MyContext);
  const [selectedTab, setSelectedTab] = useState(context.categoryData?.[0]?.name || "Electronics");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (context.categoryData?.[0]?.name) {
      setSelectedTab(context.categoryData[0].name);
    }
  }, [context.categoryData]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${context.AppUrl}/api/blog`);
        if (response.status === 200) setBlogs(response.data.data || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };
    fetchBlogs();
  }, [context.AppUrl]);

  const handleChangeCategory = (event, indx) => {
    
    setSelectedTab(context.categoryData[indx].name);
    setValue(indx);
  };

  return (
    <div>
      <HomeSlider />
      <CategorySlider />

      {/* Free Shipping Section and banner */}
      <section className="sm:py-16 py-6 bg-white">
        <div className="container">
          <div className="freShipping w-full p-4 border border-[red] rounded-md py-4 flex items-center justify-between mb-7">
            <div className="col1 flex items-center gap-4">
              <TbTruckDelivery className="text-[50px]" />
              <span className="text-[20px] font-[600] uppercase">
                Free Shipping
              </span>
            </div>
            <div className="col flex items-center gap-4">
              <p className="mb-0 font-[500]">
                Free Delivery Now On Your First Order and over $200
              </p>
            </div>
            <div className="hidden sm:block col3">
              <p className="font-bold text-[25px] uppercase">- Only $200*</p>
            </div>
          </div>
          <AdsBannerSlider items={4} />
        </div>
      </section>
      
    {/* {popular product list} */}
      <section className="bg-white  sm:py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="lestSec !mb-3 ">
              <h2 className="text-[18px] sm:text-[25px] font-[600]">
                Popular Product
              </h2>
              <p className="text-[15px] mt-1 sm:text-[16px] font-[500]">
                Do not miss the current Offer until end of March
              </p>
            </div>

            <div className="rightSecreenCat w-[100%] sm:w-[60%] flex sm:justify-end">
              <Tabs
                value={value}
                onChange={handleChangeCategory}
                variant="scrollable"
                scrollButtons={false}
                allowScrollButtonsMobile
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "red",
                  },
                  "& .Mui-selected": {
                    color: "red !important",
                  },
                }}
              >
                {context.categoryData &&
                  context.categoryData.map((item, indx) => (
                    <Tab key={indx} label={item.name} />
                  ))}
              </Tabs>
            </div>
          </div>
        </div>
        <ProductsSlider items={6} selectedTab={selectedTab} />
      </section>

                  {/*Latest Product List  */}
      <section className="pt-2 bg-white">
        <div className="container">
          <h2 className="text-[25px] font-[600]">Latest Product</h2>
        </div>
        <ProductsSlider items={6} selectedTab={selectedTab} />
      </section>

{/* Feature  Product List and AdsSlider */}
      <section className="pt-2 bg-white">
        <div className="container">
          <h2 className="text-[25px] font-[600]">Featured Product</h2>
        </div>
        <FeatureProduct items={6} />
        <div className="container">
          <AdsBannerSliderV2 items={3} />
        </div>
      </section>

      {/* Blog Data */}
      <section className="py-5 pt-0 bg-white blogSection">
        <div className="container">
          <h2 className="text-[25px] font-[600]">From The Blog</h2>
          <Swiper
            spaceBetween={30}
            navigation={true}
            freeMode={true}
            modules={[Navigation]}
            className="blogSlider"
            breakpoints={{
              320: { slidesPerView: 2 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {blogs.length > 0 ? (
              blogs.map((post) => (
                <SwiperSlide key={post._id}>
                  <BlogItem post={post} />
                </SwiperSlide>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <SwiperSlide key={i}>
                  <BlogItem />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </section>
      <br />
    </div>
  );
};

export default Home;
