import { useEffect, useState } from "react";

export default function useMobileDeviceDetection() {
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isInStandaloneMode =
      "standalone" in window.navigator && window.navigator.standalone;

    setIsIOS(isIOS);
    setIsInStandaloneMode(isInStandaloneMode);
  }, []);

  return { isIOS, isInStandaloneMode };
}
