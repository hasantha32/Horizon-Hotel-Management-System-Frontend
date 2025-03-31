import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  ownerAndStaffOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';

export const siteSettings = {
  name: 'PickBazar',
  description: '',
  logo: {
    url: '/logo.svg',
    alt: 'PickBazar',
    href: '/',
    width: 138,
    height: 34,
  },
  collapseLogo: {
    url: '/collapse-logo.svg',
    alt: 'P',
    href: '/',
    width: 32,
    height: 32,
  },
  defaultLanguage: 'en',
  author: {
    name: 'RedQ',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: Routes.profileUpdate,
      labelTransKey: 'authorized-nav-item-profile',
      icon: 'UserIcon',
      permission: adminOwnerAndStaffOnly,
    },
    {
      href: Routes.shop.create,
      labelTransKey: 'common:text-create-shop',
      icon: 'ShopIcon',
      permission: adminAndOwnerOnly,
    },

    {
      href: Routes.settings,
      labelTransKey: 'authorized-nav-item-settings',
      icon: 'SettingsIcon',
      permission: adminOnly,
    },
    {
      href: Routes.logout,
      labelTransKey: 'authorized-nav-item-logout',
      icon: 'LogOutIcon',
      permission: adminOwnerAndStaffOnly,
    },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: {
      root: {
        href: Routes.dashboard,
        label: 'Main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: Routes.dashboard,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
          },
        ],
      },
      hotel: {
        href: Routes.hotelDetails,
        label: 'Hotel Management',
        icon: 'ShopIcon',
        childMenu: [
            {
              href: Routes.hotelDetails,
              label: 'Hotel Details',
              icon: 'ShopIcon',
            },
        ],
      },
      booking: {
        href: '',
        label: 'text-booking-management',
        icon: 'OrdersIcon',
        childMenu: [
            {
              href: '',
              label: 'sidebar-nav-item-bookings',
              icon: 'OrdersIcon',
              childMenu: [
                {
                  href: Routes.bookings.list,
                  label: 'All bookings',
                  icon: 'OrdersIcon',
                },
                {
                  href: Routes.bookings.create,
                  label: 'Create booking',
                  icon: 'OrdersIcon',
                },
              ],
            },
        ],
      },

      room: {
        href: '',
        label: 'text-room-management',
        icon: 'ShopIcon',
        childMenu: [
            {
              href: '',
              label: 'sidebar-nav-item-room-categories',
              icon: 'ShopIcon',
              childMenu: [
                {
                  href: Routes.roomCategories.list,
                  label: 'All room categories',
                  icon: 'MyShopIcon',
                },
                {
                  href: Routes.roomCategories.create,
                  label: 'Add new room category',
                  icon: 'ShopIcon',
                },
              ],
            },
          {
            href: '',
            label: 'sidebar-nav-item-rooms',
            icon: 'ShopIcon',
            childMenu: [
              {
                href: Routes.room.list,
                label: 'text-all-rooms',
                icon: 'MyShopIcon',
              },
              {
                href: Routes.room.create,
                label: 'text-add-all-rooms',
                icon: 'ShopIcon',
              },
            ],
          },
        ],
      },

      // shop: {
      //   href: '',
      //   label: 'text-shop-management',
      //   icon: 'ShopIcon',
      //   childMenu: [
      //     {
      //       href: '',
      //       label: 'sidebar-nav-item-shops',
      //       icon: 'ShopIcon',
      //       childMenu: [
      //         {
      //           href: Routes.shop.list,
      //           label: 'text-all-shops',
      //           icon: 'MyShopIcon',
      //         },
      //         {
      //           href: Routes.shop.create,
      //           label: 'text-add-all-shops',
      //           icon: 'ShopIcon',
      //         },
      //         {
      //           href: Routes.newShops,
      //           label: 'text-inactive-shops',
      //           icon: 'MyShopIcon',
      //         },
      //       ],
      //     },
      //     {
      //       href: Routes.adminMyShops,
      //       label: 'sidebar-nav-item-my-shops',
      //       icon: 'MyShopIcon',
      //     },
      //   ],
      // },

      // product: {
      //   href: '',
      //   label: 'text-product-management',
      //   icon: 'ProductsIcon',
      //   childMenu: [
      //     {
      //       href: '',
      //       label: 'sidebar-nav-item-products',
      //       icon: 'ProductsIcon',
      //       childMenu: [
      //         {
      //           href: Routes.product.list,
      //           label: 'text-all-products',
      //           icon: 'ProductsIcon',
      //         },
      //         {
      //           href: Routes.product.create,
      //           label: 'Add new product',
      //           icon: 'ProductsIcon',
      //         },
      //         {
      //           href: Routes.draftProducts,
      //           label: 'text-my-draft-products',
      //           icon: 'ProductsIcon',
      //         },
      //         {
      //           href: Routes.outOfStockOrLowProducts,
      //           label: 'text-all-out-of-stock',
      //           icon: 'ProductsIcon',
      //         },
      //       ],
      //     },
      //     {
      //       href: Routes.productInventory,
      //       label: 'text-inventory',
      //       icon: 'InventoryIcon',
      //     },
      //     {
      //       href: Routes.category.list,
      //       label: 'sidebar-nav-item-categories',
      //       icon: 'CategoriesIcon',
      //     },
      //     {
      //       href: Routes.tag.list,
      //       label: 'sidebar-nav-item-tags',
      //       icon: 'TagIcon',
      //     },
      //     {
      //       href: Routes.attribute.list,
      //       label: 'sidebar-nav-item-attributes',
      //       icon: 'AttributeIcon',
      //     },
      //     {
      //       href: Routes.manufacturer.list,
      //       label: 'sidebar-nav-item-manufacturers',
      //       icon: 'ManufacturersIcon',
      //     },
      //     {
      //       href: Routes.author.list,
      //       label: 'sidebar-nav-item-authors',
      //       icon: 'AuthorIcon',
      //     },
      //   ],
      // },

      // financial: {
      //   href: '',
      //   label: 'text-e-commerce-management',
      //   icon: 'WithdrawIcon',
      //   childMenu: [
      //     {
      //       href: Routes.tax.list,
      //       label: 'sidebar-nav-item-taxes',
      //       icon: 'TaxesIcon',
      //     },
      //     {
      //       href: Routes.shipping.list,
      //       label: 'sidebar-nav-item-shippings',
      //       icon: 'ShippingsIcon',
      //     },
      //     {
      //       href: Routes.withdraw.list,
      //       label: 'sidebar-nav-item-withdraws',
      //       icon: 'WithdrawIcon',
      //     },
      //     {
      //       href: '',
      //       label: 'sidebar-nav-item-refunds',
      //       icon: 'RefundsIcon',
      //       childMenu: [
      //         {
      //           href: Routes.refund.list,
      //           label: 'text-reported-refunds',
      //           icon: 'RefundsIcon',
      //         },
      //         {
      //           href: Routes.refundPolicies.list,
      //           label: 'sidebar-nav-item-refund-policy',
      //           icon: 'AuthorIcon',
      //         },
      //         {
      //           href: Routes.refundPolicies.create,
      //           label: 'text-new-refund-policy',
      //           icon: 'RefundsIcon',
      //         },
      //         {
      //           href: Routes.refundReasons.list,
      //           label: 'text-refund-reasons',
      //           icon: 'RefundsIcon',
      //         },
      //         {
      //           href: Routes.refundReasons.create,
      //           label: 'text-new-refund-reasons',
      //           icon: 'RefundsIcon',
      //         },
      //       ],
      //     },
      //   ],
      // },

      // order: {
      //   href: Routes.order.list,
      //   label: 'text-order-management',
      //   icon: 'OrdersIcon',
      //   childMenu: [
      //     {
      //       href: Routes.order.list,
      //       label: 'sidebar-nav-item-orders',
      //       icon: 'OrdersIcon',
      //     },
      //     {
      //       href: Routes.order.create,
      //       label: 'sidebar-nav-item-create-order',
      //       icon: 'CreateOrderIcon',
      //     },
      //     {
      //       href: Routes.transaction,
      //       label: 'text-transactions',
      //       icon: 'TransactionsIcon',
      //     },
      //     // {
      //     //   href: '',
      //     //   label: 'Order tracking',
      //     //   icon: 'OrderTrackingIcon',
      //     // },
      //     // {
      //     //   href: '',
      //     //   label: 'Delivery policies',
      //     //   icon: 'ShippingsIcon',
      //     // },
      //     // {
      //     //   href: '',
      //     //   label: 'Cancelation policies',
      //     //   icon: 'CancelationIcon',
      //     // },
      //   ],
      // },

      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: '',
            label: 'Users',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: Routes.user.list,
                label: 'text-all-users',
                icon: 'UsersIcon',
              },
              // {
              //   href: Routes.user.create,
              //   label: 'text-pending-vendors',
              //   icon: 'UsersIcon',
              // },
            ],
          },
          {
            href: Routes.adminList,
            label: 'Admins',
            icon: 'AdminListIcon',
          },
          // {
          //   href: '',
          //   label: 'text-vendors',
          //   icon: 'VendorsIcon',
          //   childMenu: [
          //     {
          //       href: Routes.vendorList,
          //       label: 'text-all-vendors',
          //       icon: 'UsersIcon',
          //     },
          //     {
          //       href: Routes.pendingVendorList,
          //       label: 'text-pending-vendors',
          //       icon: 'UsersIcon',
          //     },
          //   ],
          // },
          // {
          //   href: '',
          //   label: 'sidebar-nav-item-staffs',
          //   icon: 'StaffIcon',
          //   childMenu: [
          //     {
          //       href: Routes.myStaffs,
          //       label: 'sidebar-nav-item-my-staffs',
          //       icon: 'UsersIcon',
          //     },
          //     {
          //       href: Routes.vendorStaffs,
          //       label: 'sidebar-nav-item-vendor-staffs',
          //       icon: 'UsersIcon',
          //     },
          //   ],
          // },
          // {
          //   href: Routes.customerList,
          //   label: 'text-customers',
          //   icon: 'CustomersIcon',
          // },
        ],
      },

      // feedback: {
      //   href: '',
      //   label: 'text-feedback-control',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: Routes.reviews.list,
      //       label: 'sidebar-nav-item-reviews',
      //       icon: 'ReviewIcon',
      //     },
      //     {
      //       href: Routes.question.list,
      //       label: 'sidebar-nav-item-questions',
      //       icon: 'QuestionIcon',
      //     },
      //   ],
      // },

      // promotional: {
      //   href: '',
      //   label: 'text-promotional-management',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: '',
      //       label: 'sidebar-nav-item-coupons',
      //       icon: 'CouponsIcon',
      //       childMenu: [
      //         {
      //           href: Routes.coupon.list,
      //           label: 'text-all-coupons',
      //           icon: 'CouponsIcon',
      //         },
      //         {
      //           href: Routes.coupon.create,
      //           label: 'text-new-coupon',
      //           icon: 'CouponsIcon',
      //         },
      //       ],
      //     },
      //     {
      //       href: '',
      //       label: 'text-flash-sale',
      //       icon: 'FlashDealsIcon',
      //       childMenu: [
      //         {
      //           href: Routes.flashSale.list,
      //           label: 'text-all-campaigns',
      //           icon: 'FlashDealsIcon',
      //         },
      //         {
      //           href: Routes.flashSale.create,
      //           label: 'text-new-campaigns',
      //           icon: 'FlashDealsIcon',
      //         },
      //         {
      //           href: Routes.vendorRequestForFlashSale.list,
      //           label: 'Vendor requests',
      //           icon: 'CouponsIcon',
      //         },
      //       ],
      //     },
      //     // {
      //     //   href: '',
      //     //   label: 'Newsletter emails',
      //     //   icon: 'CouponsIcon',
      //     // },
      //   ],
      // },

      // feature: {
      //   href: '',
      //   label: 'text-feature-management',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: Routes.message.list,
      //       label: 'sidebar-nav-item-message',
      //       icon: 'ChatIcon',
      //     },
      //     {
      //       href: Routes.storeNotice.list,
      //       label: 'sidebar-nav-item-store-notice',
      //       icon: 'StoreNoticeIcon',
      //     },
      //   ],
      // },

      // settings: {
      //   href: '',
      //   label: 'text-site-management',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: Routes.settings,
      //       label: 'sidebar-nav-item-settings',
      //       icon: 'SettingsIcon',
      //       childMenu: [
      //         {
      //           href: Routes.settings,
      //           label: 'text-general-settings',
      //           icon: 'SettingsIcon',
      //         },
      //         {
      //           href: Routes.paymentSettings,
      //           label: 'text-payment-settings',
      //           icon: 'RefundsIcon',
      //         },
      //         {
      //           href: Routes.seoSettings,
      //           label: 'text-seo-settings',
      //           icon: 'StoreNoticeIcon',
      //         },
      //         {
      //           href: Routes.eventSettings,
      //           label: 'text-events-settings',
      //           icon: 'RefundsIcon',
      //         },
      //         {
      //           href: Routes.shopSettings,
      //           label: 'text-shop-settings',
      //           icon: 'RefundsIcon',
      //         },
      //         {
      //           href: Routes?.maintenance,
      //           label: 'text-maintenance-settings',
      //           icon: 'InformationIcon',
      //         },
      //         {
      //           href: Routes?.companyInformation,
      //           label: 'text-company-settings',
      //           icon: 'InformationIcon',
      //         },
      //         {
      //           href: Routes?.promotionPopup,
      //           label: 'text-popup-settings',
      //           icon: 'InformationIcon',
      //         },
      //         // {
      //         //   href: '',
      //         //   label: 'Social settings',
      //         //   icon: 'RefundsIcon',
      //         // },
      //       ],
      //     },
      //     // {
      //     //   href: '',
      //     //   label: 'Company Information',
      //     //   icon: 'InformationIcon',
      //     // },
      //     // {
      //     //   href: '',
      //     //   label: 'Maintenance',
      //     //   icon: 'MaintenanceIcon',
      //     // },
      //   ],
      // },

      // license: {
      //   href: '',
      //   label: 'Main',
      //   icon: 'DashboardIcon',
      //   childMenu: [
      //     {
      //       href: Routes.domains,
      //       label: 'sidebar-nav-item-domains',
      //       icon: 'DashboardIcon',
      //     },
      //   ],
      // },
    },

    shop: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      // analytics: {
      //   href: (shop: string) => `/${shop}${Routes.product.list}`,
      //   label: 'Analytics',
      //   icon: 'ShopIcon',
      //   permissions: adminAndOwnerOnly,
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Shop',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Product',
      //       icon: 'ProductsIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Order',
      //       icon: 'OrdersIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Sale',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      // product: {
      //   href: '',
      //   label: 'text-product-management',
      //   icon: 'ProductsIcon',
      //   permissions: adminOwnerAndStaffOnly,
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'sidebar-nav-item-products',
      //       icon: 'ProductsIcon',
      //       childMenu: [
      //         {
      //           href: (shop: string) => `/${shop}${Routes.product.list}`,
      //           label: 'text-all-products',
      //           icon: 'ProductsIcon',
      //           permissions: adminOwnerAndStaffOnly,
      //         },
      //         {
      //           href: (shop: string) => `/${shop}${Routes.product.create}`,
      //           label: 'text-new-products',
      //           icon: 'ProductsIcon',
      //           permissions: adminOwnerAndStaffOnly,
      //         },
      //         {
      //           href: (shop: string) => `/${shop}${Routes.draftProducts}`,
      //           label: 'text-my-draft',
      //           icon: 'ProductsIcon',
      //           permissions: adminOwnerAndStaffOnly,
      //         },
      //         {
      //           href: (shop: string) =>
      //             `/${shop}${Routes.outOfStockOrLowProducts}`,
      //           label: 'text-all-out-of-stock',
      //           icon: 'ProductsIcon',
      //           permissions: adminOwnerAndStaffOnly,
      //         },
      //       ],
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.productInventory}`,
      //       label: 'text-inventory',
      //       icon: 'InventoryIcon',
      //       permissions: adminOwnerAndStaffOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.attribute.list}`,
      //       label: 'sidebar-nav-item-attributes',
      //       icon: 'AttributeIcon',
      //       permissions: adminOwnerAndStaffOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.manufacturer.list}`,
      //       label: 'sidebar-nav-item-manufacturers',
      //       icon: 'DiaryIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.author.list}`,
      //       label: 'sidebar-nav-item-authors',
      //       icon: 'FountainPenIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      financial: {
        href: '',
        label: 'text-financial-management',
        icon: 'WithdrawIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.withdraw.list}`,
            label: 'sidebar-nav-item-withdraws',
            icon: 'AttributeIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.refund.list}`,
            label: 'sidebar-nav-item-refunds',
            icon: 'RefundsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      order: {
        href: '',
        label: 'text-order-management',
        icon: 'OrdersIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.order.list}`,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.transaction}`,
            label: 'text-transactions',
            icon: 'CalendarScheduleIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      feature: {
        href: '',
        label: 'text-feature-management',
        icon: 'ProductsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.storeNotice.list}`,
            label: 'sidebar-nav-item-store-notice',
            icon: 'StoreNoticeIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `${Routes.ownerDashboardMessage}`,
            label: 'sidebar-nav-item-message',
            icon: 'ChatIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      feedback: {
        href: '',
        label: 'text-feedback-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.reviews.list}`,
            label: 'sidebar-nav-item-reviews',
            icon: 'ReviewIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.question.list}`,
            label: 'sidebar-nav-item-questions',
            icon: 'QuestionIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.staff.list}`,
            label: 'sidebar-nav-item-staffs',
            icon: 'UsersIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      promotional: {
        href: '',
        label: 'text-promotional-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.coupon.list}`,
            label: 'Coupons',
            icon: 'CouponsIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
            label: 'text-flash-sale',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
                label: 'text-available-flash-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.myProductsInFlashSale}`,
                label: 'text-my-products-in-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.vendorRequestForFlashSale.list}`,
                label: 'Ask for enrollment',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
        ],
      },

      layout: {
        href: '',
        label: 'text-page-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.faqs.list}`,
            label: 'text-faqs',
            icon: 'TypesIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.termsAndCondition.list}`,
            label: 'Terms And Conditions',
            icon: 'TypesIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },
    },

    staff: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      // analytics: {
      //   href: (shop: string) => `/${shop}${Routes.product.list}`,
      //   label: 'Analytics',
      //   icon: 'ShopIcon',
      //   permissions: adminAndOwnerOnly,
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Shop',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Product',
      //       icon: 'ProductsIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Order',
      //       icon: 'OrdersIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Sale',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      product: {
        href: '',
        label: 'text-product-management',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.product.list}`,
            label: 'sidebar-nav-item-products',
            icon: 'ProductsIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.product.list}`,
                label: 'text-all-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.product.create}`,
                label: 'text-new-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.draftProducts}`,
                label: 'text-my-draft',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.outOfStockOrLowProducts}`,
                label: 'text-low-out-of-stock',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
          {
            href: (shop: string) => `/${shop}${Routes.productInventory}`,
            label: 'text-inventory',
            icon: 'InventoryIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.attribute.list}`,
            label: 'sidebar-nav-item-attributes',
            icon: 'AttributeIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.manufacturer.list}`,
            label: 'sidebar-nav-item-manufacturers',
            icon: 'DiaryIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.author.list}`,
            label: 'sidebar-nav-item-authors',
            icon: 'FountainPenIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      financial: {
        href: '',
        label: 'text-financial-management',
        icon: 'WithdrawIcon',
        childMenu: [
          // {
          //   href: (shop: string) => `/${shop}${Routes.withdraw.list}`,
          //   label: 'sidebar-nav-item-withdraws',
          //   icon: 'AttributeIcon',
          //   permissions: adminAndOwnerOnly,
          // },
          {
            href: (shop: string) => `/${shop}${Routes.refund.list}`,
            label: 'sidebar-nav-item-refunds',
            icon: 'RefundsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      order: {
        href: '',
        label: 'text-order-management',
        icon: 'OrdersIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.order.list}`,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          // {
          //   href: (shop: string) => `/${shop}${Routes.transaction}`,
          //   label: 'Transactions',
          //   icon: 'CalendarScheduleIcon',
          //   permissions: adminAndOwnerOnly,
          // },
        ],
      },

      // feature: {
      //   href: '',
      //   label: 'Features Management',
      //   icon: 'ProductsIcon',
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.storeNotice.list}`,
      //       label: 'sidebar-nav-item-store-notice',
      //       icon: 'StoreNoticeIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `${Routes.message.list}`,
      //       label: 'sidebar-nav-item-message',
      //       icon: 'ChatIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      // feedback: {
      //   href: '',
      //   label: 'Feedback control',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.reviews.list}`,
      //       label: 'sidebar-nav-item-reviews',
      //       icon: 'ReviewIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.question.list}`,
      //       label: 'sidebar-nav-item-questions',
      //       icon: 'QuestionIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      // user: {
      //   href: '',
      //   label: 'User control',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.staff.list}`,
      //       label: 'sidebar-nav-item-staffs',
      //       icon: 'UsersIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      promotional: {
        href: '',
        label: 'text-promotional-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.coupon.list}`,
            label: 'Coupons',
            icon: 'CouponsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
            label: 'text-flash-sale',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
                label: 'text-available-flash-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.myProductsInFlashSale}`,
                label: 'text-my-products-in-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.vendorRequestForFlashSale.list}`,
                label: 'See all enrollment request',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
        ],
      },

      layout: {
        href: '',
        label: 'text-page-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.faqs.list}`,
            label: 'text-faqs',
            icon: 'TypesIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          // {
          //   href: (shop: string) => `/${shop}${Routes.termsAndCondition.list}`,
          //   label: 'Terms And Conditions',
          //   icon: 'TypesIcon',
          //   permissions: adminAndOwnerOnly,
          // },
        ],
      },
    },

    ownerDashboard: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: ownerAndStaffOnly,
      },
      {
        href: Routes.customerBookingCreate,
        label: 'Create booking',
        icon: 'OrdersIcon',
        // permissions: ownerAndStaffOnly,
      },
      {
        href: Routes.myBookings,
        label: 'My booking',
        icon: 'OrdersIcon',
        // permissions: ownerAndStaffOnly,
      }
      // {
      //   href: Routes?.ownerDashboardMyShop,
      //   label: 'common:sidebar-nav-item-my-shops',
      //   icon: 'MyShopOwnerIcon',
      //   permissions: ownerAndStaffOnly,
      // },
      // {
      //   href: Routes?.ownerDashboardMessage,
      //   label: 'common:sidebar-nav-item-message',
      //   icon: 'ChatOwnerIcon',
      //   permissions: ownerAndStaffOnly,
      // },
      // {
      //   href: Routes?.ownerDashboardNotice,
      //   label: 'common:sidebar-nav-item-store-notice',
      //   icon: 'StoreNoticeOwnerIcon',
      //   permissions: ownerAndStaffOnly,
      // },
    ],
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};

export const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];
