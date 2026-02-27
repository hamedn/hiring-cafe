import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import EditLocationOption from "./EditLocationOption";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import SuggestedLocations from "./SuggestedLocations";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";
import { useState } from "react";

export default function SelectedLocationsDisplay() {
  const { update, searchState } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { locations = [] } = currentSearchState;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalSize = useBreakpointValue({ base: "full", md: "md" });
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const handleEditLocation = (locationId) => {
    setSelectedLocationId(locationId);
    onOpen();
  };

  const selectedLocation = locations.find(
    (loc) => loc.id === selectedLocationId
  );

  return (
    <>
      {!searchState.locations?.length &&
      searchState.defaultToUserLocation !== false ? null : !locations.length ? (
        <div className="flex items-center space-x-1 text-gray-500">
          <GlobeAltIcon className="w-4 h-4 flex-none" />
          <span className="text-sm font-medium">Anywhere in the world</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 items-center">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-gray-200 rounded-md p-1 flex items-center"
            >
              <button
                className="flex items-center space-x-4 text-start px-2"
                onClick={() => handleEditLocation(location.id)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">
                      {location.options?.ignore_radius
                        ? `Exactly in ${location.formatted_address}`
                        : location.formatted_address}
                      {!location.options?.ignore_radius &&
                      location.options?.radius ? (
                        <>
                          {" · "}
                          <span className="text-xs font-bold">
                            {location.options?.radius}{" "}
                            {location.options?.radius_unit?.toUpperCase() || ""}
                          </span>
                        </>
                      ) : null}
                    </span>
                  </div>
                  <span className="text-xs font-light">
                    {location.workplace_types?.length > 0
                      ? location.workplace_types.join(" · ")
                      : "Remote · Hybrid · Onsite"}
                  </span>
                  {location?.options?.flexible_regions?.length > 0 ? (
                    <span className="text-xs font-extralight">
                      + {location.options.flexible_regions.length} options
                    </span>
                  ) : null}
                </div>
                <div className="p-1 rounded-full hover:bg-gray-300">
                  <PencilIcon className="w-3 h-3 flex-none" />
                </div>
              </button>
              <button
                className="flex items-center space-x-2 hover:bg-gray-300 rounded-full p-1"
                onClick={() =>
                  update({
                    type: URLSearchStateUpdateType.REMOVE_LOCATION,
                    payload: location.id,
                  })
                }
              >
                <TrashIcon className="w-3 h-3 flex-none text-red-500" />
              </button>
            </div>
          ))}
          <SuggestedLocations />
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={modalSize}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedLocation && (
              <span className="text-base">
                Edit Location: {selectedLocation.formatted_address}
              </span>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedLocationId && (
              <EditLocationOption locationID={selectedLocationId} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
