import React, { useRef, useState } from "react";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { useEventCallback } from "@mui/material";
import { useEffect } from "react";
const ProductZoom = ({data}) => {
    const filterData = data
    const [SliderIndex,setSlideIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(`${filterData.images[SliderIndex]}`);
    
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const goto =(index) =>{
    setSlideIndex(index)
    zoomSliderSml.current.swiper.slideTo(index)
    zoomSliderBig.current.swiper.slideTo(index)

  }

  useEffect(()=>{
    if (data?.images?.length) {
        setSelectedImage(data.images[0]); 
    }
  },[data])

  return (


    <>
    <div className="flex gap-3">
        <div className="slider w-[18%]">
            <Swiper
                slidesPerView={4}
                ref={zoomSliderSml}
                spaceBetween={10}
                navigation={true}
                direction={'vertical'}
                modules={[Navigation]}
                className="zoomProductsSliderThumbs sm:w-[87%] h-[500px] overflow-hidden cursor-pointer"
            >
                <SwiperSlide>
                    <div  onClick={()=>goto(0)} className={`item rounded-md overflow-hidden cursor-pointer group  ${SliderIndex===0 ? 'opacity-1' : 'opacity-30'}`}>
                    <img onClick={()=>setSelectedImage(`${filterData.images[0]}`)} src={`${filterData.images[0]}`} className="w-full transition-all duration-300 group-hover:scale-105"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                <div onClick={()=>goto(1)} className={`item rounded-md overflow-hidden cursor-pointer group  ${SliderIndex===1 ? 'opacity-1' : 'opacity-30'}`}>
                <img onClick={()=>setSelectedImage(`${filterData.images[1]}`)} src={`${filterData.images[1]}`} className="w-full transition-all duration-300 group-hover:scale-105"/>
                
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                <div onClick={()=>goto(2)} className={`item rounded-md overflow-hidden cursor-pointer group  ${SliderIndex===2 ? 'opacity-1' : 'opacity-30'}`}>
                <img onClick={()=>setSelectedImage(`${filterData.images[2]}`)} src={`${filterData.images[2]}`} className="w-full transition-all duration-300 group-hover:scale-105"/>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
        <div className="zoomContainer  w-[80%]">
            <Swiper
            ref={zoomSliderBig}
                slidesPerView={1}
                spaceBetween={10}
                navigation={false}
            >
                <SwiperSlide>
                <InnerImageZoom zoomType="hover" zoomScale={1} src={selectedImage} />
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
    </>
  );
};

export default ProductZoom;
