import React, { useRef, useEffect } from "react";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let current = 0;
    let target = 0;
    const ease = 0.075;

    const smoothScroll = () => {
      target = window.scrollY;
      current += (target - current) * ease;

      if (scrollRef.current) {
        scrollRef.current.style.transform = `translateY(-${current}px)`;
      }

      requestAnimationFrame(smoothScroll);
    };

    smoothScroll();
  }, []);

  useEffect(() => {
    const resize = () => {
      const height = scrollRef.current?.getBoundingClientRect().height || 0;
      document.body.style.height = `${height}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="fixed top-0 left-0 w-full will-change-transform"
      >
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;