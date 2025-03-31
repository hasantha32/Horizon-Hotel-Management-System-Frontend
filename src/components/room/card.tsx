import Image from "next/image";
import usePrice from "@/utils/use-price";
import { productPlaceholder } from "@/utils/placeholders";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { AddToCart } from "@/components/cart/add-to-cart/add-to-cart";
import { useTranslation } from "next-i18next";
import { PlusIcon } from "@/components/icons/plus-icon";
import { Product, ProductType, Room } from "@/types";
import { AddRoom } from "@/components/cart/add-room/add-room";

interface Props {
  room: Room;
}

const RoomCard = ({ room }: Props) => {
  const { t } = useTranslation();
  const { room_number, image, is_available, category, price } = room ?? {};

  const { openModal } = useModalAction();

  // function handleVariableProduct() {
  //   return openModal('SELECT_PRODUCT_VARIATION', slug);
  // }
  const { price: totalPrice } = usePrice({
    amount: Number(price),
  });

  return (
    <div className="cart-type-neon h-full overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:shadow-md">
      {/* <h3>{name}</h3> */}

      <div
        className="relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64"
        // onClick={handleVariableProduct}
      >
        <span className="sr-only">{t("text-product-image")}</span>
        <Image
          src={image?.original ?? productPlaceholder}
          alt={room_number}
          fill
          sizes="(max-width: 768px) 100vw"
          className="product-image object-contain"
        />
        {/* {discount && (
          <div className="absolute top-3 rounded bg-accent px-1.5 text-xs font-semibold leading-6 text-light end-3 sm:px-2 md:top-4 md:px-2.5 md:end-4">
            {discount}
          </div>
        )} */}
      </div>

      <header className="p-3 md:p-6">
        {/* {product_type === ProductType.Variable ? (
          <div className="mb-2">
            <span className="text-sm font-semibold text-heading md:text-base">
              {minPrice}
            </span>
            <span> - </span>
            <span className="text-sm font-semibold text-heading md:text-base">
              {maxPrice}
            </span>
          </div>
        ) : (
          <div className="mb-2 flex items-center">
            <span className="text-sm font-semibold text-heading md:text-base">
              {currentPrice}
            </span>
            {basePrice && (
              <del className="text-xs text-muted ms-2 md:text-sm">
                {basePrice}
              </del>
            )}
          </div>
        )} */}

        <h3 className="mb-4 truncate text-xs text-body md:text-sm">
          {totalPrice}
        </h3>
        <h3 className="mb-4 truncate text-xs text-body md:text-sm">
           {category} {`No. ${room_number}`}
        </h3>
        {/* {product_type === ProductType.Variable ? (
          <>
            {Number(quantity) > 0 && (
              <button
                onClick={handleVariableProduct}
                className="group flex h-7 w-full items-center justify-between rounded bg-gray-100 text-xs text-body-dark transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:text-sm"
              >
                <span className="flex-1">{t('text-add')}</span>
                <span className="grid h-7 w-7 place-items-center bg-gray-200 transition-colors duration-200 rounded-te rounded-be group-hover:bg-accent-600 group-focus:bg-accent-600 md:h-9 md:w-9">
                  <PlusIcon className="h-4 w-4 stroke-2" />
                </span>
              </button>
            )}
          </>
        ) : (
          <>
            {Number(quantity) > 0 && <AddToCart variant="neon" data={item} />}
          </>
        )} */}

        {!is_available ? (
          <div className="rounded bg-red-500 px-3 py-2.5 text-xs text-light">
            {t("text-reserved")}
          </div>
        ) : (
          <AddRoom variant="neon" data={room} />
        )}
      </header>
    </div>
  );
};

export default RoomCard;
