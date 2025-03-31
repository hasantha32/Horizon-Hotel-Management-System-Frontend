import Image from 'next/image';
import { useModalState } from '@/components/ui/modal/modal.context';
import { useIsRTL } from '@/utils/locals';
import { ChevronLeft } from '@/components/icons/chevron-left';
import { ChevronRight } from '@/components/icons/chevron-right';
import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider';
import useSwiperRef from '@/utils/use-swiper-ref';

const RefundImageModal = () => {
  const { data } = useModalState();
  const { isRTL } = useIsRTL();

  const [nextEl, nextRef] = useSwiperRef<HTMLDivElement>();
  const [prevEl, prevRef] = useSwiperRef<HTMLDivElement>();

  return (
    <div className="m-auto block w-full max-w-[680px] rounded bg-light p-3">
      <div className="relative">
        <Swiper
          id="refund-gallery"
          modules={[Navigation]}
          initialSlide={data?.initSlide}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper?.navigation?.init();
            }, 100);
          }}
          loop={data?.images?.length > 1}
          navigation={{
            prevEl,
            nextEl,
          }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {data?.images?.map((item: any) => (
            <SwiperSlide
              key={`refund-gallery-${item.id}`}
              className="relative flex items-center justify-center selection:bg-transparent"
            >
              <Image
                src={item?.original ?? '/product-placeholder-borderless.svg'}
                alt={`Refund gallery ${item.id}`}
                width={800}
                height={800}
                className="object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {data?.images?.length > 1 && (
          <>
            <div
              ref={prevRef}
              className="absolute z-10 flex items-center justify-center w-8 h-8 -mt-4 transition-all duration-200 border rounded-full shadow-xl cursor-pointer refund-gallery-prev top-2/4 border-border-200 border-opacity-70 bg-light text-heading start-2 hover:bg-gray-100 md:-mt-5 md:h-9 md:w-9 md:start-3"
            >
              {isRTL ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </div>
            <div
              ref={nextRef}
              className="absolute z-10 flex items-center justify-center w-8 h-8 -mt-4 transition-all duration-200 border rounded-full shadow-xl cursor-pointer refund-gallery-next top-2/4 border-border-200 border-opacity-70 bg-light text-heading end-2 hover:bg-gray-100 md:-mt-5 md:h-9 md:w-9 md:end-3"
            >
              {isRTL ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RefundImageModal;
