import type { KeyboardEvent, RefObject } from 'react';
import type { ArchitectureMode } from './domain';
import styles from '@/sections/InventoryDemo.module.css';

export function ModeToggle({
  mode,
  onChange,
  targetRef,
  isGuideTarget = false,
}: {
  mode: ArchitectureMode;
  onChange: (mode: ArchitectureMode) => void;
  targetRef?: RefObject<HTMLDivElement | null>;
  isGuideTarget?: boolean;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const nextMode: ArchitectureMode =
      event.key === 'Home'
        ? 'usual'
        : event.key === 'End'
          ? 'production'
          : event.key === 'ArrowLeft'
            ? 'usual'
            : 'production';
    onChange(nextMode);
  };

  return (
    <div
      ref={targetRef}
      className={`${styles.modeToggle} ${isGuideTarget ? styles.guideTargetActive : ''}`}
      data-testid="mode-toggle"
      role="tablist"
      aria-label="Architecture mode"
      data-guide-target={isGuideTarget ? 'true' : 'false'}
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'usual'}
        className={`${styles.modeTab} ${mode === 'usual' ? styles.modeTabActiveUsual : ''}`}
        onClick={() => onChange('usual')}
        onKeyDown={handleKeyDown}
      >
        Naive approach
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'production'}
        className={`${styles.modeTab} ${mode === 'production' ? styles.modeTabActiveProduction : ''}`}
        onClick={() => onChange('production')}
        onKeyDown={handleKeyDown}
      >
        Production-ready approach
      </button>
    </div>
  );
}
