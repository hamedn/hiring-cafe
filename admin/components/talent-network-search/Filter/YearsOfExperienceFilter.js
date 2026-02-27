export default function YearsOfExperienceFilter({ yoe, setYOE, filterType }) {
  const items = [
    {
      label: "1+ years",
      value: 1,
    },
    {
      label: "3+ years",
      value: 3,
    },
    {
      label: "5+ years",
      value: 5,
    },
    {
      label: "7+ years",
      value: 7,
    },
    {
      label: "10+ years",
      value: 10,
    },
    {
      label: "15+ years",
      value: 15,
    },
    {
      label: "20+ years",
      value: 20,
    },
  ];

  return (
    <div className="flex flex-col space-y-4 max-h-40 overflow-y-auto">
      {items.map((item, index) => (
        <div
          key={`filter-item-${index}-${item.label}-${filterType}`}
          className="flex items-center"
        >
          <input
            type="radio"
            id={`${item.label}-${filterType}-${index}`}
            checked={yoe === item.value}
            onChange={() => {
              setYOE(item.value);
            }}
          />
          <label
            htmlFor={`${item.label}-${filterType}-${index}`}
            className="ml-2 text-sm"
          >
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
}
