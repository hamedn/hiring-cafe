import dynamic from "next/dynamic";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

const LottieAnimation = ({
  width = "100%",
  height = "100%",
  animationData,
  customOptions = {},
}) => {
  const defaultOptions = {
    loop: customOptions.loop,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  return (
    <div style={{ pointerEvents: "none" }}>
      {/* Only render Lottie component on client-side */}
      {typeof window !== "undefined" && (
        <Lottie
          options={defaultOptions}
          width={width}
          height={height}
          isClickToPauseDisabled={true}
        />
      )}
    </div>
  );
};

export default LottieAnimation;
