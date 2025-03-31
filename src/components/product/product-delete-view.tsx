import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteProductMutation, useDeleteProductMutation_v2 } from '@/data/product';
import { getErrorMessage } from '@/utils/form-error';

const ProductDeleteView = () => {
  // const { mutate: deleteProduct, isLoading: loading } =
  //   useDeleteProductMutation();
  const { mutate: deleteProduct, isLoading: loading } =
    useDeleteProductMutation_v2();
  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    try {
      deleteProduct({ id: data });
      closeModal();
    } catch (error) {
      closeModal();
      getErrorMessage(error);
    }
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default ProductDeleteView;
