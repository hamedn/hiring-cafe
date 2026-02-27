import { ISO_COUNTRIES, REGIONS } from "@/utils/backend/countries";
import ReactSelect from "react-select";

export const countryOptions = Object.keys(ISO_COUNTRIES).map((code) => ({
  value: code,
  label: ISO_COUNTRIES[code],
  type: "country",
}));

export const regionOptions = Object.keys(REGIONS).map((region) => ({
  value: region,
  label: region,
  type: "region",
}));

export const SearchableRegionDropdown = ({
  selectedRegionDropdown,
  setSelectedRegionDropdown,
  onCountriesChange,
}) => {
  const getOptions = () => {
    const filteredCountries = selectedRegionDropdown
      .filter((item) => item.type === "region")
      .flatMap((region) => REGIONS[region.value])
      .filter(Boolean);

    const availableCountryOptions = countryOptions.filter(
      (country) => !filteredCountries.includes(country.value)
    );

    return [...regionOptions, ...availableCountryOptions];
  };

  const customStyles = {
    multiValue: (base) => ({
      ...base,
      backgroundColor: "lightgray",
    }),
    multiValueLabel: (base) => ({
      ...base,
      fontWeight: "bold",
    }),
    multiValueRemove: (base) => ({
      ...base,
      cursor: "pointer",
    }),
  };

  const handleOnChange = (values) => {
    setSelectedRegionDropdown(values); // Store the entire option objects

    // Start by collecting all explicitly selected countries
    let allSelectedCountries = values
      .filter((item) => item.type === "country")
      .map((item) => item.value);

    // For each selected region, add its countries to the list
    values
      .filter((item) => item.type === "region")
      .forEach((regionItem) => {
        allSelectedCountries = allSelectedCountries.concat(
          REGIONS[regionItem.value]
        );
      });

    // Remove duplicates (in case a country was selected explicitly and via a region)
    const uniqueSelectedCountries = [...new Set(allSelectedCountries)];

    onCountriesChange(uniqueSelectedCountries);
  };

  return (
    <ReactSelect
      isMulti
      options={getOptions()}
      styles={customStyles}
      onChange={handleOnChange}
      value={selectedRegionDropdown}
      filterOption={(option, input) => {
        if (option.type === "region") {
          return option.label.toLowerCase().includes(input.toLowerCase());
        }
        return (
          option.label.toLowerCase().includes(input.toLowerCase()) ||
          (REGIONS[option.label] &&
            REGIONS[option.label].some(
              (countryCode) =>
                ISO_COUNTRIES[countryCode] &&
                ISO_COUNTRIES[countryCode]
                  .toLowerCase()
                  .includes(input.toLowerCase())
            ))
        );
      }}
    />
  );
};
