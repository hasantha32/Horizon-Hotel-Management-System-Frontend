import cn from 'classnames'

interface useOpenAiProps {
  onClick: any;
  title: string;
  className?: string;
}

export default function OpenAIButton({ className, onClick, title, ...rest }: useOpenAiProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'absolute right-0 -top-1 z-10 cursor-pointer text-sm font-medium text-accent hover:text-accent-hover', className
      )}
      {...rest}
    >
      {title}
    </div>
   )
}
