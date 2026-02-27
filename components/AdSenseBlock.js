import Script from "next/script";
import React, { useEffect, useRef } from "react";

const AdSenseBlock = () => {
  const adElement = useRef(null);

  useEffect(() => {
    if (!adElement.current) return;

    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6555814894022035";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error(e);
      }
    };

    adElement.current.appendChild(script);
  }, []);

  return (
    <div className="" ref={adElement}>
      <Script
        id="adsense"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6555814894022035"
        crossorigin="anonymous"
      />
      <ins
        className="adsbygoogle h-full w-full"
        data-ad-format="fluid"
        data-ad-layout-key="-gu-3+1f-3d+2z"
        data-ad-client="ca-pub-6555814894022035"
        data-ad-slot="5505291703"
      ></ins>
    </div>
  );
};

export default AdSenseBlock;
