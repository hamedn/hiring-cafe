import _ from "lodash";
import { useState, createContext, useEffect, useCallback } from "react";

export const SavedJobsContext = createContext([]);

const STORAGE_KEY = "hc_interacted_jobs";
const VIEWED_STORAGE_KEY = "hc_viewed_jobs";
// Keep interactions for 24 hours (longer than max cache TTL)
const INTERACTION_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Loads interacted jobs from localStorage, filtering out expired entries.
 * Each entry has a timestamp; entries older than INTERACTION_TTL_MS are removed.
 */
function loadFromStorage(key) {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    const now = Date.now();
    // Filter out expired entries and return
    return parsed.filter((item) => now - item.timestamp < INTERACTION_TTL_MS);
  } catch {
    return [];
  }
}

/**
 * Saves interacted jobs to localStorage with timestamp for TTL management.
 */
function saveToStorage(key, items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // localStorage might be full or disabled, fail silently
  }
}

const SavedJobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [viewedJobs, setViewedJobs] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const storedJobs = loadFromStorage(STORAGE_KEY);
    const storedViewedJobs = loadFromStorage(VIEWED_STORAGE_KEY);
    setJobs(storedJobs);
    setViewedJobs(storedViewedJobs);
    setIsHydrated(true);
  }, []);

  // Persist jobs to localStorage whenever they change (after initial hydration)
  useEffect(() => {
    if (isHydrated) {
      saveToStorage(STORAGE_KEY, jobs);
    }
  }, [jobs, isHydrated]);

  // Persist viewedJobs to localStorage whenever they change (after initial hydration)
  useEffect(() => {
    if (isHydrated) {
      saveToStorage(VIEWED_STORAGE_KEY, viewedJobs);
    }
  }, [viewedJobs, isHydrated]);

  const addJob = useCallback((job) => {
    setJobs((prevJobs) => {
      // Check if already exists by objectID
      const exists = prevJobs.some((j) => j.objectID === job.objectID);
      if (exists) {
        // Update existing entry with new type and fresh timestamp
        return prevJobs.map((j) =>
          j.objectID === job.objectID
            ? { ...job, timestamp: Date.now() }
            : j
        );
      }
      // Add new entry with timestamp
      return [...prevJobs, { ...job, timestamp: Date.now() }];
    });
  }, []);

  const removeJob = useCallback((objectID) => {
    setJobs((prevJobs) => prevJobs.filter((j) => j.objectID !== objectID));
  }, []);

  const addViewedJob = useCallback((jobId) => {
    setViewedJobs((prevViewedJobs) => {
      // Check if already exists
      const exists = prevViewedJobs.some((j) => j.objectID === jobId);
      if (exists) return prevViewedJobs;
      // Add new entry with timestamp
      return [...prevViewedJobs, { objectID: jobId, timestamp: Date.now() }];
    });
  }, []);

  return (
    <SavedJobsContext.Provider
      value={{ jobs, addJob, removeJob, viewedJobs, addViewedJob, isHydrated }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
};

export default SavedJobsProvider;
