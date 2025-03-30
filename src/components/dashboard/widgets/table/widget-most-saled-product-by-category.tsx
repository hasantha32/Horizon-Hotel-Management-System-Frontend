import Image from 'next/image';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import cn from 'classnames';
import { Swiper, SwiperSlide, Pagination } from '@/components/ui/slider';
import { Product, ProductType } from '@/types';

import { StarIcon } from '@/components/icons/star-icon';

// get rating calculation
function getRating(rating: any) {
  return (
    <div className="flex items-center gap-1">
      {[...new Array(5)].map((arr, index) => {
        return index < Math.round(rating) ? (
          <StarIcon className="w-4 text-yellow-500" />
        ) : (
          <StarIcon className="w-4 text-gray-300" key={index} />
        );
      })}{' '}
    </div>
  );
}

function SoldProductCard({ product }: { product: Product }) {
  const {
    name,
    image,
    product_type,
    type,
    price,
    max_price,
    min_price,
    sale_price,
  } = product ?? {};

  const {
    price: currentPrice,
    basePrice,
    discount,
  } = usePrice({
    amount: sale_price ? sale_price : price!,
    baseAmount: price ?? 0,
  });
  const { price: minPrice } = usePrice({
    amount: min_price ?? 0,
  });
  const { price: maxPrice } = usePrice({
    amount: max_price ?? 0,
  });

  return (
    <div className="">
      <div className="relative flex justify-center overflow-hidden border shrink-0 rounded-xl border-border-200/60">
        <Image
          alt={name}
          src={image?.original ?? siteSettings.product.placeholder}
          width={type?.name !== 'Books' ? 435 : 295}
          height={type?.name !== 'Books' ? 435 : 340}
          priority={true}
          sizes="(max-width: 768px) 100vw"
        />
      </div>
      <div className="flex items-start justify-between pt-4">
        <div className="w-full max-w-[calc(100%-120px)]">
          <h4 className="mb-0.5 truncate text-lg font-medium text-heading">
            {name}
          </h4>
          <p className="mb-3 truncate text-[15px] font-normal text-gray-500">
            {product.description}
          </p>
          {getRating(product.ratings)}
        </div>
        {product_type === ProductType.Variable ? (
          <div className="max-w-[120px] shrink-0 text-end">
            <span className="text-base font-semibold text-heading">
              {minPrice}
            </span>
            <span> - </span>
            <span className="text-base font-semibold text-heading">
              {maxPrice}
            </span>
          </div>
        ) : (
          <div className="flex max-w-[120px] shrink-0 items-center text-end">
            <span className="text-base font-semibold text-heading">
              {currentPrice}
            </span>
            {basePrice && (
              <del className="text-xs text-muted ms-2 md:text-base">
                {basePrice}
              </del>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export type IProps = {
  products: Product[] | undefined;
  title: string;
  className?: string;
};

const ProductCountByCategory = ({ products, title, className }: IProps) => {
  return (
    <>
      <div
        className={cn(
          'overflow-hidden rounded-lg bg-white p-6 md:p-7',
          className,
        )}
      >
        <div className="flex items-center justify-between mb-5 md:mb-7">
          <h3 className="before:content-'' relative mt-1.5 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {title}
          </h3>
        </div>
        <Swiper
          id="sold-products-gallery"
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {products?.map((product: Product) => (
            <SwiperSlide key={`sold-gallery-${product.id}`}>
              <SoldProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductCountByCategory;
