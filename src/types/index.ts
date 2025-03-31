import type { NextPage } from 'next';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export enum CouponType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE_SHIPPING = 'free_shipping',
}

export enum ProductType {
  Simple = 'simple',
  Variable = 'variable',
}
export enum StoreNoticePriorityType {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}
export enum StoreNoticeType {
  all_vendor = 'all_vendor',
  specific_vendor = 'specific_vendor',
  all_shop = 'all_shop',
  specific_shop = 'specific_shop',
}

export enum PaymentGateway {
  STRIPE = 'STRIPE',
  COD = 'CASH_ON_DELIVERY',
  CASH = 'CASH',
  FULL_WALLET_PAYMENT = 'FULL_WALLET_PAYMENT',
  PAYPAL = 'PAYPAL',
  MOLLIE = 'MOLLIE',
  RAZORPAY = 'RAZORPAY',
  PAYMONGO = 'PAYMONGO',
  PAYSTACK = 'PAYSTACK',
  XENDIT = 'XENDIT',
  SSLCOMMERZ = 'SSLCOMMERZ',
  IYZICO = 'IYZICO',
  BKASH = 'BKASH',
  FLUTTERWAVE = 'FLUTTERWAVE',
}

export enum ProductStatus {
  Publish = 'publish',
  Draft = 'draft',
  UnderReview = 'under_review',
  Approved = 'approved',
  UnPublish = 'unpublish',
  Rejected = 'rejected',
}
export enum WithdrawStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  OnHold = 'ON_HOLD',
  Rejected = 'REJECTED',
  Processing = 'PROCESSING',
}

export enum ShippingType {
  Fixed = 'fixed',
  Percentage = 'percentage',
  Free = 'free_shipping',
}

export enum AddressType {
  Billing = 'billing',
  Shipping = 'shipping',
}
export enum RefundPolicyTarget {
  vendor = 'vendor',
  customer = 'customer',
}
export enum RefundPolicyStatus {
  Approved = 'approved',
  Pending = 'pending',
}

export interface GoogleMapLocation {
  lat?: number | string;
  lng?: number | string;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
  formatted_address?: string;
}

export type QueryOptionsType = {
  page?: number;
  name?: string;
  shop_id?: number;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export enum OrderStatus {
  PENDING = 'order-pending',
  PROCESSING = 'order-processing',
  COMPLETED = 'order-completed',
  CANCELLED = 'order-cancelled',
  REFUNDED = 'order-refunded',
  FAILED = 'order-failed',
  AT_LOCAL_FACILITY = 'order-at-local-facility',
  OUT_FOR_DELIVERY = 'order-out-for-delivery',
}

export enum FlashSaleType {
  PERCENTAGE = 'percentage',
  FIXED_RATE = 'fixed_rate',
  DEFAULT = 'percentage',
  // WALLET_POINT_GIFT = 'wallet_point_gift',
  // FREE_SHIPPING = 'free_shipping',
}

export interface TodayTotalOrderByStatus {
  pending: number;
  processing: number;
  complete: number;
  cancelled: number;
  refunded: number;
  failed: number;
  localFacility: number;
  outForDelivery: number;
}

export enum PaymentStatus {
  PENDING = 'payment-pending',
  PROCESSING = 'payment-processing',
  SUCCESS = 'payment-success',
  FAILED = 'payment-failed',
  REVERSAL = 'payment-reversal',
  COD = 'payment-cash-on-delivery',
}

export interface NameAndValueType {
  name: string;
  value: string;
}
export enum Permission {
  SuperAdmin = 'super_admin',
  StoreOwner = 'store_owner',
  Staff = 'staff',
  Customer = 'customer',
}

export interface GetParams {
  slug: string;
  language: string;
}

export interface QueryOptions {
  language: string;
  limit?: number;
  page?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
}

export interface ShopSocialInput {
  icon?: string;
  url?: string;
}

export interface PaginatorInfo<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  permissions: string[];
  role: string;
}

export interface AuthResponse_v2 {
  access: string;
  refresh: string;
  permissions: string[];
  role: string;
}

export interface Type {
  id: string;
  name: string;
  icon: string;
  slug: string;
  promotional_sliders?: AttachmentInput[];
  settings?: TypeSettings;
  products?: ProductPaginator;
  created_at: string;
  updated_at: string;
  translated_languages: string[];
}

export interface CreateTypeInput {
  name: string;
  slug?: string;
  language?: string;
  gallery?: AttachmentInput[];
  icon?: string;
  banner_text?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  translated_languages: string[];
  parent?: number;
  children: Category[];
  details?: string;
  image?: Attachment;
  icon?: string;
  type: Type;
  products: Product[];
  created_at: string;
  updated_at: string;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  values: AttributeValue[];
  shop_id?: number;
  translated_languages: string[];
  language?: string;
}

export interface AttributeValueInput {
  id?: number;
  value: string;
  meta?: string;
}

export interface CreateAttributeInput {
  name: string;
  shop_id: number;
  language?: string;
  values: AttributeValueInput;
}

