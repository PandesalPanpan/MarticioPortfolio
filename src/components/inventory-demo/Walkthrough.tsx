import { useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import styles from '@/sections/InventoryDemo.module.css';

export type GuideStep = 1 | 2 | 3;

type GuideTarget = 'product' | 'receipt' | 'mode';

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type WalkthroughProps = {
  step: GuideStep;
  sectionRef: RefObject<HTMLElement | null>;
  productRef: RefObject<HTMLElement | null>;
  receiptRef: RefObject<HTMLElement | null>;
  modeRef: RefObject<HTMLElement | null>;
  coachmarkRef: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
  isComplete: boolean;
  onClose: () => void;
};

const stepContent: Record<GuideStep, { target: GuideTarget; title: string; body: string }> = {
  1: {
    target: 'product',
    title: 'Edit the current product',
    body: 'Try changing the product name or price, then save it. Try $5.00 to $8.00.',
  },
  2: {
    target: 'receipt',
    title: 'The old receipt changed',
    body: 'This sale happened before your edit, but its name or price changed too. That is the problem.',
  },
  3: {
    target: 'mode',
    title: 'Now compare the production approach',
    body: 'Switch to Production-ready. The same sale should stay exactly as it was when it happened.',
  },
};

const completionContent = {
  target: 'mode' as const,
  title: 'Snapshot preserved',
  body: 'The receipt stayed true even though the catalog changed.',
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function getCoachmarkStyle(
  step: GuideStep,
  target: SpotlightRect,
  containerWidth: number,
): CSSProperties {
  const narrow = containerWidth < 680;
  const requestedWidth = step === 3 ? 350 : 318;
  const width = narrow ? Math.max(0, containerWidth - 32) : requestedWidth;
  const horizontalPadding = narrow ? 16 : 24;
  const bottomLimit = Math.max(horizontalPadding, containerWidth - width - horizontalPadding);

  if (narrow) {
    const estimatedHeight = step === 3 ? 184 : 168;
    const aboveTop = target.top - estimatedHeight - 16;
    if (aboveTop >= horizontalPadding) {
      return { left: horizontalPadding, top: aboveTop, width };
    }
  }

  if (!narrow && step === 1 && containerWidth - (target.left + target.width) >= width + 24) {
    return {
      left: clamp(target.left + target.width + 30, horizontalPadding, bottomLimit),
      top: target.top + 49,
      width,
    };
  }

  if (!narrow && step === 2 && target.left >= width + 24) {
    return {
      left: clamp(target.left - width - 48, horizontalPadding, bottomLimit),
      top: target.top + 57,
      width,
    };
  }

  return {
    left: clamp((containerWidth - width) / 2, horizontalPadding, bottomLimit),
    top: target.top + target.height + 16,
    width,
  };
}

export function Walkthrough({
  step,
  sectionRef,
  productRef,
  receiptRef,
  modeRef,
  coachmarkRef,
  reducedMotion,
  isComplete,
  onClose,
}: WalkthroughProps) {
  const [spotlight, setSpotlight] = useState<SpotlightRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [containerWidth, setContainerWidth] = useState(820);
  const content = step === 3 && isComplete ? completionContent : stepContent[step];

  const targetRef: RefObject<HTMLElement | null> =
    content.target === 'product' ? productRef : content.target === 'receipt' ? receiptRef : modeRef;

  useLayoutEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      const target = targetRef.current;
      if (!section || !target) return;

      const sectionBox = section.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      setContainerWidth(sectionBox.width || section.clientWidth || 820);
      setSpotlight({
        top: targetBox.top - sectionBox.top,
        left: targetBox.left - sectionBox.left,
        width: targetBox.width,
        height: targetBox.height,
      });
    };

    measure();
    window.addEventListener('resize', measure);

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (observer) {
      if (sectionRef.current) observer.observe(sectionRef.current);
      const target = targetRef.current;
      if (target) observer.observe(target);
    }

    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, [content.target, sectionRef, targetRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const target = targetRef.current;

    if (target?.scrollIntoView) {
      target.scrollIntoView({
        block: 'center',
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }

    if (content.target === 'product') {
      target?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();
      return;
    }

    if (content.target === 'mode') {
      target?.querySelector<HTMLButtonElement>('[role="tab"]:last-child')?.focus();
      return;
    }

    coachmarkRef.current?.focus({ preventScroll: true });
  }, [content.target, coachmarkRef, reducedMotion, targetRef]);

  const coachmarkStyle = getCoachmarkStyle(step, spotlight, containerWidth);

  return (
    <div id="inventory-guide" className={styles.guideOverlay} data-testid="inventory-guide">
      <div
        className={styles.guideShade}
        aria-hidden="true"
        style={{ height: Math.max(spotlight.top, 0) }}
      />
      <div
        className={styles.guideShade}
        aria-hidden="true"
        style={{
          top: spotlight.top,
          width: Math.max(spotlight.left, 0),
          height: spotlight.height,
        }}
      />
      <div
        className={styles.guideShade}
        aria-hidden="true"
        style={{
          top: spotlight.top,
          left: spotlight.left + spotlight.width,
          right: 0,
          height: spotlight.height,
        }}
      />
      <div
        className={styles.guideShade}
        aria-hidden="true"
        style={{ top: spotlight.top + spotlight.height, bottom: 0 }}
      />
      <div
        className={styles.guideSpotlight}
        aria-hidden="true"
        style={{
          top: spotlight.top - 1,
          left: spotlight.left - 1,
          width: spotlight.width + 2,
          height: spotlight.height + 2,
        }}
      />

      <div
        ref={coachmarkRef}
        className={styles.coachmark}
        style={coachmarkStyle}
        role="dialog"
        aria-modal="false"
        aria-labelledby="inventory-guide-title"
        aria-describedby="inventory-guide-body"
        tabIndex={-1}
      >
        <button
          type="button"
          className={styles.guideClose}
          onClick={onClose}
          aria-label="Exit guided demo"
        >
          <span aria-hidden="true">×</span>
        </button>
        <span className={styles.guideStep}>{step} OF 3</span>
        <h3 id="inventory-guide-title" className={styles.guideTitle}>
          {content.title}
        </h3>
        <p id="inventory-guide-body" className={styles.guideBody}>
          {content.body}
        </p>
      </div>
    </div>
  );
}
