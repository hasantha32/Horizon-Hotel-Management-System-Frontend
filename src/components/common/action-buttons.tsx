import { BanUser } from '@/components/icons/ban-user';
import { EditIcon } from '@/components/icons/edit';
import { TrashIcon } from '@/components/icons/trash';
import { Eye } from '@/components/icons/eye-icon';
import { WalletPointsIcon } from '@/components/icons/wallet-point';
import Link from '@/components/ui/link';
import { useTranslation } from 'next-i18next';
import { STAFF, SUPER_ADMIN } from '@/utils/constants';
import { CheckMarkCircle } from '@/components/icons/checkmark-circle';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { CloseFillIcon } from '@/components/icons/close-fill';
import { AdminIcon } from '@/components/icons/admin-icon';
import { EyeIcon } from '@/components/icons/category/eyes-icon';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';

type Props = {
  id: string;
  editModalView?: string | any;
  deleteModalView?: string | any;
  editUrl?: string;
  previewUrl?: string;
  enablePreviewMode?: boolean;
  detailsUrl?: string;
  isUserActive?: boolean;
  userStatus?: boolean;
  isShopActive?: boolean;
  approveButton?: boolean;
  termApproveButton?: boolean;
  couponApproveButton?: boolean;
  showAddWalletPoints?: boolean;
  changeRefundStatus?: boolean;
  showMakeAdminButton?: boolean;
  showReplyQuestion?: boolean;
  customLocale?: string;
  isTermsApproved?: boolean;
  isCouponApprove?: boolean;
  flashSaleVendorRequestApproveButton?: boolean;
  isFlashSaleVendorRequestApproved?: boolean;
};

