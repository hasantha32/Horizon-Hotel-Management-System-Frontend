import Attribute from '@/components/ui/attribute';
import Scrollbar from '@/components/ui/scrollbar';
import { useAttributes } from './attributes.context';

interface Props {
  variations: any;
}
const VariationGroups: React.FC<Props> = ({ variations }) => {
  const { attributes, setAttributes } = useAttributes();
  const replaceHyphens = (str: string) => {
    return str.replace(/-/g, ' ');
  };
  return (
    <>
      {Object.keys(variations).map((variationName, index) => (
        <div
          className="flex items-center border-b  border-border-200 border-opacity-70 py-4 first:pt-0 last:border-b-0 last:pb-0"
          key={index}
        >
          <span className="me-4 inline-block min-w-[60px] whitespace-nowrap text-sm font-semibold capitalize leading-none text-heading">
            {replaceHyphens(variationName)}:
          </span>
          <div className="-mb-5 w-full overflow-hidden">
            <Scrollbar
              className="w-full pb-5"
              options={{
                scrollbars: {
                  autoHide: 'never',
                },
              }}
            >
              <div className="space-s-4 flex w-full">
                {variations[variationName].map((attribute: any) => (
                  <Attribute
                    className={variationName}
                    color={attribute.meta ? attribute.meta : attribute?.value}
                    active={attributes[variationName] === attribute.value}
                    value={attribute.value}
                    key={attribute.id}
                    onClick={() =>
                      setAttributes((prev: any) => ({
                        ...prev,
                        [variationName]: attribute.value,
                      }))
                    }
                  />
                ))}
              </div>
            </Scrollbar>
          </div>
        </div>
      ))}
    </>
  );
};

export default VariationGroups;
