import React, { cloneElement, RefObject, useRef, useState } from 'react';
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
  useDismiss,
  useRole,
  arrow,
  useTransitionStyles,
  FloatingPortal,
} from '@floating-ui/react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

const tooltipStyles = {
  base: 'text-center z-40 max-w-sm',
  shadow: {
    sm: 'drop-shadow-md',
    md: 'drop-shadow-lg',
    lg: 'drop-shadow-xl',
    xl: 'drop-shadow-2xl',
  },
  size: {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-2 text-sm leading-[1.7]',
    lg: 'px-3.5 py-2 text-base',
    xl: 'px-4 py-2.5 text-base',
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
      default: 'fill-muted-black',
      primary: 'fill-accent',
      danger: 'fill-red-500',
      info: 'fill-blue-500',
      success: 'fill-green-500',
      warning: 'fill-orange-500',
    },
  },
  variant: {
    solid: {
      base: '',
      color: {
        default: 'text-white bg-muted-black',
        primary: 'text-white bg-accent',
        danger: 'text-white bg-red-500',
        info: 'text-white bg-blue-500',
        success: 'text-white bg-green-500',
        warning: 'text-white bg-orange-500',
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

export type TooltipProps = {
  children: JSX.Element & { ref?: RefObject<any> };
  content: React.ReactNode;
  color?: keyof typeof tooltipStyles.variant.solid.color;
  size?: keyof typeof tooltipStyles.size;
  rounded?: keyof typeof tooltipStyles.rounded;
  shadow?: keyof typeof tooltipStyles.shadow;
  placement?: Placement;
  gap?: number;
  animation?: keyof typeof tooltipAnimation;
  className?: string;
  arrowClassName?: string;
  showArrow?: boolean;
};

export function Tooltip({
  children,
  content,
  gap = 8,
  animation = 'zoomIn',
  placement = 'top',
  size = 'md',
  rounded = 'DEFAULT',
  shadow = 'md',
  color = 'default',
  className,
  arrowClassName,
  showArrow = true,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const { t } = useTranslation();
  const { x, y, refs, strategy, context } = useFloating({
    placement,
    open: open,
    onOpenChange: setOpen,
    middleware: [
      arrow({ element: arrowRef }),
      offset(gap),
      flip(),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useRole(context, { role: 'tooltip' }),
    useDismiss(context),
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: { open: 150, close: 150 },
    ...tooltipAnimation[animation],
  });

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: refs.setReference, ...children.props }),
      )}

      {(isMounted || open) && (
        <FloatingPortal>
          <div
            role="tooltip"
            ref={refs.setFloating}
            className={cn(
              tooltipStyles.base,
              tooltipStyles.size[size],
              tooltipStyles.rounded[rounded],
              tooltipStyles.variant.solid.base,
              tooltipStyles.variant.solid.color[color],
              tooltipStyles.shadow[shadow],
              className,
            )}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...styles,
            }}
            {...getFloatingProps()}
          >
            {t(`${content}`)}

            {showArrow && (
              <FloatingArrow
                ref={arrowRef}
                context={context}
                className={cn(tooltipStyles.arrow.color[color], arrowClassName)}
                style={{ strokeDasharray: '0,14, 5' }}
              />
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

Tooltip.displayName = 'Tooltip';
