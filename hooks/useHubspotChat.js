const { useRouter } = require("next/router");
const { useState, useEffect } = require("react");

export default function useHubspotChat() {
  const router = useRouter();
  const [hubspotScript, setHubspotScript] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js-na1.hs-scripts.com/23987192.js";
    script.async = true;
    script.id = "hs-script-loader";
    setHubspotScript(script);
  }, []);

  useEffect(() => {
    if (!hubspotScript || !document) return;

    if (!document.getElementById("hs-script-loader")) {
      document.body.appendChild(hubspotScript);
    }

    // Needed for cleaning residue left by the external script that can only be removed by reloading the page
    const onRouterChange = (newPath) => {
      window.location.href = router.basePath + newPath;
    };
    router.events.on("routeChangeStart", onRouterChange);

    return () => {
      router.events.off("routeChangeStart", onRouterChange);
      if (document.getElementById("hs-script-loader")) {
        document.body.removeChild(hubspotScript);
      }
    };
  }, [hubspotScript, router]);
}
