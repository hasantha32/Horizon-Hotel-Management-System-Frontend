import {
  ProductType,
  Product,
  CreateProduct,
  Type,
  Author,
  Manufacturer,
  Category,
  Tag,
  AttachmentInput,
  VariationOption,
  Variation,
  AttributeValue,
} from '@/types';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import sum from 'lodash/sum';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { omitTypename } from '@/utils/omit-typename';
import { cartesian } from '@/utils/cartesian';

export type ProductFormValues = Omit<
  CreateProduct,
  | 'author_id'
  | 'type_id'
  | 'manufacturer_id'
  | 'shop_id'
  | 'categories'
  | 'tags'
  | 'digital_file'
> & {
  type: Pick<Type, 'id' | 'name'>;
  product_type: ProductTypeOption;
  author: Pick<Author, 'id' | 'name'>;
  manufacturer: Pick<Manufacturer, 'id' | 'name'>;
  categories: Pick<Category, 'id' | 'name'>[];
  tags: Pick<Tag, 'id' | 'name'>[];
  digital_file_input: AttachmentInput;
  is_digital: boolean;
  slug: string;
  in_flash_sale: boolean;
  variations?: AttributeValue[];
  variation_options?: Variation[];
  // image: AttachmentInput;
};

export type ProductTypeOption = {
  value: ProductType;
  name: string;
};
export const productTypeOptions: ProductTypeOption[] = Object.entries(
  ProductType
).map(([key, value]) => ({
  name: key,
  value,
}));

export function getFormattedVariations(variations: any) {
  console.log('getFormattedVariationsssssssssssssss: ', variations)
  const variationGroup = groupBy(variations, 'attribute.slug');
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.value })),
    };
  });
}

export function processOptions(options: any) {
  try {
    return JSON.parse(options);
  } catch (error) {
    return options;
  }
}

export function calculateMinMaxPrice(variationOptions: any) {
  if (!variationOptions || !variationOptions.length) {
    return {
      min_price: null,
      max_price: null,
    };
  }
  const sortedVariationsByPrice = orderBy(variationOptions, ['price']);
  const sortedVariationsBySalePrice = orderBy(variationOptions, ['sale_price']);
  return {
    min_price:
      sortedVariationsBySalePrice?.[0].sale_price <
      sortedVariationsByPrice?.[0]?.price
        ? sortedVariationsBySalePrice?.[0].sale_price
        : sortedVariationsByPrice?.[0]?.price,
    max_price:
      sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price,
  };
}

export function calculateQuantity(variationOptions: any) {
  return sum(
    variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
  );
}

export function getProductDefaultValues(
  product: Product,
  isNewTranslation: boolean = false
) {
  if (!product) {
    console.log('no product')
    return {
      product_type: productTypeOptions[0],
      min_price: 0.0,
      max_price: 0.0,
      categories: [],
      tags: [],
      in_stock: true,
      is_taxable: false,
      image: [],
      gallery: [],
      video: [],
      // isVariation: false,
      variations: [],
      variation_options: [],
    };
  }
  console.log('prodcuts: ', product)
  const {
    variations,
    variation_options,
    product_type,
    is_digital,
    digital_file,
  } = product;

  return cloneDeep({
    ...product,

    product_type: productTypeOptions.find(
      (option) => product_type === option.value
    ),

    ...(product_type === ProductType.Simple && {
      ...(is_digital && {
        digital_file_input: {
          id: digital_file?.attachment_id,
          thumbnail: digital_file?.url,
          original: digital_file?.url,
          file_name: digital_file?.file_name,
        },
      }),
    }),

    ...(product_type === ProductType.Variable && {
      variations: getFormattedVariations(variations),
      variation_options: variation_options?.map(({ image, ...option }: any) => {
        return {
          ...option,
          ...(!isEmpty(image) && { image: omitTypename(image) }),
          ...(option?.digital_file && {
            digital_file_input: {
              id: option?.digital_file?.attachment_id,
              thumbnail: option?.digital_file?.url,
              original: option?.digital_file?.url,
            },
          }),
        };
      }),
    }),
    // isVariation: variations?.length && variation_options?.length ? true : false,

    // Remove initial dependent value for new translation
    ...(isNewTranslation && {
      type: null,
      categories: [],
      author_id: null,
      manufacturer_id: null,
      tags: [],
      author: [],
      manufacturer: [],
      variations: [],
      variation_options: [],
      digital_file: '',
      digital_file_input: {},
      ...(product_type === ProductType.Variable && {
        quantity: null,
      }),
    }),
  });
}

