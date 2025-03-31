export const Routes = {
  dashboard: '/',
  login: '/login',
  logout: '/logout',
  register: '/register',
  // forgotPassword: '/forgot-password',
  // resetPassword: '/reset-password',
  // adminMyShops: '/my-shops',
  // profile: '/profile',
  // verifyCoupons: '/coupons/verify',
  settings: '/settings',
  // paymentSettings: '/settings/payment',
  // seoSettings: '/settings/seo',
  // eventSettings: '/settings/events',
  // shopSettings: '/settings/shop',
  // companyInformation: '/settings/company-information',
  // maintenance: '/settings/maintenance',
  // promotionPopup: '/settings/promotion-popup',
  // storeSettings: '/vendor/settings',
  // storeKeepers: '/vendor/store_keepers',
  profileUpdate: '/profile-update',
  checkout: '/orders/checkout',
  bookingCheckout: '/bookings/checkout',
  bookingCustomerCheckout: '/bookings/customer-checkout',
  // verifyEmail: '/verify-email',
  // verifyLicense: '/verify-license',
  user: {
    ...routesFactory('/users'),
  },
  // type: {
  //   ...routesFactory('/groups'),
  // },
  // category: {
  //   ...routesFactory('/categories'),
  // },
  // attribute: {
  //   ...routesFactory('/attributes'),
  // },
  // attributeValue: {
  //   ...routesFactory('/attribute-values'),
  // },
  // tag: {
  //   ...routesFactory('/tags'),
  // },
  // reviews: {
  //   ...routesFactory('/reviews'),
  // },
  // abuseReviews: {
  //   ...routesFactory('/abusive_reports'),
  // },
  // abuseReviewsReport: {
  //   ...routesFactory('/abusive_reports/reject'),
  // },
  // author: {
  //   ...routesFactory('/authors'),
  // },
  // coupon: {
  //   ...routesFactory('/coupons'),
  // },
  // manufacturer: {
  //   ...routesFactory('/manufacturers'),
  // },
  // order: {
  //   ...routesFactory('/orders'),
  // },
  // orderStatus: {
  //   ...routesFactory('/order-status'),
  // },
  // orderCreate: {
  //   ...routesFactory('/orders/create'),
  // },
  // product: {
  //   ...routesFactory('/products'),
  // },
  shop: {
    ...routesFactory('/shops'),
  },
  bookings: {
    ...routesFactory('/bookings'),
  },
  roomCategories: {
    ...routesFactory('/room-categories'),
  },
  room: {
    ...routesFactory('/rooms'),
  },
  // tax: {
  //   ...routesFactory('/taxes'),
  // },
  // shipping: {
  //   ...routesFactory('/shippings'),
  // },
  // withdraw: {
  //   ...routesFactory('/withdraws'),
  // },
  // staff: {
  //   ...routesFactory('/staffs'),
  // },
  // refund: {
  //   ...routesFactory('/refunds'),
  // },
  // question: {
  //   ...routesFactory('/questions'),
  // },
  // message: {
  //   ...routesFactory('/message'),
  // },
  // shopMessage: {
  //   ...routesFactory('/shop-message'),
  // },
  // conversations: {
  //   ...routesFactory('/message/conversations'),
  // },
  // storeNotice: {
  //   ...routesFactory('/store-notices'),
  // },
  // storeNoticeRead: {
  //   ...routesFactory('/store-notices/read'),
  // },
  // notifyLogs: {
  //   ...routesFactory('/notify-logs'),
  // },
  faqs: {
    ...routesFactory('/faqs'),
  },
  // refundPolicies: {
  //   ...routesFactory('/refund-policies'),
  // },
  // refundReasons: {
  //   ...routesFactory('/refund-reasons'),
  // },
  // newShops: '/new-shops',
  // draftProducts: '/products/draft',
  // outOfStockOrLowProducts: '/products/product-stock',
  // productInventory: '/products/inventory',
  // transaction: '/orders/transaction',
  // termsAndCondition: {
  //   ...routesFactory('/terms-and-conditions'),
  // },
  hotelDetails: '/hotels',
  customerBookingCreate: '/bookings/customer-create',
  adminList: '/users/admins',
  myBookings: '/bookings/my-bookings',
  // vendorList: '/users/vendors',
  // pendingVendorList: '/users/vendors/pending',
  // customerList: '/users/customer',
  // myStaffs: '/users/my-staffs',
  // vendorStaffs: '/users/vendor-staffs',
  // flashSale: {
  //   ...routesFactory('/flash-sale'),
  // },
  // ownerDashboardNotice: '/notice',
  // ownerDashboardMessage: '/owner-message',
  // ownerDashboardMyShop: '/my-shop',
  // myProductsInFlashSale: '/flash-sale/my-products',
  // ownerDashboardNotifyLogs: '/notify-logs',
  // inventory: {
  //   editWithoutLang: (slug: string, shop?: string) => {
  //     return shop ? `/${shop}/products/${slug}/edit` : `/products/${slug}/edit`;
  //   },
  //   edit: (slug: string, language: string, shop?: string) => {
  //     return shop
  //       ? `/${language}/${shop}/products/${slug}/edit`
  //       : `/${language}/products/${slug}/edit`;
  //   },
  //   translate: (slug: string, language: string, shop?: string) => {
  //     return shop
  //       ? `/${language}/${shop}/products/${slug}/translate`
  //       : `/${language}/products/${slug}/translate`;
  //   },
  // },
  visitStore: (slug: string) => `${process.env.NEXT_PUBLIC_SHOP_URL}/${slug}`,
  // vendorRequestForFlashSale: {
  //   ...routesFactory('/flash-sale/vendor-request'),
  // },
};

function routesFactory(endpoint: string) {
  return {
    list: `${endpoint}`,
    create: `${endpoint}/create`,
    editWithoutLang: (slug: string, shop?: string) => {
      return shop
        ? `/${shop}${endpoint}/${slug}/edit`
        : `${endpoint}/${slug}/edit`;
    },
    edit: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/edit`
        : `${language}${endpoint}/${slug}/edit`;
    },
    translate: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/translate`
        : `${language}${endpoint}/${slug}/translate`;
    },
    details: (slug: string) => `${endpoint}/${slug}`,
    editByIdWithoutLang: (id: string, shop?: string) => {
      return shop ? `/${shop}${endpoint}/${id}/edit` : `${endpoint}/${id}/edit`;
    },
  };
}
