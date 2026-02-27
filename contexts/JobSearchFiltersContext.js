import { useAuth } from "@/hooks/useAuth";
import { clientFirestore } from "@/lib/firebaseClient";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import _ from "lodash";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const JobSearchFiltersContext = createContext(null);

const JobSearchFiltersProvider = ({ children }) => {
  const router = useRouter();
  const [currentFilter, setCurrentFilter] = useState({});
  const [searchFilters, setSearchFilters] = useState([]);
  const { user, loading: isLoadingUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [presetFilters, setPresetFilters] = useState([
    {
      label: "Remote Jobs Posted Today",
      value: {
        realDate: "pastDay",
        workplaceType: "Remote",
        filter_type: "preset",
      },
    },
    {
      label: "High Paying Remote Sales Jobs in US",
      value: {
        selectedRole: "Sales",
        workplaceType: "Remote",
        salaryOnly: "true",
        salaryValue: "155000",
        location_type: "country",
        location_value: "US",
        location_formatted_address: "United States",
        filter_type: "preset",
      },
    },
  ]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(clientFirestore, "user_filters"),
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc")
      );
      return onSnapshot(q, (querySnapshot) => {
        const filters = [];
        querySnapshot.forEach((doc) => {
          const filterData = doc.data();
          const filter = {
            label: filterData.label,
            value: filterData.value,
            updatedAt: filterData.updatedAt
              ? filterData.updatedAt.toDate()
              : new Date(), // Convert Timestamp to Date
          };
          filters.push(filter);
        });
        // Sort filters by updatedAt after processing all changes
        filters.sort((a, b) => b.updatedAt - a.updatedAt);
        setSearchFilters(filters);
        if (filters.length > 2) {
          setPresetFilters([]);
        }
        setLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user && !isLoadingUser) {
      setSearchFilters([]);
      setLoading(false);
    }
  }, [user, isLoadingUser]);

  const saveFilterToFirestore = ({ filterID, label, value }) => {
    setDoc(
      doc(clientFirestore, "user_filters", filterID),
      {
        label: label,
        value: value,
        userId: user.uid,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  };

  const updateFilterInFirestore = ({ filterId, label, newValue }) => {
    const filterDocRef = doc(clientFirestore, "user_filters", filterId);
    updateDoc(filterDocRef, {
      label: label,
      value: newValue,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteFilterFromFirestore = ({ filterID }) => {
    const filterDocRef = doc(clientFirestore, "user_filters", filterID);
    deleteDoc(filterDocRef);
  };

  const saveFilter = (label) => {
    if (_.isEmpty(router.query)) return;

    const { filter_type, filterID, ...filterValue } = router.query;

    const valueToSave = {
      ...filterValue,
      filterID: nanoid(),
    };

    const newFilter = {
      label: label,
      value: valueToSave,
    };

    if (user) {
      saveFilterToFirestore({
        filterID: valueToSave.filterID,
        label,
        value: valueToSave,
      });
    } else {
      setSearchFilters((prevFilters) => [...prevFilters, newFilter]);
    }

    updateCurrentFilter(newFilter);
  };

  const updateSavedFilter = ({ filterID, label }) => {
    const { filter_type, ...newValue } = router.query;
    let updatedFilter = null;
    const updatedFilters = searchFilters.map((f) => {
      if (f.value.filterID === filterID) {
        updatedFilter = {
          ...f,
          label: label,
          value: newValue,
          updatedAt: new Date(),
        };
        return updatedFilter;
      }
      return f;
    });

    if (updatedFilter) {
      if (user) {
        updateFilterInFirestore({
          filterId: filterID,
          label,
          newValue: newValue,
        });
      } else {
        setSearchFilters(updatedFilters);
      }
      updateCurrentFilter(updatedFilter);
    } else {
      saveFilter(label);
    }
  };

  const updateCurrentFilter = (filter) => {
    setCurrentFilter(filter || {});
    router.replace({
      query: filter?.value || {},
    });
  };

  const deleteFilter = ({ filterID }) => {
    const updatedFilters = searchFilters.filter(
      (f) => f.value.filterID !== filterID
    );
    if (user) {
      deleteFilterFromFirestore({ filterID });
    } else {
      setSearchFilters(updatedFilters);
    }
    setCurrentFilter({});
  };

  return (
    <JobSearchFiltersContext.Provider
      value={{
        presetFilters,
        searchFilters,
        saveFilter,
        currentFilter,
        updateCurrentFilter,
        updateSavedFilter,
        deleteFilter,
        loading,
      }}
    >
      {children}
    </JobSearchFiltersContext.Provider>
  );
};

export default JobSearchFiltersProvider;
