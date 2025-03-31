import { RefundPolicy } from '@/types';
import { useSanitizeContent } from '@/utils/sanitize-content';

const RefundPolicyDetails = ({
  refundPolicy,
}: {
  refundPolicy: RefundPolicy;
}) => {
  const description = useSanitizeContent({
    description: refundPolicy?.description as string,
  });
  return (
    <div className="rounded bg-white px-8 py-10 shadow">
      {refundPolicy?.title ? (
        <h3 className="mb-4 text-[22px] font-bold">{refundPolicy?.title}</h3>
      ) : (
        ''
      )}

      {description ? (
        <p
          className="text-[15px] leading-[1.75em] text-[#5A5A5A] react-editor-description"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default RefundPolicyDetails;
