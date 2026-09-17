import { useRef } from 'react';
import styles from '@/sections/InventoryDemo.module.css';

export function SellButton({
  active,
  pinned,
  onStart,
  onReset,
  onTogglePinned,
}: {
  active: boolean;
  pinned: boolean;
  onStart: () => void;
  onReset: () => void;
  onTogglePinned: () => void;
}) {
  const pointerType = useRef<string>('');

  return (
    <button
      type="button"
      className={styles.sellButton}
      aria-pressed={pinned}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
      }}
      onTouchStart={() => {
        pointerType.current = 'touch';
      }}
      onMouseEnter={onStart}
      onMouseLeave={onReset}
      onFocus={() => {
        if (pointerType.current !== 'touch') onStart();
      }}
      onBlur={onReset}
      onClick={() => {
        pointerType.current = '';
        onTogglePinned();
      }}
    >
      {active ? 'Sold 2 units ✓' : 'Sell 2 units →'}
    </button>
  );
}
