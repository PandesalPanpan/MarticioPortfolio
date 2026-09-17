import type { PointerState } from '@/sections/InventoryDemo';
import styles from '@/sections/InventoryDemo.module.css';

export function StepPointer({
  step,
  state,
  label,
}: {
  step: number;
  state: PointerState;
  label: string;
}) {
  return (
    <span
      className={`${styles.stepPointer} ${styles[`stepPointer${state[0].toUpperCase()}${state.slice(1)}`]}`}
      aria-label={`Step ${step}: ${label}`}
      title={label}
    >
      {step}
    </span>
  );
}
