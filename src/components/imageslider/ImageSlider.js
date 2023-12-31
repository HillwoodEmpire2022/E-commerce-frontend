import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import './ImageSlider.css';

const ImageSlider = ({ ads }) => {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      autoplay={{
        delay: 5500,
        disableOnInteraction: true,
        waitForTransition: false,
        reverseDirection: false,
      }}
      modules={[Autoplay]}
      className="image-slider h-full"
    >
      {ads.map((ad, index) => (
        <SwiperSlide key={index}>
          <div className="slider-item">
            <img className='object-fit h-[15rem] rounded' src={ad.image} alt={ad.title} />
            <div className="slider-title">{ad.title}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
