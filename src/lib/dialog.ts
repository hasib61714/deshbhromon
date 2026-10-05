import type { MouseEvent, RefCallback } from 'react';

// Accessible modal behaviour without restructuring components: spread
// `{...dialogProps(onClose, 'label')}` onto the full-screen backdrop element.
// Handles role/aria, Escape (topmost dialog only), backdrop click, initial
// focus, focus restore and background scroll lock.

const stack: Array<() => void> = [];
let locks = 0;
let previousOverflow = '';

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && stack.length) {
    e.stopPropagation();
    stack[stack.length - 1]();
  }
}

function attach(el: HTMLElement, close: () => void) {
  const opener = document.activeElement as HTMLElement | null;
  stack.push(close);
  if (stack.length === 1) document.addEventListener('keydown', onKeyDown);
  if (locks++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  if (!el.contains(document.activeElement)) el.focus({ preventScroll: true });

  return () => {
    const i = stack.lastIndexOf(close);
    if (i >= 0) stack.splice(i, 1);
    if (stack.length === 0) document.removeEventListener('keydown', onKeyDown);
    if (--locks === 0) document.body.style.overflow = previousOverflow;
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  };
}

export function dialogProps(onClose: () => void, label: string) {
  const ref: RefCallback<HTMLElement> = (el) => (el ? attach(el, onClose) : undefined);
  return {
    ref,
    role: 'dialog' as const,
    'aria-modal': true as const,
    'aria-label': label,
    tabIndex: -1,
    onMouseDown: (e: MouseEvent<HTMLElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
  };
}
