import { useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import styles from '@/sections/InventoryDemo.module.css';

export type GuideStep = 1 | 2 | 3 | 4;

type GuideTarget = 'product' | 'receipt' | 'mode';
type Placement = 'right' | 'left' | 'below' | 'above';

type GuideContent = {
  target: GuideTarget;
  title: string;
  body: string;
  supportingText?: string;
  actionLabel?: string;
};

type GuideRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type UsableBounds = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

type CoachmarkSize = {
  width: number;
  height: number;
};

type PlacementResult = {
  placement: Placement;
  rect: GuideRect;
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
    body: '#1001 · USB-C Cable · $5.00',
    actionLabel: 'Got it',
  },
  2: {
    target: 'product',
    title: 'Change the price',
    body: 'Set it to $8.00, then Save.',
  },
  3: {
    target: 'receipt',
    title: 'The old receipt changed',
    body: '$5.00 became $8.00.',
    supportingText: "That's the bug.",
    actionLabel: 'Fix it',
  },
  4: {
    target: 'mode',
    title: 'Protect the history',
    body: 'Switch to Production-ready.',
  },
};

const completionContent: GuideContent = {
  target: 'mode',
  title: 'Snapshot preserved.',
  body: 'Receipt #1001 stays $5.00.',
};

const EDGE_GUTTER = 16;
const TARGET_GAP = 16;
const COLLISION_CLEARANCE = 12;
const COACHMARK_WIDTH = 340;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function rectsIntersect(a: GuideRect, b: GuideRect, gap = 0): boolean {
  return (
    a.left < b.left + b.width + gap &&
    a.left + a.width > b.left - gap &&
    a.top < b.top + b.height + gap &&
    a.top + a.height > b.top - gap
  );
}

function clampRect(rect: GuideRect, bounds: UsableBounds): GuideRect | null {
  const availableWidth = bounds.right - bounds.left;
  const availableHeight = bounds.bottom - bounds.top;
  if (rect.width > availableWidth || rect.height > availableHeight) return null;

  return {
    ...rect,
    left: clamp(rect.left, bounds.left, bounds.right - rect.width),
    top: clamp(rect.top, bounds.top, bounds.bottom - rect.height),
  };
}

function getPlacementOrder(
  target: GuideTarget,
  targetRect: GuideRect,
  bounds: UsableBounds,
  narrow: boolean,
): Placement[] {
  if (narrow) return ['below', 'above'];
  if (target === 'product') return ['right', 'left', 'below', 'above'];
  if (target === 'mode') return ['below', 'above', 'right', 'left'];

  const leftSpace = targetRect.left - bounds.left;
  const rightSpace = bounds.right - (targetRect.left + targetRect.width);
  return leftSpace >= rightSpace
    ? ['left', 'right', 'below', 'above']
    : ['right', 'left', 'below', 'above'];
}

function getCandidateRect(
  placement: Placement,
  target: GuideRect,
  width: number,
  height: number,
): GuideRect {
  switch (placement) {
    case 'right':
      return {
        left: target.left + target.width + TARGET_GAP,
        top: target.top + (target.height - height) / 2,
        width,
        height,
      };
    case 'left':
      return {
        left: target.left - width - TARGET_GAP,
        top: target.top + (target.height - height) / 2,
        width,
        height,
      };
    case 'below':
      return {
        left: target.left + (target.width - width) / 2,
        top: target.top + target.height + TARGET_GAP,
        width,
        height,
      };
    case 'above':
      return {
        left: target.left + (target.width - width) / 2,
        top: target.top - height - TARGET_GAP,
        width,
        height,
      };
  }
}

