import { css } from '@emotion/core';
import { useMounted } from '@self/lib/hooks/useMounted';
import { useOutsideClick } from '@self/lib/hooks/useOutsideClick';
import { useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { animated as a, useSpring } from 'react-spring';
import tw from 'twin.macro';

interface Props {
  open?: boolean;
  onClose?: () => void;
  animate?: boolean;
  anchorElement?: HTMLElement;
  className?: string;
}

type Position = {
  top: string | number;
  left: string | number;
  right: string | number;
  bottom: string | number;
};

export let Dropdown: React.FC<Props> = (props) => {
  let { children, animate, anchorElement, open, onClose, className } = props;
  let mounted = useMounted();
  let [position, setPosition] = useState<Position>(() => ({
    top: 0,
    left: 0,
    right: 'auto',
    bottom: 'auto',
  }));
  let dropdownRef = useOutsideClick((target) => {
    if (open && !anchorElement.contains(target)) {
      onClose?.();
    }
  });
  let rootEl = useMemo(() => {
    if (mounted) {
      return document.querySelector('body');
    }
  }, [mounted]);
  let ap = useSpring({
    s: open ? 1 : 0,
    y: open ? 0 : -100,
    config: {
      friction: open ? 19 : 24,
    },
    immediate: !animate,
  });

  useLayoutEffect(() => {
    if (mounted && anchorElement) {
      let aRect = anchorElement.getBoundingClientRect();
      let dRect = dropdownRef.current.getBoundingClientRect();
      let w = { width: window.innerWidth, height: window.innerHeight };

      if (dRect.width + aRect.left > w.width) {
        setPosition((p) => ({
          top: aRect.top + aRect.height,
          right: w.width - aRect.right,
          left: 'auto',
          bottom: 'auto',
        }));
      } else {
        setPosition((p) => ({
          top: aRect.top + aRect.height,
          left: aRect.x,
          right: 'auto',
          bottom: 'auto',
        }));
      }
    }
  }, [mounted, anchorElement]);

  if (mounted && anchorElement) {
    return createPortal(
      <a.div
        ref={dropdownRef}
        css={(theme) => css`
          ${tw`absolute rounded shadow-lg z-50 overflow-hidden`}
          ${position}
          background: ${theme.colors.bgDropdown};
          transform-origin: top left;
        `}
        style={{
          transform: ap.s.interpolate((s) => `scale(1,${s})`),
          opacity: ap.s,
        }}
        className={className}
      >
        <a.div
          css={css`
            transform-origin: bottom;
          `}
          style={{
            transform: ap.s.interpolate((s) => `scale(1,${1 / s})`),
            opacity: ap.s,
          }}
        >
          {children}
        </a.div>
      </a.div>,
      rootEl,
    );
  }

  return null;
};