export interface AttributeValueCreateInput {
  value: string;
  meta: string;
  attribute_id?: number;
}

export interface VariationProductPivot {
  price?: number;
}

export interface AttributeValue {
  id: string;
  value?: string;
  attribute?: Attribute;
  products: Product[];
  pivot?: VariationProductPivot;
  meta?: string;
}

export interface Variation {
  id?: string;
  title?: string;
  image?: Attachment;
  digital_file?: DigitalFile;
  price?: number;
  sku?: string;
  is_disable?: boolean;
  sale_price?: number;
  quantity?: number;
  options?: VariationOption[];
}

export interface DigitalFile {
  created_at?: string;
  id: string;
  attachment_id: string;
  file_name: string;
  updated_at?: string;
  url: string;
}

export interface VariationOption {
  name?: string;
  value?: string;
}

export interface VariationOptionInput {
  name?: string;
  value?: string;
}

export interface Attachment {
  thumbnail: string;
  original: string;
  id?: string;
}

export interface AttachmentInput {
  thumbnail: string;
  original: string;
  id?: string;
}

export interface ConnectTypeBelongsTo {
  connect?: string;
}

export interface Shop {
  id?: string;
  owner_id?: number;
  owner?: User;
  staffs?: User[];
  is_active?: boolean;
  orders_count?: number;
  products_count?: number;
  balance?: Balance;
  name?: string;
  slug?: string;
  description?: string;
  cover_image?: Attachment;
  logo?: Attachment;
  address?: UserAddress;
  settings?: ShopSettings;
  created_at?: string;
  updated_at?: string;
}

export interface Balance {
  id?: string;
  admin_commission_rate?: number;
  shop?: Shop;
  total_earnings?: number;
  withdrawn_amount?: number;
  current_balance?: number;
  payment_info?: PaymentInfo;
}

export interface PaymentInfo {
  account?: string;
  name?: string;
  email?: string;
  bank?: string;
}

export interface PaymentInfoInput {
  account?: string;
  name?: string;
  email?: string;
  bank?: string;
}

export interface BalanceInput {
  id?: string;
  payment_info?: PaymentInfoInput;
}

export interface ShopSettings {
  socials?: ShopSocials[];
  contact?: string;
  location?: Location;
  website?: string;
  notifications: {
    email: string;
    enable: boolean;
  };
}

