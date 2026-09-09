import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';

const ProcessExplorer = lazy(() => import('./ProcessExplorer'));

export default function DeferredProcessExplorer() {
  const rootRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsReady(true);
        observer.disconnect();
      },
      { rootMargin: '1200px 0px' }
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="process-explorer-loader">
      {isReady ? (
        <Suspense fallback={null}>
          <ProcessExplorer />
        </Suspense>
      ) : null}
    </div>
  );
}
