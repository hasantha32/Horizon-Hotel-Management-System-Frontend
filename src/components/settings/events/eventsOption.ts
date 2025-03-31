export const SMS_GROUP_OPTION = [
  {
    label: 'Admin',
    options: [
      { value: 'admin-statusChangeOrder', label: 'Status Change Order' },
      { value: 'admin-refundOrder', label: 'Refund Order' },
      { value: 'admin-paymentOrder', label: 'Payment ' },
    ],
  },
  {
    label: 'Store Owner',
    options: [
      { value: 'vendor-statusChangeOrder', label: 'Status Change Order' },
      { value: 'vendor-refundOrder', label: 'Refund Order' },
      { value: 'vendor-paymentOrder', label: 'Payment ' },
    ],
  },
  {
    label: 'Customer',
    options: [
      { value: 'customer-statusChangeOrder', label: 'Status Change Order' },
      { value: 'customer-refundOrder', label: 'Refund Order' },
      { value: 'customer-paymentOrder', label: 'Payment ' },
    ],
  },
];

export const EMAIL_GROUP_OPTION = [
  {
    label: 'Admin',
    options: [
      { value: 'admin-statusChangeOrder', label: 'Status Change Order' },
      { value: 'admin-refundOrder', label: 'Refund Order' },
      { value: 'admin-paymentOrder', label: 'Payment ' },
    ],
  },
  {
    label: 'Store Owner',
    options: [
      { value: 'vendor-statusChangeOrder', label: 'Status Change Order' },
      { value: 'vendor-refundOrder', label: 'Refund Order' },
      { value: 'vendor-paymentOrder', label: 'Payment ' },
      { value: 'vendor-createQuestion', label: 'Create Question' },
      { value: 'vendor-createReview', label: 'Create Review' },
    ],
  },
  {
    label: 'Customer',
    options: [
      { value: 'customer-statusChangeOrder', label: 'Status Change Order' },
      { value: 'customer-refundOrder', label: 'Refund Order' },
      { value: 'customer-paymentOrder', label: 'Payment ' },
      { value: 'customer-answerQuestion', label: 'Answer Question' },
    ],
  },
];

export const PUSH_NOTIFICATION_OPTION = [
  {
    label: 'Available for admin & vendor',
    options: [
      { value: 'all-storeNotice', label: 'Store notice notification' },
      { value: 'all-order', label: 'Order notification' },
      { value: 'all-message', label: 'Message notification ' },
    ],
  },
];
