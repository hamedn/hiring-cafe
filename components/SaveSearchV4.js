import { useState } from "react";
import Select from "react-select";
import useSavedSearchV4 from "@/hooks/useSavedSearchV4";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@chakra-ui/react";
import AuthenticationModal from "./AuthenticationModal";
import useFetchPreferences from "@/hooks/useFetchPreferences";

export default function SaveSearchV4({
  mode = "save",
  onModeChange = () => {},
  onSaveComplete = () => {},
}) {
  const { user } = useAuth();
  const { savedSearches, updateSearch, saveCurrentSearch } =
    useSavedSearchV4(true);
  const [searchName, setSearchName] = useState("");
  const [selectedSearch, setSelectedSearch] = useState(null);
  const toast = useToast();
  const {
    userPreferences,
    setUserPreferences,
    loading: loadingPreferences,
  } = useFetchPreferences();
  const digestOptedOut = userPreferences?.dailyDigestOptOut === false;
  const [digestLoading, setDigestLoading] = useState(false);

  const handleSave = () => {
    if (!user) {
      return;
    }
    if (mode === "save") {
      saveCurrentSearch({ searchName });
    } else if (mode === "update" && selectedSearch) {
      updateSearch({ searchID: selectedSearch.value });
    }
    onSaveComplete();
    toast({
      title: "Search saved successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const options = savedSearches.map((search) => ({
    value: search.id,
    label: search.name,
  }));

  const handleOptInDigest = async () => {
    setDigestLoading(true);
    try {
      await setUserPreferences({ dailyDigestOptOut: true });
      toast({
        title: "You've opted in to daily email digests!",
        description:
          "You'll receive daily email digests for your saved searches.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Could not update your email digest preference.",
        description: "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setDigestLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {digestOptedOut && (
        <div className="flex flex-col space-y-2 items-center justify-center mb-4 bg-gray-100 rounded-lg p-6">
          <div className="mb-2 text-center text-red-700 font-semibold text-sm">
            You are currently <b>not receiving daily email digests</b> for your saved searches.
            <br />
            Want to get daily updates? Opt in below!
          </div>
          <button
            onClick={handleOptInDigest}
            disabled={digestLoading || loadingPreferences}
            className="px-6 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {digestLoading ? "Opting in..." : "Receive daily email digests"}
          </button>
        </div>
      )}
      <div className="flex items-center pb-2 text-sm space-x-8">
        <button
          onClick={() => onModeChange("save")}
          className={`hover:underline hover:underline-offset-8 ${
            mode === "save"
              ? "underline underline-offset-8 font-bold"
              : "font-medium"
          }`}
        >
          Save as a new search
        </button>
        <button
          onClick={() => onModeChange("update")}
          className={`hover:underline hover:underline-offset-8 ${
            mode === "update"
              ? "underline underline-offset-8 font-bold"
              : "font-medium"
          }`}
        >
          Update existing search
        </button>
      </div>
      {mode === "save" ? (
        <input
          type="text"
          placeholder="Enter new search name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-3 border rounded text-md w-full focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent font-semibold"
        />
      ) : (
        <Select
          value={selectedSearch}
          onChange={setSelectedSearch}
          options={options}
          placeholder="Select Existing Search"
          isClearable
        />
      )}
      <div className="flex items-center justify-end space-x-2 text-sm font-semibold pb-4">
        <button
          onClick={() => {
            onModeChange("save");
            setSelectedSearch(null);
            onSaveComplete();
          }}
          className="p-3 border rounded hover:outline-none hover:ring-1 hover:ring-red-500 hover:text-red-600 hover:border-transparent"
        >
          Cancel
        </button>
        {user ? (
          <button
            onClick={handleSave}
            disabled={
              (mode === "update" && !selectedSearch) ||
              (mode === "save" && !searchName)
            }
            className={`p-3 border rounded ${
              (mode === "save" && searchName) || selectedSearch
                ? "bg-pink-500 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {mode === "save" ? "Save Search" : "Update Search"}
          </button>
        ) : (
          <AuthenticationModal>
            <div
              className={`p-3 border rounded ${
                (mode === "save" && searchName) || selectedSearch
                  ? "bg-pink-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {mode === "save" ? "Save Search" : "Update Search"}
            </div>
          </AuthenticationModal>
        )}
      </div>
    </div>
  );
}
