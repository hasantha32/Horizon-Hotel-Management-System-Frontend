import React, { cloneElement, RefObject, useRef, useState } from 'react';
import cn from 'classnames';
import {
  Placement,
  FloatingArrow,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useClick,
  useDismiss,
  useRole,
  arrow,
  useTransitionStyles,
  FloatingPortal,
} from '@floating-ui/react';

const tooltipClasses = {
  base: 'text-center z-40 min-w-max',
  shadow: {
    sm: 'drop-shadow-md',
    DEFAULT: 'drop-shadow-md translate-x-3',
    lg: 'drop-shadow-xl',
    xl: 'drop-shadow-2xl',
  },
  size: {
    sm: 'px-2.5 py-1 text-xs',
    DEFAULT: 'px-5 py-2.5 text-sm w-44',
    lg: 'px-5 py-2 text-base',
    xl: 'px-6 py-2.5 text-lg',
  },
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-md',
    DEFAULT: 'rounded-md',
    lg: 'rounded-lg',
    pill: 'rounded-full',
  },
  arrow: {
    color: {
      DEFAULT: 'fill-gray-900',
      invert: 'fill-gray-0 [&>path]:stroke-gray-300',
      primary: 'fill-primary',
      secondary: 'fill-secondary',
      danger: 'fill-red',
      info: 'fill-blue',
      success: 'fill-green',
      warning: 'fill-orange',
    },
  },
  variant: {
    solid: {
      base: '',
      color: {
        DEFAULT: 'text-gray-0 bg-white',
        invert: 'bg-gray-0 !text-gray-900 border border-gray-300',
        primary: 'text-white bg-primary',
        secondary: 'text-white bg-secondary',
        danger: 'text-white bg-red',
        info: 'text-white bg-blue',
        success: 'text-white bg-green',
        warning: 'text-white bg-orange',
      },
    },
  },
};

const tooltipAnimation = {
  fadeIn: {
    initial: {
      opacity: 0,
    },
    close: {
      opacity: 0,
    },
  },
  zoomIn: {
    initial: {
      opacity: 0,
      transform: 'scale(0.96)',
    },
    close: {
      opacity: 0,
      transform: 'scale(0.96)',
    },
  },
  slideIn: {
    initial: {
      opacity: 0,
      transform: 'translateY(4px)',
    },
    close: {
      opacity: 0,
      transform: 'translateY(4px)',
    },
  },
};

type Content = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TooltipProps = {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element & { ref?: RefObject<any> };
  content: ({ open, setOpen }: Content) => React.ReactNode;
  color?: keyof typeof tooltipClasses.variant.solid.color;
  size?: keyof typeof tooltipClasses.size;
  rounded?: keyof typeof tooltipClasses.rounded;
  shadow?: keyof typeof tooltipClasses.shadow;
  placement?: Placement;
  gap?: number;
  animation?: keyof typeof tooltipAnimation;
  className?: string;
  tooltipArrowClassName?: string;
  showArrow?: boolean;
  isPopover?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function AdvancePopover({
  isOpen,
  setIsOpen,
  children,
  content,
  gap = 8,
  animation = 'zoomIn',
  placement = 'bottom',
  size = 'DEFAULT',
  rounded = 'DEFAULT',
  shadow = 'DEFAULT',
  color = 'DEFAULT',
  className,
  tooltipArrowClassName,
  showArrow = false,
  isPopover = false,
  onMouseEnter,
  onMouseLeave,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  const { x, y, refs, strategy, context } = useFloating({
    placement,
    open: isOpen ?? open,
    onOpenChange: setIsOpen ?? setOpen,
    middleware: [
      arrow({ element: arrowRef }),
      offset(gap),
      flip(),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { enabled: !isPopover }),
    useFocus(context),
    useRole(context, { role: 'tooltip' }),
    useDismiss(context),
    useClick(context, { enabled: isPopover }),
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: { open: 100, close: 200 },
    ...tooltipAnimation[animation],
  });

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {cloneElement(
        children,
        getReferenceProps({ ref: refs.setReference, ...children.props })
      )}
      {(isMounted || open) && (
        <FloatingPortal>
          <div
            role="tooltip"
            ref={refs.setFloating}
            className={cn(
              tooltipClasses.base,
              tooltipClasses.size[size],
              tooltipClasses.rounded[rounded],
              tooltipClasses.variant.solid.base,
              tooltipClasses.variant.solid.color[color],
              tooltipClasses.shadow[shadow],
              className
            )}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...styles,
            }}
            {...getFloatingProps()}
          >
            {isOpen ? (
              // @ts-ignore
              <>{content({ isOpen, setIsOpen })}</>
            ) : (
              <>{content({ open, setOpen })}</>
            )}

            {showArrow && (
              <>
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  data-testid="tooltip-arrow"
                  className={cn(
                    tooltipClasses.arrow.color[color],
                    tooltipArrowClassName
                  )}
                  style={{ strokeDasharray: '0,14, 5' }}
                />
              </>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

AdvancePopover.displayName = 'AdvancePopover';
