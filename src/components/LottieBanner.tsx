
import React, { useEffect, useRef } from 'react';

export default function LottieBanner({ path }) {
  const ref = useRef(null);
  useEffect(() => {
    let anim;
    (async () => {
      const lottie = await import('lottie-web');
      if (ref.current) {
        anim = lottie.loadAnimation({
          container: ref.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: path || '/animations/sample.json'
        });
      }
    })();
    return () => { if (anim) anim.destroy(); };
  }, [path]);
  return <div ref={ref} style={{ width: '100%', height: 200 }} />;
}