function findPlacement(
  target: GuideTarget,
  targetRect: GuideRect,
  bounds: UsableBounds,
  width: number,
  height: number,
  narrow: boolean,
): PlacementResult | null {
  const candidates = getPlacementOrder(target, targetRect, bounds, narrow);

  for (const placement of candidates) {
    const candidate = clampRect(
      getCandidateRect(placement, targetRect, width, height),
      bounds,
    );
    if (candidate && !rectsIntersect(candidate, targetRect, COLLISION_CLEARANCE)) {
      return { placement, rect: candidate };
    }
  }

  // If the nearby positions do not fit, search the visible corners of the
  // section. This keeps the active control clear while using dimmed space.
  const corners: Array<{ placement: Placement; left: number; top: number }> = [
    { placement: 'right', left: bounds.right - width, top: bounds.top },
    { placement: 'left', left: bounds.left, top: bounds.top },
    { placement: 'right', left: bounds.right - width, top: bounds.bottom - height },
    { placement: 'left', left: bounds.left, top: bounds.bottom - height },
  ];

  for (const corner of corners) {
    const candidate = clampRect({ ...corner, width, height }, bounds);
    if (candidate && !rectsIntersect(candidate, targetRect, COLLISION_CLEARANCE)) {
      return { placement: corner.placement, rect: candidate };
    }
  }

  return null;
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
  const [spotlight, setSpotlight] = useState<GuideRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [containerWidth, setContainerWidth] = useState(820);
  const [usableBounds, setUsableBounds] = useState<UsableBounds>({
    top: EDGE_GUTTER,
    left: EDGE_GUTTER,
    right: 804,
    bottom: 812,
  });
  const [coachmarkSize, setCoachmarkSize] = useState<CoachmarkSize>({ width: 0, height: 0 });
  const content = isComplete && step === 4 ? completionContent : stepContent[step];
  const describedBy = [
    'inventory-guide-body',
    content.supportingText ? 'inventory-guide-supporting' : null,
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
      const width = sectionBox.width || section.clientWidth || 820;
      const height = sectionBox.height || section.clientHeight || 0;
      const nextBounds: UsableBounds = {
        left: Math.max(EDGE_GUTTER, -sectionBox.left + EDGE_GUTTER),
        right: Math.min(width - EDGE_GUTTER, window.innerWidth - sectionBox.left - EDGE_GUTTER),
        top: Math.max(EDGE_GUTTER, -sectionBox.top + EDGE_GUTTER),
        bottom: Math.min(
          height - EDGE_GUTTER,
          window.innerHeight - sectionBox.top - EDGE_GUTTER,
        ),
      };

      setContainerWidth(width);
      setUsableBounds((current) =>
        current.left === nextBounds.left &&
        current.right === nextBounds.right &&
        current.top === nextBounds.top &&
        current.bottom === nextBounds.bottom
          ? current
          : nextBounds,
      );
      setSpotlight({
        top: targetBox.top - sectionBox.top,
        left: targetBox.left - sectionBox.left,
        width: targetBox.width,
        height: targetBox.height,
      });

      if (coachmarkBox?.width && coachmarkBox?.height) {
        setCoachmarkSize((current) =>
          current.width === coachmarkBox.width && current.height === coachmarkBox.height
            ? current
            : { width: coachmarkBox.width, height: coachmarkBox.height },
        );
      }
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (observer) {
      if (sectionRef.current) observer.observe(sectionRef.current);
      if (targetRef.current) observer.observe(targetRef.current);
      if (coachmarkRef.current) observer.observe(coachmarkRef.current);
    }

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
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

  const narrow = containerWidth < 680;
  const coachmarkWidth = Math.max(
    0,
    Math.min(COACHMARK_WIDTH, narrow ? containerWidth - EDGE_GUTTER * 2 : COACHMARK_WIDTH),
  );
  const placement = coachmarkSize.height
    ? findPlacement(
        content.target,
        spotlight,
        usableBounds,
        coachmarkWidth,
        coachmarkSize.height,
        narrow,
      )
    : null;
  const coachmarkStyle: CSSProperties = {
    left: placement?.rect.left ?? usableBounds.left,
    top: placement?.rect.top ?? usableBounds.top,
    width: coachmarkWidth,
    visibility: !coachmarkSize.height || placement ? 'visible' : 'hidden',
  };

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
        data-guide-placement={placement?.placement ?? 'measuring'}
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
        {content.actionLabel && !isComplete ? (
          <button type="button" className={styles.guideAction} onClick={onAdvance}>
            {content.actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
