export default function AnimatedShimmerText({ text = "Please wait..." }) {
  const letters = [...text];

  return (
    <>
      <style>{`
          @keyframes sweep {
            0%, 60%, 100% { opacity:.25 }
            30%            { opacity:1   }
          }
        `}</style>

      <p className="inline-block font-medium">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="animate-[sweep_1.2s_linear_infinite]"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {ch}
          </span>
        ))}
      </p>
    </>
  );
}
