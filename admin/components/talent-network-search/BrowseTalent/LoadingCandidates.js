export default function LoadingCandidates({ numItems = 30 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
      {Array.from({ length: numItems }).map((_, i) => (
        <div
          key={`item-${i}
        `}
          className="rounded-xl bg-gray-300 animate-pulse h-96"
        />
      ))}
    </div>
  );
}