export interface Location {
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface ShopSocials {
  icon?: string;
  url?: string;
}

export interface UserAddress {
  country?: string;
  city?: string;
  state?: string;
  zip?: string;
  street_address?: string;
}

export interface MakeAdminInput {
  user_id: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  shops: Shop[];
  managed_shop: Shop;
  is_active: boolean;
  email: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  address: Address[];
  orders?: OrderPaginator;
  email_verified: boolean;
  is_admin: boolean;
}

export interface Domain {
  id: String;
  url: String;
}
export interface LicenseAdditionalData {
  quotaExceeded: boolean;
  supportValid: boolean;
  licenseValid: boolean;
  licenseRemaining: string;
  purchaseUrl: string;
}

export interface UpdateUser {
  name?: string;
  profile?: UserProfileInput;
  address?: UserAddressUpsertInput[];
}

export interface Profile {
  id: string;
  avatar?: Attachment;
  bio?: string;
  contact?: string;
  socials?: Social[];
  customer?: User;
}

export interface Social {
  type?: string;
  link?: string;
}

export interface Address {
  id: string;
  title?: string;
  default?: boolean;
  address?: UserAddress;
  type?: string;
  customer?: User;
  location: GoogleMapLocation;
}

export interface Booking {
  id: string,
  booking_number: string;
  user: string,
  check_in: string,
  check_out: string,
  total_price: string,
  status: string,
  rooms: Room[],
}

export interface BookingItem {
  id: string,
}

export interface Room {
  id: string,
  hotel_id: string,
  category: string,
  room_number: string,
  is_available: boolean,
  price: string,
}

export interface RoomCategory {
  id: string,
  name: string,
  slug: string,
  description: string,
  capacity: number,
  price_per_night: number,
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  translated_languages: string[];
  orders: Order[];
  type: string;
  image: string;
  amount: number;
  active_from: string;
  expire_at: string;
  created_at: string;
  updated_at: string;
  target?: boolean;
  shop_id?: string;
  is_approve?: boolean;
}

export interface CouponInput {
  code: string;
  type: CouponType;
  amount: number;
  minimum_cart_amount: number;
  description?: string;
  image?: AttachmentInput;
  active_from: string;
  expire_at: string;
  language?: string;
  shop_id?: string;
}

export interface RoomCategoryInput {
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
}

export interface RoomInput {
  category_id: string;
  room_number: string;
  is_available: boolean;
}

export interface BookingInput {
  booking_number: string;
  status: string;
}

export interface StoreNotice {
  id: string;
  translated_languages: string[];
  priority: StoreNoticePriorityType;
  notice: string;
  description?: string;
  effective_from?: string;
  expired_at: string;
  type?: string;
  is_read?: boolean;
  shops?: Shop[];
  users?: User[];
  received_by?: string;
  created_by: string;
  expire_at: string;
  created_at: string;
  creator_role: string;
  updated_at: string;
  deleted_at?: string;
  creator?: any;
}

export interface StoreNoticeInput {
  priority: string;
  notice: string;
  description?: string;
  effective_from?: string;
  expired_at: string;
  type: string;
  received_by?: string[];
}

export interface FAQs {
  id: string;
  translated_languages: string[];
  language: string;
  faq_title: string;
  slug: string;
  faq_description: string;
  shop_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface FAQsInput {
  faq_title: string;
  faq_description?: string;
  shop_id?: string;
  language?: string;
  slug?: string;
}

export interface FlashSale {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  image?: Attachment;
  cover_image?: Attachment;
  type: string;
  rate: string;
  sale_status: boolean;
  sale_builder: any;
  language: string;
  translated_languages: string[];
  products: Product[];
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FlashSaleInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  language?: string;
  slug?: string;
  image?: AttachmentInput;
  cover_image?: AttachmentInput;
  type: string;
  rate: string;
  sale_status: boolean;
  sale_builder: any;
}

export interface TermsAndConditions {
  id: string;
  translated_languages: string[];
  language: string;
  title: string;
  slug: string;
  description: string;
  shop_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_approved?: boolean;
}

export interface TermsAndConditionsInput {
  title: string;
  description?: string;
  shop_id?: string;
}

export interface StoreNoticeUserToNotifyInput {
  type: string;
}
export interface WalletPoint {
  id: number;
  amount: number;
  order_id: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tracking_number: string;
  customer_contact: string;
  customer_name: string;
  customer_id: number;
  customer?: User;
  amount: number;
  sales_tax: number;
  total: number;
  paid_total: number;
  payment_id?: string;
  parent_id: string | null;
  payment_gateway?: string;
  coupon?: Coupon;
  discount?: number;
  wallet_point?: WalletPoint;
  delivery_fee?: number;
  delivery_time: string;
  products: Product[];
  created_at: string;
  updated_at: string;
  billing_address?: UserAddress;
  shipping_address?: UserAddress;
  translated_languages: string[];
  language: string;
  order_status: string;
  payment_status: string;
  shop_id?: string;
  shop?: Shop;
  note?: string;
}

export interface NotifyLogs {
  id: string;
  receiver: string;
  sender: string;
  notify_type: string;
  notify_receiver_type: string;
  is_read: boolean;
  notify_text: string;
}

export interface ReadAllNotifyLogs {
  set_all_read: boolean;
}

export interface OrderProductPivot {
  order_quantity?: number;
  unit_price?: number;
  subtotal?: number;
  variation_option_id?: string;
}

export interface VerifyCheckoutInputType {
  amount: number;
  customer_id: string;
  products: any;
  billing_address: Address;
  shipping_address: Address;
}

export type VerifyCouponInputType = {
  code: string;
  sub_total: number;
};
export interface VerifyCouponResponse {
  is_valid: boolean;
  coupon?: Coupon;
  message?: string;
}

export interface Product {
  id: string;
  translated_languages: string[];
  shop_id: string;
  name: string;
  slug: string;
  type: Type;
  product_type: ProductType;
  max_price?: number;
  min_price?: number;
  categories: Category[];
  variations?: AttributeValue[];
  variation_options?: Variation[];
  digital_file?: DigitalFile;
  pivot?: OrderProductPivot;
  orders: Order[];
  description?: string;
  in_stock?: boolean;
  is_digital?: boolean;
  is_external?: boolean;
  is_taxable?: boolean;
  sale_price?: number;
  video?: {
    url: string;
  }[];
  sku?: string;
  gallery?: Attachment[];
  image?: Attachment;
  status?: ProductStatus;
  height?: string;
  length?: string;
  width?: string;
  price: number;
  quantity?: number;
  unit?: string;
  external_product_url?: string;
  external_product_button_text?: string;
  created_at: string;
  updated_at: string;
  ratings: number;
  in_flash_sale: boolean;
}

export interface Batch {
  batch_number: number;
  manufacture_date: Date;
  expiry_date: Date;
  cost: number;
  price: number;
  sale_price: number;
  discount: number;
  quantity: number;
  in_stock: boolean;
}

export interface CreateProduct {
  name: string;
  slug: string;
  type_id: string;
  price: number;
  sale_price?: number;
  quantity?: number;
  unit: string;
  description?: string;
  categories?: string[];
  variations?: AttributeProductPivot[];
  in_stock?: boolean;
  is_taxable?: boolean;
  author_id?: string;
  digital_file?: DigitalFileInput;
  external_product_button_text?: string;
  external_product_url?: string;
  is_external?: boolean;
  manufacturer_id?: string;
  max_price?: number;
  min_price?: number;
  variation_options?: UpsertVariationsHasMany;
  video: {
    url: string;
  }[];
  sku?: string;
  gallery?: AttachmentInput[];
  image?: AttachmentInput;
  status?: ProductStatus;
  height?: string;
  length?: string;
  width?: string;
  shop_id?: string;
  in_flash_sale: boolean;
}

export interface AttributeProductPivot {
  id: string;
  price?: number;
}

export interface DigitalFileInput {
  file_name: string;
  attachment_id: string;
  id?: string;
  url: string;
}

export interface UpsertVariationsHasMany {
  delete?: string[];
  upsert?: VariationInput[];
}

export interface VariationInput {
  digital_file?: DigitalFileInput;
  id?: string;
  image?: AttachmentInput;
  is_digital?: boolean;
  is_disable?: boolean;
  options?: VariationOptionInput[];
  price: number;
  quantity: number;
  sale_price?: number;
  sku: number;
  title: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  translated_languages: string[];
  icon?: string;
  type: Type;
  products?: Product[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateTagInput {
  name: string;
  type?: ConnectTypeBelongsTo;
  details?: string;
  image?: AttachmentInput;
  icon?: string;
}

export interface Author {
  bio?: string;
  born?: string;
  translated_languages: string[];
  cover_image?: Attachment;
  death?: string;
  id: string;
  image?: Attachment;
  is_approved?: boolean;
  language?: string;
  name: string;
  quote?: string;
  slug?: string;
  socials?: ShopSocials[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateAuthorInput {
  bio?: string;
  born?: string;
  cover_image?: AttachmentInput;
  death?: string;
  image?: AttachmentInput;
  is_approved?: boolean;
  language?: string;
  name: string;
  quote?: string;
  shop_id?: string;
  socials?: ShopSocialInput[];
}
export interface CreateRefundPolicyInput {
  title: string;
  slug: string;
  target: string;
  status: string;
  language: string;
  description?: string;
  shop_id?: string;
}
export interface CreateRefundReasonInput {
  name: string;
  slug: string;
  language: string;
}

export interface CreateCategoryInput {
  name: string;
  type_id?: string;
  parent?: number;
  details?: string;
  image?: AttachmentInput;
  icon?: string;
}

export interface CreateWithdrawInput {
  amount: number;
  shop_id: number;
  payment_method?: string;
  details?: string;
  note?: string;
}

export interface ApproveWithdrawInput {
  id: string;
  status: WithdrawStatus;
}

// -> TODO: Simplify this
export interface MappedPaginatorInfo {
  currentPage: number;
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  links: any[];
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
  hasMorePages: boolean;
}

export interface Manufacturer {
  cover_image?: Attachment;
  created_at?: string;
  description?: string;
  translated_languages: string[];
  id: string;
  image?: Attachment;
  is_approved?: boolean;
  name: string;
  slug?: string;
  socials?: ShopSocials[];
  type: Type;
  type_id?: string;
  updated_at?: string;
  website?: string;
}

export interface ConnectProductOrderPivot {
  product_id: string;
  order_quantity?: number;
  unit_price?: number;
  subtotal?: number;
}

export interface CardInput {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  email?: string;
}

export declare type UserAddressInput = {
  country?: string;
  city?: string;
  state?: string;
  zip?: string;
  street_address?: string;
};

export interface CreateOrderStatusInput {
  name: string;
  color: string;
  serial: number;
  language?: string;
}

export interface CreateOrderInput {
  tracking_number?: string;
  customer_id: number;
  order_status?: string;
  products: ConnectProductOrderPivot[];
  amount: number;
  sales_tax?: number;
  total: number;
  paid_total: number;
  payment_id?: string;
  payment_gateway: string;
  coupon_id?: number;
  discount?: number;
  delivery_fee?: number;
  delivery_time?: string;
  card?: CardInput;
  billing_address?: UserAddressInput;
  shipping_address?: UserAddressInput;
}

export interface CreateNotifyLogsInput {
  id: string;
  receiver: string;
  sender: string;
  notify_type: string;
  notify_receiver_type: string;
  is_read: boolean;
  notify_text: string;
}

export interface CreateManufacturerInput {
  cover_image?: AttachmentInput;
  description?: string;
  image?: AttachmentInput;
  is_approved?: boolean;
  name: string;
  shop_id?: string;
  language?: string;
  socials?: ShopSocialInput[];
  type_id: string;
  website?: string;
}

export interface Withdraw {
  id?: string;
  amount?: number;
  status?: WithdrawStatus;
  shop_id?: number;
  shop?: Shop;
  payment_method?: string;
  details?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  photos?: Attachment[];
  created_at: string;
  updated_at: string;
  positive_feedbacks_count?: number;
  negative_feedbacks_count?: number;
  product: Product;
  user: User;
  abusive_reports: AbusiveReport[];
}

export interface AbusiveReport {
  id?: number;
  user_id?: number;
  user: User[];
  model_id: number;
  model_type: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAbuseReportInput {
  model_id: string;
  model_type: string;
  message: string;
}

export interface CreateMessageInput {
  message: string;
  id: string;
  shop_id: string;
}
export interface CreateMessageSeenInput {
  id: string;
}

export interface Tax {
  id?: string;
  name?: string;
  rate?: number;
}

export interface ContactDetails {
  socials?: ShopSocials[];
  contact?: string;
  location?: Location;
  website?: string;
}

export interface Location {
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface LatestMessage {
  body: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  id: string;
}

export interface Conversations {
  id: string;
  created_at: string;
  updated_at: string;
  shop_id: number;
  unseen?: boolean;
  user_id: string;
  user: User;
  shop: Shop;
  latest_message: LatestMessage;
}

export interface Message extends LatestMessage {
  conversation: Conversations;
}

export interface ShopSocials {
  icon?: string;
  url?: string;
}

export interface FacebookSettings {
  appId?: string;
  isEnable?: boolean;
  pageId?: string;
}

export interface GoogleSettings {
  isEnable?: boolean;
  tagManagerId?: string;
}

export type SeoSettings = {
  canonicalUrl?: string;
  metaDescription?: string;
  metaTags?: string;
  metaTitle?: string;
  ogDescription?: string;
  ogImage?: Attachment;
  ogTitle?: string;
  twitterCardType?: string;
  twitterHandle?: string;
};

export interface Settings {
  id: string;
  language: string;
  options: SettingsOptions;
}

export interface PromoPopupFormValues {
  image?: Attachment;
  title?: string;
  description?: string;
  popUpDelay?: number;
  popUpExpiredIn?: number;
  isPopUpNotShow?: boolean;
  popUpNotShow?: {
    title?: string;
    popUpExpiredIn?: number;
  };
}

export interface SettingsInput {
  language?: string;
  options?: SettingsOptionsInput;
}

export interface Tax {
  id?: string;
  name?: string;
  rate?: number;
  is_global?: boolean;
  country?: string;
  state?: string;
  zip?: string;
  city?: string;
  priority?: number;
  on_shipping?: boolean;
}

export interface TaxInput {
  name?: string;
  rate?: number;
  is_global?: boolean;
  country?: string;
  state?: string;
  zip?: string;
  city?: string;
  priority?: number;
  on_shipping?: boolean;
}

export interface Shipping {
  id?: string;
  name?: string;
  amount?: number;
  is_global?: boolean;
  type?: ShippingType;
}

export interface ShippingInput {
  name: string;
  amount: number;
  is_global?: boolean;
  type: ShippingType;
}

export interface ShippingUpdateInput {
  name?: string;
  amount?: number;
  is_global?: boolean;
  type?: ShippingType;
}

export interface SeoSettingsInput {
  metaTitle?: string;
  metaDescription?: string;
  metaTags?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: AttachmentInput;
  twitterHandle?: string;
  twitterCardType?: string;
}

export interface GoogleSettingsInput {
  isEnable?: boolean;
  tagManagerId?: string;
}

export interface FacebookSettingsInput {
  isEnable?: boolean;
  appId?: string;
  pageId?: string;
}

export interface SettingsOptions {
  siteTitle?: string;
  siteSubtitle?: string;
  currency?: string;
  defaultAi?: string;
  paymentGateway?: any;
  defaultPaymentGateway?: string;
  useOtp?: boolean;
  useAi?: boolean;
  contactDetails?: ContactDetails;
  minimumOrderAmount?: number;
  currencyToWalletRatio?: number;
  signupPoints?: number;
  maxShopDistance?: number;
  maximumQuestionLimit?: number;
  deliveryTime?: DeliveryTime[];
  logo?: Attachment;
  collapseLogo?: Attachment;
  taxClass?: string;
  shippingClass?: string;
  seo?: SeoSettings;
  google?: GoogleSettings;
  facebook?: FacebookSettings;
  useEnableGateway?: boolean;
  currencyOptions?: SettingCurrencyOptions;
  guestCheckout: boolean;
  smsEvent?: SmsEvent;
  emailEvent?: EmailEvent;
  pushNotification?: PushNotification;
  server_info?: ServerInfo;
  enableTerms?: boolean;
  enableCoupons?: boolean;
  maintenance: Maintenance;
  isUnderMaintenance: boolean;
  isPromoPopUp?: boolean;
  promoPopup?: PromoPopupFormValues;
  reviewSystem?: string;
  useGoogleMap?: boolean;
  isProductReview?: boolean;
  freeShipping?: boolean;
  freeShippingAmount?: number;
}

// *************** OLD Code ***************
// export interface SettingsOptions {
//   siteTitle?: string;
//   siteSubtitle?: string;
//   currency?: string;
//   defaultAi?: string;
//   useOtp?: boolean;
//   useAi?: boolean;
//   useGoogleMap?: boolean;
//   isProductReview?: boolean;
//   freeShipping?: boolean;
//   contactDetails?: ContactDetails;
//   minimumOrderAmount?: number;
//   freeShippingAmount?: number;
//   currencyToWalletRatio?: number;
//   signupPoints?: number;
//   maxShopDistance?: number;
//   maximumQuestionLimit?: number;
//   deliveryTime?: DeliveryTime[];
//   logo?: Attachment;
//   taxClass?: string;
//   shippingClass?: string;
//   seo?: SeoSettings;
//   google?: GoogleSettings;
//   facebook?: FacebookSettings;
//   paymentGateway?: any;
//   defaultPaymentGateway?: string;
//   guestCheckout: boolean;
//   smsEvent?: SmsEvent;
//   emailEvent?: EmailEvent;
//   pushNotification?: PushNotification;
//   server_info?: ServerInfo;
// }

export interface Maintenance {
  image: Attachment;
  title: string;
  description: string;
  start: string;
  until: string;
  isUnderMaintenance: boolean;
}

export interface ServerInfo {
  max_execution_time?: string;
  max_input_time?: string;
  memory_limit?: string;
  post_max_size?: number;
  upload_max_filesize?: number;
}

export interface SettingsOptionsInput {
  siteTitle?: string;
  siteSubtitle?: string;
  currency?: string;
  useOtp?: boolean;
  useAi?: boolean;
  defaultAi?: any;
  freeShipping?: boolean;
  useCashOnDelivery?: boolean;
  paymentGateway?: any;
  defaultPaymentGateway?: string;
  contactDetails?: ContactDetailsInput;
  minimumOrderAmount?: number;
  freeShippingAmount?: number;
  currencyToWalletRatio?: number;
  signupPoints?: number;
  maxShopDistance?: number;
  maximumQuestionLimit?: number;
  deliveryTime?: DeliveryTimeInput[];
  logo?: AttachmentInput;
  taxClass?: string;
  shippingClass?: string;
  seo?: SeoSettingsInput;
  google?: GoogleSettingsInput;
  facebook?: FacebookSettingsInput;
  currencyOptions?: SettingCurrencyOptions;
  useEnableGateway?: boolean;
  guestCheckout?: boolean;
  smsEvent?: SmsEvent;
  emailEvent?: EmailEvent;
  pushNotification?: PushNotification;
  server_info?: ServerInfo;
  useGoogleMap?: boolean;
  enableTerms?: boolean;
  enableCoupons?: boolean;
  isProductReview?: boolean;
  isPromoPopUp?: boolean;
  promoPopup?: PromoPopupFormValues;
  enableReviewPopup?: boolean;
  reviewSystem?: string;
}

export interface SmsEvent {
  admin?: SmsAdminEvent;
  vendor?: SmsVendorEvent;
  customer?: SmsCustomerEvent;
}

export interface PushNotification {
  all?: PushNotificationEvent;
}

export interface PushNotificationEvent {
  storeNotice?: boolean;
  order?: boolean;
  message?: boolean;
}

export interface SmsAdminEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface SmsCustomerEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface SmsVendorEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface EmailEvent {
  admin?: EmailAdminEvent;
  vendor?: EmailVendorEvent;
  customer?: EmailCustomerEvent;
}
export interface EmailAdminEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}
export interface EmailCustomerEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}
export interface EmailVendorEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface DeliveryTime {
  description?: string;
  title?: string;
}

export interface DeliveryTimeInput {
  title?: string;
  description?: string;
}

export interface ContactDetailsInput {
  socials?: ShopSocialInput[];
  contact?: string;
  location?: LocationInput;
  website?: string;
  emailAddress?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  shop_id?: number;
  // permission: Permission;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ForgetPasswordInput {
  email: string;
}

export interface VerifyForgetPasswordTokenInput {
  token: string;
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  email: string;
  password: string;
}

export declare interface MakeAdminInput {
  user_id: string;
}

export interface BlockUserInput {
  id: number;
}

export interface WalletPointsInput {
  customer_id: string;
  points: number;
}
export interface KeyInput {
  license_key: string;
}

export declare type AddStaffInput = {
  email: string;
  password: string;
  name: string;
  shop_id: number;
};

export declare type ApproveShopInput = {
  id: string;
  admin_commission_rate: number;
};

export interface LocationInput {
  lat?: number;
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface ShopSettingsInput {
  socials?: ShopSocialInput[];
  contact?: string;
  location?: LocationInput;
  website?: string;
}

export interface ShopInput {
  name: string;
  description?: string;
  cover_image?: AttachmentInput;
  logo?: AttachmentInput;
  address?: UserAddressInput;
  settings?: ShopSettingsInput;
  categories?: Category[];
  balance?: BalanceInput;
}

export declare type Question = {
  id: string;
  user_id: number;
  product_id: number;
  shop_id: number;
  question?: string;
  answer: string;
  created_at: string;
  updated_at: string;
  positive_feedbacks_count?: number;
  negative_feedbacks_count?: number;
  product: Product;
  user: User;
};

export interface TypeSettingsInput {
  isHome?: boolean;
  layoutType?: string;
  productCard?: string;
  bestSelling: {
    enable?: boolean;
    title?: string;
  };
  popularProducts: {
    enable?: boolean;
    title?: string;
  };
  category: {
    enable?: boolean;
    title?: string;
  };
  handpickedProducts: {
    enable?: boolean;
    title?: string;
    products?: Product[];
    enableSlider?: boolean;
  };
  newArrival: {
    enable?: boolean;
    title?: string;
  };
  authors: {
    enable?: boolean;
    title?: string;
  };
  manufactures: {
    enable?: boolean;
    title?: string;
  };
}

export interface ReplyQuestion {
  question?: string;
  answer: string;
}

export interface TypeSettings {
  isHome?: boolean;
  layoutType?: string;
  productCard?: string;
  bestSelling: {
    enable?: boolean;
    title?: string;
  };
  popularProducts: {
    enable?: boolean;
    title?: string;
  };
  category: {
    enable?: boolean;
    title?: string;
  };
  handpickedProducts: {
    enable?: boolean;
    title?: string;
    products?: Product[];
    enableSlider?: boolean;
  };
  newArrival: {
    enable?: boolean;
    title?: string;
  };
  authors: {
    enable?: boolean;
    title?: string;
  };
  manufactures: {
    enable?: boolean;
    title?: string;
  };
}

export interface UserAddressUpsertInput {
  title: string;
  default?: boolean;
  address: UserAddressInput;
  type: string;
}
export interface Refund {
  id: number;
  amount: number;
  status: string;
  title?: string;
  description?: string;
  images?: Attachment;
  order_id?: Order;
  customer_id?: User;
  refund_policy_id?: number;
}

export interface RefundPolicy {
  id: string;
  title: string;
  slug: string;
  target: string;
  status: string;
  description?: string;
  language: string;
  shop_id?: string;
  shop?: Shop;
  refunds?: Refund[];
  translated_languages: Array<string>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
export interface RefundReason {
  id: string;
  name: string;
  slug: string;
  language: string;
  translated_languages: Array<string>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SocialInput {
  type?: string;
  link?: string;
}

export interface UserProfileInput {
  id: string;
  avatar?: AttachmentInput;
  bio?: string;
  socials?: SocialInput[];
  contact?: string;
}

export interface CategoryQueryOptions extends QueryOptions {
  type: string;
  name: string;
  parent: number | null;
  self: string;
}

export interface ConversationQueryOptions extends QueryOptions {
  search?: string;
}

export interface TagQueryOptions extends QueryOptions {
  type: string;
  name: string;
  parent: number | null;
}

export interface InvoiceTranslatedText {
  subtotal: string;
  discount: string;
  tax: string;
  delivery_fee: string;
  total: string;
  products: string;
  quantity: string;
  invoice_no: string;
  date: string;
}

export interface GenerateInvoiceDownloadUrlInput {
  order_id: string;
  translated_text?: InvoiceTranslatedText;
  is_rtl: boolean;
}

export interface AttributeQueryOptions extends QueryOptions {
  type: string;
  name: string;
  shop_id: string;
}

export interface AttributeValueQueryOptions extends QueryOptions {
  type: string;
  name: string;
}

export interface TaxQueryOptions extends QueryOptions {
  name: string;
}

export interface ShippingQueryOptions extends QueryOptions {
  name: string;
}

export interface AuthorQueryOptions extends QueryOptions {
  type: string;
  name: string;
  is_approved?: boolean;
}
export interface RefundPolicyQueryOptions extends QueryOptions {
  title: string;
  target: string;
  status: string;
}
export interface RefundReasonQueryOptions extends QueryOptions {
  name: string;
}

export interface TypeQueryOptions extends QueryOptions {
  name: string;
}

export interface AnalyticsQueryOptions extends QueryOptions {
  days?: number;
}

export interface ProductQueryOptions extends QueryOptions {
  type: string;
  name: string;
  categories: string;
  tags: string;
  author: string;
  price: string;
  manufacturer: string;
  status: string;
  is_active: string;
  shop_id: string;
  min_price: string;
  max_price: string;
  rating: string;
  question: string;
  user_id: string;
  flash_sale_builder: boolean;
  product_type: string;
  searchedByUser: string;
}

export interface UserQueryOptions extends QueryOptions {
  email: string;
  search?: string;
  is_active?: boolean;
}

export interface ManufacturerQueryOptions extends QueryOptions {
  shop_id: string;
  name: string;
  is_approved: boolean;
  type: string;
}

export interface OrderStatusQueryOptions extends QueryOptions {
  name: string;
}

export interface StaffQueryOptions extends Omit<QueryOptions, 'language'> {
  shop_id: string;
}

export interface WithdrawQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  shop_id: string;
  parent: number | null;
}

export interface OrderQueryOptions extends QueryOptions {
  type: string;
  name: string;
  shop_id: string;
  tracking_number: string;
  refund_reason: string;
  with: string;
}

export interface NotifyLogsQueryOptions extends QueryOptions {
  notify_type: string;
  notify_receiver_type?: string;
  sender?: string;
  receiver: string;
  set_all_read?: boolean;
  is_read?: boolean;
}

export interface CouponQueryOptions extends QueryOptions {
  code: string;
  shop_id: string;
}

export interface RoomCategoryQueryOptions extends QueryOptions {
  name: string;
}

export interface RoomQueryOptions extends QueryOptions {
  room_number: string;
  category: string;
}

export interface BookingQueryOptions extends QueryOptions {
  user: string;
  customer_name: string;
  booking_number: string;
}

export interface StoreNoticeQueryOptions extends QueryOptions {
  notice: string;
  shops: string;
  'users.id': string;
}

export interface FAQsQueryOptions extends QueryOptions {
  faq_title: string;
  shop_id: string;
}

export interface FlashSaleQueryOptions extends QueryOptions {
  title?: string;
  shop_id?: string;
  slug?: string;
  request_from?: string;
}

export interface TermsAndConditionsQueryOptions extends QueryOptions {
  title: string;
  shop_id: string;
  is_approved?: boolean;
}

export interface VendorQueryOptionsType extends QueryOptionsType {
  is_active?: boolean;
}

export interface MessageQueryOptions extends QueryOptions {
  slug: string;
}

export interface QuestionQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  type: string;
  shop_id: string;
  product_id: number;
  answer: string;
}

export interface ReviewQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  type: string;
  shop_id: string;
  product_id: number;
}

export interface ShopQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  parent: number | null;
  is_active?: boolean;
}

export interface GoogleMapLocation {
  //@ts-ignore
  lat?: number;
  //@ts-ignore
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}
export interface SettingCurrencyOptions {
  formation?: any;
  fractions?: number;
}

export interface GenerateDescriptionInput {
  prompt: string;
}

export interface ItemProps {
  id: number;
  title: string;
}

export interface ShopPaginator extends PaginatorInfo<Shop> {}

export interface WithdrawPaginator extends PaginatorInfo<Withdraw> {}

export interface UserPaginator extends PaginatorInfo<User> {}

export interface LicensedDomainPaginator extends PaginatorInfo<Domain> {}

export interface QuestionPaginator extends PaginatorInfo<Question> {}

export interface StaffPaginator extends PaginatorInfo<User> {}

export interface OrderPaginator extends PaginatorInfo<Order> {}

export interface NotifyLogsPaginator extends PaginatorInfo<NotifyLogs> {}

export interface CouponPaginator extends PaginatorInfo<Coupon> {}

export interface RoomPaginator extends PaginatorInfo<Room> {}

export interface BookingPaginator extends PaginatorInfo<Booking> {}

export interface RoomCategoryPaginator extends PaginatorInfo<RoomCategory> {}

export interface StoreNoticePaginator extends PaginatorInfo<StoreNotice> {}

export interface FAQsPaginator extends PaginatorInfo<FAQs> {}

export interface FlashSalePaginator extends PaginatorInfo<FlashSale> {}

export interface TermsAndConditionsPaginator
  extends PaginatorInfo<TermsAndConditions> {}

export interface ProductPaginator extends PaginatorInfo<Product> {}

export interface CategoryPaginator extends PaginatorInfo<Category> {}

export interface TaxPaginator extends PaginatorInfo<Tax> {}

export interface ReviewPaginator extends PaginatorInfo<Review> {}

export interface TagPaginator extends PaginatorInfo<Tag> {}

export interface AttributePaginator extends PaginatorInfo<Attribute> {}

export interface AttributeValuePaginator
  extends PaginatorInfo<AttributeValue> {}

export interface ShippingPaginator extends PaginatorInfo<Shipping> {}

export interface AuthorPaginator extends PaginatorInfo<Author> {}

export interface RefundPolicyPaginator extends PaginatorInfo<RefundPolicy> {}

export interface RefundReasonPaginator extends PaginatorInfo<RefundReason> {}

export interface ManufacturerPaginator extends PaginatorInfo<Manufacturer> {}

export interface OrderStatusPaginator extends PaginatorInfo<OrderStatus> {}

export interface ConversionPaginator extends PaginatorInfo<Conversations> {}

export interface MessagePaginator extends PaginatorInfo<Message> {}

export interface FlashSaleProductsRequest {
  id: string;
  title: string;
  flash_sale_id: string;
  requested_product_ids: Product[];
  request_status: string;
  note: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  flash_sale: FlashSale;
}

export interface FlashSaleProductsRequestInput {
  title: string;
  flash_sale_id: string;
  // requested_product_ids: Product[];
  note?: string;
  language?: string;
}

export interface FlashSaleProductsRequestQueryOptions extends QueryOptions {
  title?: string;
  requested_product_ids?: Product[];
  request_status?: string;
  shop_id?: string;
}

export interface FlashSaleRequestedProductsQueryOptions
  extends ProductQueryOptions {
  vendor_request_id: string;
}

export interface FlashSaleProductsRequestPaginator
  extends PaginatorInfo<FlashSaleProductsRequest> {}

export type MaintenanceFormValues = {
  isUnderMaintenance: boolean;
  maintenance: {
    image: Attachment;
    title: string;
    description: string;
    start: string;
    until: string;
    isOverlayColor: boolean;
    overlayColor: string;
    buttonTitleOne: string;
    buttonTitleTwo: string;
    overlayColorRange: string;
    newsLetterTitle: string;
    newsLetterDescription: string;
    aboutUsTitle: string;
    aboutUsDescription: string;
    contactUsTitle: string;
  };
};
