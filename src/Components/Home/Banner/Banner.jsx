import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Banner = () => {

  const scrollDown = () => {
    window.scrollBy({
      top: 650,  
      behavior: "smooth"
    });
  };

  return (
    <div className="relative">
      <Swiper
        spaceBetween={30}
        effect={'fade'}
        navigation={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide >
          <img
            className='w-full md:h-[520px]'
            src="https://i.ibb.co.com/sJ5TjPRT/digital-learning-web-banner-design-students-study-with-mobile-phone-during-online-class-online-educa.jpg"
          />
        </SwiperSlide>

        <SwiperSlide >
          <img
            className='w-full md:h-[520px]'
            src="https://i.ibb.co.com/NgvNY06y/learning-and-education-web-banner-design-free-vector.jpg"
          />
        </SwiperSlide>

        <SwiperSlide >
          <img
            className='w-full md:h-[520px]'
            src="https://i.ibb.co.com/N2Bxj21L/e-learning-web-banner-design-students-take-online-tests-during-online-classes-online-education-digit.jpg"
          />
        </SwiperSlide>
      </Swiper>

      {/* Scroll Down Button */}
      <button
        onClick={scrollDown}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-base-100 p-3 rounded-full shadow-lg animate-bounce text-base-700 z-50"
      >
        ⬇
      </button>
    </div>
  );
};

export default Banner;
