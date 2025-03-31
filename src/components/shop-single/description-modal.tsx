import { useModalState } from '@/components/ui/modal/modal.context';

const DescriptionView = () => {
  const {
    data: { content, title },
  } = useModalState();
  return (
    <div className="m-auto flex w-full max-w-[66.125rem] flex-col rounded-xl bg-white p-4 md:rounded-xl md:p-8">
      <h2 className="mb-4 text-xl font-semibold text-muted-black">{title}</h2>
      <div
        className="flex-1 overflow-auto leading-8 text-[#666]"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </div>
  );
};

export default DescriptionView;