const ActionButtons = ({
  id,
  editModalView,
  deleteModalView,
  editUrl,
  previewUrl,
  enablePreviewMode = false,
  detailsUrl,
  userStatus = false,
  isUserActive = false,
  isShopActive,
  approveButton = false,
  termApproveButton = false,
  showAddWalletPoints = false,
  changeRefundStatus = false,
  showMakeAdminButton = false,
  showReplyQuestion = false,
  customLocale,
  isTermsApproved,
  couponApproveButton,
  isCouponApprove,
  flashSaleVendorRequestApproveButton = false,
  isFlashSaleVendorRequestApproved,
}: Props) => {
  const { t } = useTranslation();
  const { openModal } = useModalAction();
  const router = useRouter();
  const { role } = getAuthCredentials();

  function handleDelete() {
    openModal(deleteModalView, id);
  }

  function handleEditModal() {
    openModal(editModalView, id);
  }

  function handleUserStatus(type: string) {
    openModal('BAN_CUSTOMER', { id, type });
  }

  function handleAddWalletPoints() {
    openModal('ADD_WALLET_POINTS', id);
  }

  function handleMakeAdmin() {
    openModal('MAKE_ADMIN', id);
  }

  function handleUpdateRefundStatus() {
    openModal('UPDATE_REFUND', id);
  }

  function handleShopStatus(status: boolean) {
    if (status === true) {
      openModal('SHOP_APPROVE_VIEW', id);
    } else {
      openModal('SHOP_DISAPPROVE_VIEW', id);
    }
  }

  function handleTermsStatus(status: boolean) {
    if (status === true) {
      openModal('TERM_APPROVE_VIEW', id);
    } else {
      openModal('TERM_DISAPPROVE_VIEW', id);
    }
  }

  function handleCouponStatus(status: boolean) {
    if (status === true) {
      openModal('COUPON_APPROVE_VIEW', id);
    } else {
      openModal('COUPON_DISAPPROVE_VIEW', id);
    }
  }

  function handleReplyQuestion() {
    openModal('REPLY_QUESTION', id);
  }

  function handleVendorFlashSaleStatus(status: boolean) {
    if (status !== true) {
      openModal('VENDOR_FS_REQUEST_APPROVE_VIEW', id);
    } else {
      openModal('VENDOR_FS_REQUEST_DISAPPROVE_VIEW', id);
    }
  }

  // TODO: need to be checked about last coupon code.

  return (
    <div className="inline-flex items-center w-auto gap-3">
      {showReplyQuestion && (
        <button
          onClick={handleReplyQuestion}
          className="transition duration-200 text-accent hover:text-accent-hover focus:outline-none"
        >
          {t('form:button-text-reply')}
        </button>
      )}
      {showMakeAdminButton && (
        <button
          onClick={handleMakeAdmin}
          className="transition duration-200 text-accent hover:text-accent-hover focus:outline-none"
          title={t('common:text-make-admin')}
        >
          <AdminIcon width={17} />
        </button>
      )}
      {showAddWalletPoints && (
        <button
          onClick={handleAddWalletPoints}
          className="transition duration-200 text-accent hover:text-accent-hover focus:outline-none"
          title={t('common:text-add-wallet-points')}
        >
          <WalletPointsIcon width={18} />
        </button>
      )}

      {changeRefundStatus && (
        <button
          onClick={handleUpdateRefundStatus}
          className="transition duration-200 text-accent hover:text-accent-hover focus:outline-none"
          title={t('common:text-change-refund-status')}
        >
          <CheckMarkCircle width={20} />
        </button>
      )}

      {editModalView && (
        <button
          onClick={handleEditModal}
          className="transition duration-200 text-body hover:text-heading focus:outline-none"
          title={t('common:text-edit')}
        >
          <EditIcon width={16} />
        </button>
      )}
      {approveButton &&
        (!isShopActive ? (
          <button
            onClick={() => handleShopStatus(true)}
            className="transition duration-200 text-accent hover:text-accent-hover focus:outline-none"
            title={t('common:text-approve-shop')}
          >
            <CheckMarkCircle width={16} />
          </button>
        ) : (
          <button
            onClick={() => handleShopStatus(false)}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={t('common:text-disapprove-shop')}
          >
            <CloseFillIcon width={16} />
          </button>
        ))}

      {couponApproveButton &&
        role === SUPER_ADMIN &&
        (!isCouponApprove ? (
          <button
            onClick={() => handleCouponStatus(true)}
            className="ml-3 transition duration-200 text-accent hover:text-accent-hover focus:outline-none"
            title={t('common:text-approve-coupon')}
          >
            <CheckMarkCircle width={18} />
          </button>
        ) : (
          <button
            onClick={() => handleCouponStatus(false)}
            className="ml-3 text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={t('common:text-disapprove-coupon')}
          >
            <CloseFillIcon width={18} />
          </button>
        ))}

      {termApproveButton &&
        (!isTermsApproved ? (
          <button
            onClick={() => handleTermsStatus(true)}
            className="transition duration-200 text-accent hover:text-accent-hover focus:outline-none"
            title={t('common:text-approve-shop')}
          >
            <CheckMarkCircle width={16} />
          </button>
        ) : (
          <button
            onClick={() => handleTermsStatus(false)}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={t('common:text-disapprove-shop')}
          >
            <CloseFillIcon width={17} />
          </button>
        ))}
      {userStatus && (
        <>
          {isUserActive ? (
            <button
              onClick={() => handleUserStatus('ban')}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={t('common:text-ban-user')}
            >
              <BanUser width={16} />
            </button>
          ) : (
            <button
              onClick={() => handleUserStatus('active')}
              className="transition duration-200 text-accent hover:text-accent focus:outline-none"
              title={t('common:text-activate-user')}
            >
              <CheckMarkCircle width={16} />
            </button>
          )}
        </>
      )}
      {editUrl && (
        <Link
          href={editUrl}
          className="text-base transition duration-200 hover:text-heading"
          title={t('common:text-edit')}
        >
          <EditIcon width={15} />
        </Link>
      )}
      {enablePreviewMode && (
        <>
          {previewUrl && (
            <Link
              href={previewUrl}
              className="text-base transition duration-200 hover:text-heading"
              title={t('common:text-preview')}
              target="_blank"
            >
              <EyeIcon width={18} />
            </Link>
          )}
        </>
      )}
      {detailsUrl && (
        <Link
          href={detailsUrl}
          className="text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          locale={customLocale}
        >
          <Eye className="w-5 h-5" />
        </Link>
      )}

      {deleteModalView &&
        (role !== STAFF ||
          router.asPath !== `/${router.query.shop}${Routes.coupon.list}`) && (
          <button
            onClick={handleDelete}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={t('common:text-delete')}
          >
            <TrashIcon width={14} />
          </button>
        )}

      {/* {deleteModalView && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={t('common:text-delete')}
        >
          <TrashIcon width={14} />
        </button>
      )} */}

      {flashSaleVendorRequestApproveButton &&
        (isFlashSaleVendorRequestApproved ? (
          <button
            onClick={() => handleVendorFlashSaleStatus(true)}
            className="transition duration-200 text-red-500 hover:text-red-600 focus:outline-none"
            title="Disapprove request ?"
          >
            <CloseFillIcon width={17} />
          </button>
        ) : (
          <button
            onClick={() => handleVendorFlashSaleStatus(false)}
            className="text-green-500 transition duration-200 hover:text-green-600 focus:outline-none"
            title="Approve request ?"
          >
            <CheckMarkCircle width={16} />
          </button>
        ))}
    </div>
  );
};

export default ActionButtons;
