import React from 'react'
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import {Link} from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import BannerBox from '../bannerBox';

const AdsBannerSliderV2 = ({items}) => {
  return (
    <div className='py-5 w-full'>
        <Swiper
        slidesPerView={items}
        spaceBetween={15}
        navigation={true}
        freeMode={true}
        modules={[Navigation]}
        className="AdvBannerSlider"
      >

        <SwiperSlide>
            <BannerBox img={'https://res.cloudinary.com/dsu49fx2b/image/upload/v1764643127/1764511247_Best_Of_Home_essentials_nqye0s.jpg'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'https://res.cloudinary.com/dsu49fx2b/image/upload/v1764643126/1764511386_Hot_Winter_Glam_b8newj.webp'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'https://res.cloudinary.com/dsu49fx2b/image/upload/v1764643185/1764511276_iPhone_16_gcc2g5.webp'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'https://www.jiomart.com/images/cms/aw_rbslider/slides/1738299165_Dryfruits_Spices.jpg?im=Resize=(768,448)'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'https://www.jiomart.com/images/cms/aw_rbslider/slides/1738691852_moto.jpg?im=Resize=(768,448)'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'https://www.jiomart.com/images/cms/aw_rbslider/slides/1738330753_HPMC--14-.jpg?im=Resize=(768,448)'}/>
        </SwiperSlide>

        </Swiper>
    </div>
  )
}

export default AdsBannerSliderV2