export function filterAttributes(attributes: any, variations: any) {
  let res = [];
  res = attributes?.filter((el: any) => {
    return !variations?.find((element: any) => {
      return element?.attribute?.slug === el?.slug;
    });
  });
  return res;
}

export function getCartesianProduct(values: any) {
  const formattedValues = values
    ?.map((v: any) =>
      v?.value?.map((a: any) => ({
        name: v?.attribute?.name,
        value: a?.value,
        id: a?.id,
      }))
    )
    .filter((i: any) => i !== undefined);
  if (isEmpty(formattedValues)) return [];
  return cartesian(...formattedValues);
}

export function processFileWithName(file_input: any) {
  // Process Digital File Name section
  const splitArray = file_input?.original?.split('/');
  let fileSplitName = splitArray?.[splitArray?.length - 1]?.split('.');
  const fileType = fileSplitName?.pop(); // it will pop the last item from the fileSplitName arr which is the file ext
  const filename = fileSplitName?.join('.'); // it will join the array with dot, which restore the original filename

  return [
    {
      fileType: fileType,
      filename: filename,
    },
  ];
}

export function getProductInputValues(
  values: ProductFormValues,
  initialValues: any
) {
  const {
    product_type,
    type,
    quantity,
    author,
    manufacturer,
    image,
    is_digital,
    categories,
    tags,
    digital_file_input,
    variation_options,
    variations,
    in_flash_sale,
    ...simpleValues
  } = values;
  // const { locale } = useRouter();
  // const router = useRouter();
  const processedFile = processFileWithName(digital_file_input);

  return {
    ...simpleValues,
    is_digital,
    in_flash_sale,
    // language: router.locale,
    author_id: author?.id,
    manufacturer_id: manufacturer?.id,
    type: type?.id,
    product_type: product_type?.value,
    categories: categories.map((category) => category?.id),
    tags: tags.map((tag) => tag?.id),
    image: omitTypename<any>(image),
    gallery: values.gallery?.map((gi: any) => omitTypename(gi)),

    ...(product_type?.value === ProductType?.Simple && {
      quantity,
      ...(is_digital && {
        digital_file: {
          id: initialValues?.digital_file?.id,
          attachment_id: digital_file_input.id,
          url: digital_file_input.original,
          file_name:
            processedFile[0].filename + '.' + processedFile[0].fileType,
        },
      }),
    }),
    variations: [],
    variation_options: {
      upsert: [],
      delete: initialValues?.variation_options?.map(
        (variation: Variation) => variation?.id
      ),
    },
    ...(product_type?.value === ProductType?.Variable && {
      quantity: calculateQuantity(variation_options),
      variations: variations?.flatMap(({ value }: any) =>
        value?.map(({ id }: any) => ({ attribute_value_id: id }))
      ),
      variation_options: {
        // @ts-ignore
        upsert: variation_options?.map(
          ({
            options,
            id,
            digital_file,
            image: variationImage,
            digital_file_input: digital_file_input_,
            ...rest
          }: any) => ({
            ...(id !== '' ? { id } : {}),
            ...omit(rest, '__typename'),
            ...(!isEmpty(variationImage) && {
              image: omitTypename(variationImage),
            }),
            ...(rest?.is_digital && {
              digital_file: {
                id: digital_file?.id,
                attachment_id: digital_file_input_?.id,
                url: digital_file_input_?.original,
                file_name: digital_file?.file_name,
              },
            }),
            options: processOptions(options).map(
              ({ name, value }: VariationOption) => ({
                name,
                value,
              })
            ),
          })
        ),
        delete: initialValues?.variation_options
          ?.map((initialVariationOption: Variation) => {
            // @ts-ignore
            const find = variation_options?.find(
              (variationOption: Variation) =>
                variationOption?.id === initialVariationOption?.id
            );
            if (!find) {
              return initialVariationOption?.id;
            }
          })
          .filter((item?: number) => item !== undefined),
      },
    }),
    ...calculateMinMaxPrice(variation_options),
  };
}
