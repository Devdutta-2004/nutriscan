import React, { useRef } from 'react';
import { motion, useInView, Easing, Variants, MotionStyle } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface StaggeredTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  segmentBy?: 'chars' | 'words' | 'lines';
  separator?: string;
  delay?: number; // Delay between segments in seconds (or milliseconds / 1000)
  duration?: number;
  easing?: any;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  blur?: boolean;
  staggerDirection?: 'forward' | 'reverse' | 'center';
  threshold?: number;
  rootMargin?: string;
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  from?: Record<string, any>;
  to?: Record<string, any>;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  as: Component = 'p',
  className = '',
  segmentBy = 'words',
  separator,
  delay = 0.08,
  duration = 0.5,
  easing = [0.25, 0.1, 0.25, 1],
  direction = 'top',
  blur = true,
  staggerDirection = 'forward',
  threshold = 0.1,
  rootMargin = '0px',
  respectReducedMotion = true,
  exitOnScrollOut = false,
  from,
  to,
  onAnimationComplete,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: threshold,
    once: !exitOnScrollOut,
  });

  // Split text into segments
  const segments: string[] = React.useMemo(() => {
    if (!text) return [];
    if (separator !== undefined) {
      return text.split(separator);
    }
    if (segmentBy === 'chars') {
      return Array.from(text);
    }
    if (segmentBy === 'lines') {
      return text.split('\n');
    }
    // Default words
    return text.split(/(\s+)/).filter((s) => s.length > 0);
  }, [text, segmentBy, separator]);

  // Direction offsets
  const getDirectionOffset = () => {
    switch (direction) {
      case 'top':
        return { y: 24, x: 0 };
      case 'bottom':
        return { y: -24, x: 0 };
      case 'left':
        return { x: 28, y: 0 };
      case 'right':
        return { x: -28, y: 0 };
      default:
        return { y: 24, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  // Compute staggered delay index based on staggerDirection
  const getSegmentDelay = (index: number, total: number) => {
    // If delay given in ms (> 1), convert to seconds
    const d = delay > 1 ? delay / 1000 : delay;

    if (staggerDirection === 'reverse') {
      return (total - 1 - index) * d;
    }
    if (staggerDirection === 'center') {
      const mid = (total - 1) / 2;
      return Math.abs(index - mid) * d;
    }
    // forward
    return index * d;
  };

  const totalSegments = segments.length;

  return (
    <Component
      ref={ref}
      className={cn('inline-block leading-tight font-sans overflow-hidden', className)}
      style={style}
    >
      {segments.map((segment, idx) => {
        const isSpace = /^\s+$/.test(segment);
        const segDelay = getSegmentDelay(idx, totalSegments);

        if (isSpace) {
          return <span key={idx}> </span>;
        }

        const initialVariant = from || {
          opacity: 0,
          y: offset.y,
          x: offset.x,
          filter: blur ? 'blur(8px)' : 'none',
        };

        const animateVariant = to || {
          opacity: 1,
          y: 0,
          x: 0,
          filter: blur ? 'blur(0px)' : 'none',
        };

        return (
          <motion.span
            key={idx}
            className="inline-block transform-gpu will-change-[transform,opacity,filter]"
            initial={initialVariant}
            animate={isInView ? animateVariant : initialVariant}
            transition={{
              duration,
              delay: segDelay,
              ease: easing,
            }}
            onAnimationComplete={idx === totalSegments - 1 ? onAnimationComplete : undefined}
          >
            {segment}
          </motion.span>
        );
      })}
    </Component>
  );
};

export default StaggeredText;
