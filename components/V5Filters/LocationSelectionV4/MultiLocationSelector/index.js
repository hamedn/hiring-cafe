import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import SearchBar from "./SearchBar";
import SelectedLocationsDisplay from "./SelectedLocationsDisplay";

export default function MultiLocationSelector() {
  const { update, searchState } = useURLSearchStateV4();

  const handleJobsWorldwide = () => {
    update({
      type: URLSearchStateUpdateType.REMOVE_ALL_LOCATIONS,
      payload: null,
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <SelectedLocationsDisplay />
      <SearchBar />
      {!searchState.locations?.length &&
      searchState?.defaultToUserLocation !== false ? (
        <button
          className="text-xs font-medium text-pink-400 hover:text-pink-700 transition-colors duration-200 ease-in-out focus:outline-none w-fit"
          onClick={() => handleJobsWorldwide()}
        >
          Anywhere in the world
        </button>
      ) : null}
    </div>
  );
}
