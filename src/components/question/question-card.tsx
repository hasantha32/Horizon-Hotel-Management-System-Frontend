import ActionButtons from '@/components/common/action-buttons';

type QuestionCardProps = {
  className?: any;
  record: any;
  id: any;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ record, id }) => {
  const { question, answer } = record;

  return (
    <div>
      <h3 className="text mb-2 text-sm font-semibold text-heading">
        <span className="me-1 inline-block uppercase">Q:</span>
        {question}{' '}
      </h3>
      {answer ? (
        <p className="text-sm">
          <span className="me-1 inline-block font-semibold uppercase text-heading">
            A:
          </span>
          {answer}
        </p>
      ) : (
        <ActionButtons id={id} showReplyQuestion={true} />
      )}
    </div>
  );
};

export default QuestionCard;
