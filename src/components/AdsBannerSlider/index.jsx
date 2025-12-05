import React from 'react'
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import {Link} from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import BannerBox from '../bannerBox';

const AdsBannerSlider = ({items}) => {
  return (
    <div className='py-1 sm:py-5 w-full  overflow-x-hidden'>
        <Swiper
        slidesPerView={items}
        spaceBetween={15}
        navigation={true}
        freeMode={true}
        modules={[Navigation]}
        className="AdvBannerSlider"
        breakpoints={{
            0: {
              slidesPerView: 2,
            },
            480: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
      >

        <SwiperSlide>
            <BannerBox img={'https://www.jiomart.com/images/cms/aw_rbslider/slides/1738577224_Biryani_banner.jpg?im=Resize=(768,448)'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'https://www.jiomart.com/images/cms/aw_rbslider/slides/1738299205_Hot_Food.jpg?im=Resize=(768,448)'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'https://www.jiomart.com/images/cms/aw_rbslider/slides/1738298077_mumbia.jpg?im=Resize=(768,448)'}/>
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

export default AdsBannerSlider
