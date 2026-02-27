import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectExperience() {
  const router = useRouter();
  const [experience, setExperience] = useState(null);

  useEffect(() => {
    const { selectedExperience } = router.query;
    setExperience(selectedExperience);
  }, [router]);

  const updateRange = (range) => {
    if (range[0] === 0 && range[1] === 21) {
      const { selectedExperience, ...routerQuery } = router.query;
      router.replace({
        query: { ...routerQuery },
      });
    } else {
      router.replace({
        query: { ...router.query, selectedExperience: range.join("-") },
      });
    }
  };

  return (
    <RangeSlider
      colorScheme="gray"
      min={0}
      max={21}
      value={
        experience ? experience.split("-").map((e) => parseInt(e)) : [0, 21]
      }
      onChange={(range) => {
        setExperience(range.join("-"));
      }}
      onChangeEnd={updateRange}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      <RangeSliderThumb boxSize={8} index={0}>
        <span className="text-sm">
          {experience ? experience.split("-")[0] : "0"}
        </span>
      </RangeSliderThumb>
      <RangeSliderThumb boxSize={8} index={1}>
        <span className="text-sm">
          {experience
            ? experience.split("-")[1] <= 20
              ? experience.split("-")[1]
              : "20+"
            : "20+"}
        </span>
      </RangeSliderThumb>
    </RangeSlider>
  );
}
