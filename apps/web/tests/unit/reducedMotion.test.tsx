import { act, render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScrollProgress } from '../../src/components/navigation/ScrollProgress';
import { useReducedMotion } from '../../src/hooks/useReducedMotion';

const { fromTo, kill } = vi.hoisted(() => ({
  fromTo: vi.fn(),
  kill: vi.fn(),
}));

vi.mock('../../src/lib/animation', () => ({
  gsap: {
    fromTo,
  },
}));

function createMediaQueryList(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  return {
    get matches() {
      return matches;
    },
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      listeners.delete(listener);
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches, media: this.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function MotionAwareScrollProgress() {
  return <ScrollProgress prefersReducedMotion={useReducedMotion()} />;
}

describe('reduced motion behavior', () => {
  it('tracks changes to the operating system preference', () => {
    const mediaQuery = createMediaQueryList(true);
    vi.mocked(window.matchMedia).mockReturnValue(mediaQuery as unknown as MediaQueryList);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);

    act(() => mediaQuery.setMatches(false));

    expect(result.current).toBe(false);
  });

  it('does not start layout animations before reading the initial preference', () => {
    const mediaQuery = createMediaQueryList(true);
    vi.mocked(window.matchMedia).mockReturnValue(mediaQuery as unknown as MediaQueryList);

    render(<MotionAwareScrollProgress />);

    expect(fromTo).not.toHaveBeenCalled();
  });

  it('does not create scroll-driven motion when reduction is requested', () => {
    render(<ScrollProgress prefersReducedMotion />);

    expect(fromTo).not.toHaveBeenCalled();
  });

  it('disposes scroll-driven motion when the component unmounts', () => {
    fromTo.mockReturnValue({ kill });

    const { unmount } = render(<ScrollProgress prefersReducedMotion={false} />);
    unmount();

    expect(fromTo).toHaveBeenCalledOnce();
    expect(kill).toHaveBeenCalledOnce();
  });
});
