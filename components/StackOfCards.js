const StackOfCards = ({ numBackgroundCards = 3, children }) => {
  const backgroundCards = Array.from({
    length: Math.min(numBackgroundCards, 4),
  });

  return (
    <div className="relative xl:z-10">
      {backgroundCards.map((_, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-white border border-gray-200 rounded-xl shadow`}
          style={{
            transform: `translate(-${(index + 1) * 2}px, ${(index + 1) * 2}px)`,
            zIndex: -index - 1,
          }}
        ></div>
      ))}
      <div className="relative bg-white rounded-xl border border-gray-200 shadow hover:border-gray-500 md:hover:border-gray-200">
        {children}
      </div>
    </div>
  );
};

export default StackOfCards;
