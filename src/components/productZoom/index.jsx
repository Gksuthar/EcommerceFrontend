import React, { useRef, useState } from "react";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useEffect } from "react";

const ProductZoom = ({ data }) => {
    const filterData = data;
    const [SliderIndex, setSlideIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(filterData?.images?.[0] || '');

    const zoomSliderBig = useRef();
    const zoomSliderSml = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        if (zoomSliderSml.current?.swiper) {
            zoomSliderSml.current.swiper.slideTo(index);
        }
        if (zoomSliderBig.current?.swiper) {
            zoomSliderBig.current.swiper.slideTo(index);
        }
        setSelectedImage(filterData.images[index]);
    };

    useEffect(() => {
        if (data?.images?.length) {
            setSelectedImage(data.images[0]);
        }
    }, [data]);

    return (
        <div className="flex gap-4 h-full">
            <div className="w-[100px] flex-shrink-0">
                <Swiper
                    slidesPerView={4}
                    ref={zoomSliderSml}
                    spaceBetween={12}
                    direction={"vertical"}
                    className="h-[500px] overflow-hidden"
                >
                    {filterData?.images?.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div
                                onClick={() => goto(index)}
                                className={`rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:border-primary ${
                                    SliderIndex === index
                                        && 'border-primary opacity-100 shadow-md'                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="w-full h-full flex items-center justify-center p-4">
                    <InnerImageZoom
                        src={selectedImage}
                        zoomSrc={selectedImage}
                        zoomType="hover"
                        zoomPreload={true}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductZoom;
