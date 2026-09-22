import { useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import styles from '@/sections/InventoryDemo.module.css';

export type GuideStep = 1 | 2 | 3 | 4;

type GuideTarget = 'product' | 'receipt' | 'mode';

type GuideContent = {
  target: GuideTarget;
  title: string;
  body: string;
  supportingText?: string;
  hint?: string;
  actionLabel?: string;
};

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type CoachmarkSize = {
  width: number;
  height: number;
};

type WalkthroughProps = {
  step: GuideStep;
  sectionRef: RefObject<HTMLElement | null>;
  productRef: RefObject<HTMLElement | null>;
  receiptRef: RefObject<HTMLElement | null>;
  modeRef: RefObject<HTMLDivElement | null>;
  coachmarkRef: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
  isComplete: boolean;
  onAdvance: () => void;
  onClose: () => void;
};

const stepContent: Record<GuideStep, GuideContent> = {
  1: {
    target: 'receipt',
    title: 'Remember this receipt',
    body: 'This sale already happened. Receipt #1001 records a USB-C Cable sold for $5.00.',
    hint: 'Keep the name and price in mind. We are about to change the product catalog.',
    actionLabel: 'Got it',
  },
  2: {
    target: 'product',
    title: 'Now change the live catalog',
    body: 'Change the product name or price, then save it.',
    hint: 'Try changing $5.00 to $8.00.',
  },
  3: {
    target: 'receipt',
    title: 'The historical receipt changed',
    body: "Receipt #1001 already happened, but it changed when the catalog changed. The old $5.00 sale is now showing today's product data.",
    supportingText: 'That is the data integrity problem.',
    actionLabel: 'Show me the fix',
  },
  4: {
    target: 'mode',
    title: 'Now apply the production approach',
    body: 'Switch to Production-ready approach.',
    hint: 'The receipt should return to the values captured when the sale actually happened.',
  },
};

const completionContent: GuideContent = {
  target: 'mode',
  title: 'Snapshot preserved',
  body: 'Receipt #1001 still reflects the original $5.00 sale, even though the catalog changed.',
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function getEstimatedCoachmarkHeight(step: GuideStep, isComplete: boolean): number {
  if (isComplete) return 150;

  switch (step) {
    case 1:
      return 202;
    case 2:
      return 170;
    case 3:
      return 236;
    case 4:
      return 178;
  }
}

function getCoachmarkStyle(
  step: GuideStep,
  target: SpotlightRect,
  containerWidth: number,
  containerHeight: number,
  measuredHeight: number,
  isComplete: boolean,
): CSSProperties {
  const narrow = containerWidth < 680;
  const requestedWidth = step === 3 ? 360 : 330;
  const width = narrow ? Math.max(0, containerWidth - 32) : requestedWidth;
  const horizontalPadding = narrow ? 16 : 24;
  const bottomLimit = Math.max(horizontalPadding, containerWidth - width - horizontalPadding);
  const height = measuredHeight || getEstimatedCoachmarkHeight(step, isComplete);
  const topLimit = Math.max(horizontalPadding, containerHeight - height - horizontalPadding);

  if (narrow) {
    const aboveTop = target.top - height - 16;
    if (aboveTop >= horizontalPadding) {
      return { left: horizontalPadding, top: aboveTop, width };
    }

    return {
      left: horizontalPadding,
      top: clamp(target.top + target.height + 16, horizontalPadding, topLimit),
      width,
    };
  }

  const isReceiptObservation = step === 1 || step === 3;
  const centeredTop = clamp(
    target.top + (target.height - height) / 2,
    horizontalPadding,
    topLimit,
  );

  if (isReceiptObservation && containerWidth - (target.left + target.width) >= width + 24) {
    return {
      left: clamp(target.left + target.width + 24, horizontalPadding, bottomLimit),
      top: centeredTop,
      width,
    };
  }

  if (isReceiptObservation && target.left >= width + 24) {
    return {
      left: clamp(target.left - width - 24, horizontalPadding, bottomLimit),
      top: centeredTop,
      width,
    };
  }

  return {
    left: clamp((containerWidth - width) / 2, horizontalPadding, bottomLimit),
    top: clamp(target.top + target.height + 16, horizontalPadding, topLimit),
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
  onAdvance,
  onClose,
}: WalkthroughProps) {
  const [spotlight, setSpotlight] = useState<SpotlightRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [containerWidth, setContainerWidth] = useState(820);
  const [containerHeight, setContainerHeight] = useState(0);
  const [coachmarkSize, setCoachmarkSize] = useState<CoachmarkSize>({
    width: 0,
    height: 0,
  });
  const content = isComplete && step === 4 ? completionContent : stepContent[step];
  const describedBy = [
    'inventory-guide-body',
    content.supportingText ? 'inventory-guide-supporting' : null,
    content.hint ? 'inventory-guide-hint' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const targetRef: RefObject<HTMLElement | null> =
    content.target === 'product' ? productRef : content.target === 'receipt' ? receiptRef : modeRef;

  useLayoutEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      const target = targetRef.current;
      if (!section || !target) return;

      const sectionBox = section.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      const coachmarkBox = coachmarkRef.current?.getBoundingClientRect();
      setContainerWidth(sectionBox.width || section.clientWidth || 820);
      setContainerHeight(sectionBox.height || section.clientHeight || 0);
      setSpotlight({
        top: targetBox.top - sectionBox.top,
        left: targetBox.left - sectionBox.left,
        width: targetBox.width,
        height: targetBox.height,
      });

      if (coachmarkBox?.width && coachmarkBox?.height) {
        setCoachmarkSize((current) => {
          if (
            current.width === coachmarkBox.width &&
            current.height === coachmarkBox.height
          ) {
            return current;
          }

          return { width: coachmarkBox.width, height: coachmarkBox.height };
        });
      }
    };

    measure();
    window.addEventListener('resize', measure);

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (observer) {
      if (sectionRef.current) observer.observe(sectionRef.current);
      if (targetRef.current) observer.observe(targetRef.current);
      if (coachmarkRef.current) observer.observe(coachmarkRef.current);
    }

    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, [coachmarkRef, content, isComplete, sectionRef, targetRef]);

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

  const coachmarkStyle = getCoachmarkStyle(
    step,
    spotlight,
    containerWidth,
    containerHeight,
    coachmarkSize.height,
    isComplete,
  );

  return (
    <div
      id="inventory-guide"
      className={styles.guideOverlay}
      data-testid="inventory-guide"
      data-guide-step={step}
    >
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
        aria-live="polite"
        aria-atomic="true"
        aria-labelledby="inventory-guide-title"
        aria-describedby={describedBy}
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
        <span className={styles.guideStep} aria-label={`Step ${step} of 4`}>
          {step} OF 4
        </span>
        <h3 id="inventory-guide-title" className={styles.guideTitle}>
          {content.title}
        </h3>
        <p id="inventory-guide-body" className={styles.guideBody}>
          {content.body}
        </p>
        {content.supportingText ? (
          <p id="inventory-guide-supporting" className={styles.guideSupport}>
            {content.supportingText}
          </p>
        ) : null}
        {content.hint ? (
          <p id="inventory-guide-hint" className={styles.guideHint}>
            {content.hint}
          </p>
        ) : null}
        {content.actionLabel && !isComplete ? (
          <button type="button" className={styles.guideAction} onClick={onAdvance}>
            {content.actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
