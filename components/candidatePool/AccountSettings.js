import Checkout from "@/animations/Checkout";
import { useAuth } from "@/hooks/useAuth";
import _ from "lodash";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { clientFirestore } from "@/lib/firebaseClient";
import {
  useToast,
  Switch,
  CircularProgress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Checkbox,
} from "@chakra-ui/react";
import { FaLinkedin, FaGlobe, FaDollarSign } from "react-icons/fa";
import { ISO_COUNTRIES } from "@/utils/backend/countries";
import axios from "axios";
import Link from "next/link";
import Accordion from "../Accordation";
import LottieAnimation from "../lottieAnimation";
import BearBall from "@/animations/bear-ball.json";
import LocationSearchSelect, { getLocationTypeLabel } from "../LocationSearchSelect";
import useSeekerProfile from "@/hooks/useSeekerProfile";
import { useRouter } from "next/router";
import { MochiFAQ } from "@/utils/constants";
import { SearchableRegionDropdown } from "../SearchableRegionDropdown";
import {
  QuestionMarkCircleIcon,
  QuestionMarkCircleIcon as QuestionMarkCircleIconOutline,
  TrashIcon,
  PlusIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import TalentNetworkHiddenCompanies from "./TalentNetworkHiddenCompanies";
import ErrorBanner, { formatError } from "../ErrorBanner";
import posthog from "posthog-js";

/**
 * Sanitizes an object for Firestore by converting undefined values to null
 * Firestore doesn't accept undefined values
 */
const sanitizeForFirestore = (obj) => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        sanitized[key] = value === undefined ? null : sanitizeForFirestore(value);
      }
    }
    return sanitized;
  }
  return obj;
};

/**
 * Migrates old location format to new format with backward compatibility
 * Old format: { lat, lng, country, formatted_address }
 * New format: { lat, lng, country, formatted_address, location_type, willing_to_relocate, is_current }
 * 
 * IMPORTANT: Always favor current_location as the source of truth for the user's current location
 */
const migrateLocationData = (currentLocation, locationPreferences) => {
  const prefs = locationPreferences && Array.isArray(locationPreferences) ? locationPreferences : [];
  
  // If current_location exists, it's always the source of truth for where they live
  if (currentLocation && currentLocation.formatted_address) {
    // Check if current_location is already in location_preferences
    const existingCurrentIdx = prefs.findIndex(
      loc => loc.formatted_address === currentLocation.formatted_address
    );
    
    if (existingCurrentIdx !== -1) {
      // Update existing entry to be marked as current
      const updated = prefs.map((loc, idx) => ({
        ...loc,
        is_current: idx === existingCurrentIdx,
      }));
      return updated;
    }
    
    // current_location not in prefs, add it as the current location
    const currentAsPref = {
      ...currentLocation,
      location_type: currentLocation.location_type || "city",
      willing_to_relocate: false,
      is_current: true,
    };
    
    // Mark all other prefs as not current and add the current location at the start
    const otherPrefs = prefs.map(loc => ({
      ...loc,
      is_current: false,
    }));
    
    return [currentAsPref, ...otherPrefs];
  }
  
  // No current_location, use location_preferences if available
  if (prefs.length > 0) {
    // Ensure at least one is marked as current
    const hasAnyCurrent = prefs.some(loc => loc.is_current);
    if (!hasAnyCurrent) {
      // Mark the first one as current
      return prefs.map((loc, idx) => ({
        ...loc,
        is_current: idx === 0,
      }));
    }
    return prefs;
  }
  
  return [];
};

/**
 * Extracts the primary current location from location preferences
 * For backward compatibility with systems that expect current_location
 */
const getPrimaryLocation = (locationPreferences) => {
  if (!locationPreferences || !Array.isArray(locationPreferences) || locationPreferences.length === 0) {
    return null;
  }
  
  // Find the current location first
  const currentLoc = locationPreferences.find(loc => loc.is_current);
  if (currentLoc) {
    // Return in old format for backward compatibility
    // Use null instead of undefined for Firestore compatibility
    return {
      lat: currentLoc.lat ?? null,
      lng: currentLoc.lng ?? null,
      country: currentLoc.country ?? null,
      formatted_address: currentLoc.formatted_address ?? null,
    };
  }
  
  // Fallback to first location
  const first = locationPreferences[0];
  return {
    lat: first.lat ?? null,
    lng: first.lng ?? null,
    country: first.country ?? null,
    formatted_address: first.formatted_address ?? null,
  };
};

const AccountSettings = () => {
  const router = useRouter();
  const { user, loading: loadingUser, userData } = useAuth();
  const { seekerUserData, loading: loadingSeekerProfile } = useSeekerProfile();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [hubspotScript, setHubspotScript] = useState(null);

  const [linkedin, setLinkedIn] = useState("");
  const [website, setWebsite] = useState("");
  const [min_salary, setMinSalary] = useState("");

  const [locations, setLocations] = useState([]);

  const [resumeUrl, setResumeUrl] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeIsPDF, setResumeIsPDF] = useState(false);

  const [skills, setSkills] = useState([]);
  const [enterSkill, setEnterSkill] = useState("");
  const [showAddNewLocation, setShowAddNewLocation] = useState(false);

  const [selectedRegionDropdown, setSelectedRegionDropdown] = useState([]);

  // New: Location preferences array (replaces simple currentLocation)
  const [locationPreferences, setLocationPreferences] = useState([]);
  // Keep currentLocation for backward compatibility with save logic
  const [currentLocation, setCurrentLocation] = useState(null);

  const [hiddenCompanies, setHiddenCompanies] = useState([]);

  // Location notes for additional details
  const [locationNotes, setLocationNotes] = useState("");

  // Error state for displaying errors to users
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const {
    isOpen: isDeleteResumeModalOpen,
    onOpen: onDeleteResumeModalOpen,
    onClose: onDeleteResumeModalClose,
  } = useDisclosure();

  const {
    isOpen: isMochiInfoModalOpen,
    onOpen: onMochiInfoModalOpen,
    onClose: onMochiInfoModalClose,
  } = useDisclosure();

  const {
    isOpen: isMochiFAQOpen,
    onOpen: onMochiFAQOpen,
    onClose: onMochiFAQClose,
  } = useDisclosure();

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "//js-na1.hs-scripts.com/23987192.js";
  //   script.async = true;
  //   script.id = "hs-script-loader";
  //   setHubspotScript(script);
  // }, []);

  // useEffect(() => {
  //   if (!hubspotScript || !document) return;

  //   if (seekerUserData) {
  //     // Only append if not already appended
  //     if (!document.getElementById("hs-script-loader")) {
  //       document.body.appendChild(hubspotScript);
  //     }
  //   } else {
  //     // Remove if already appended
  //     if (document.getElementById("hs-script-loader")) {
  //       document.body.removeChild(hubspotScript);
  //     }
  //   }

  //   // Needed for cleaning residue left by the external script that can only be removed by reloading the page
  //   const onRouterChange = (newPath) => {
  //     window.location.href = router.basePath + newPath;
  //   };
  //   router.events.on("routeChangeStart", onRouterChange);

  //   return () => {
  //     router.events.off("routeChangeStart", onRouterChange);
  //     if (document.getElementById("hs-script-loader")) {
  //       document.body.removeChild(hubspotScript);
  //     }
  //   };
  // }, [router, hubspotScript, seekerUserData]);

  useEffect(() => {
    if (seekerUserData) {
      setLinkedIn(seekerUserData.linkedin || "");
      setWebsite(seekerUserData.website || "");
      setMinSalary(seekerUserData.min_salary || "");
      setResumeUrl(seekerUserData.resume);
      setSkills(seekerUserData.skills || []);
      
      // Migrate location data - handle both old and new formats
      const migratedLocations = migrateLocationData(
        seekerUserData.current_location,
        seekerUserData.location_preferences
      );
      setLocationPreferences(migratedLocations);
      
      // Also set currentLocation for backward compatibility
      setCurrentLocation(seekerUserData.current_location || null);
      
      // Only show add location if no locations exist
      if (migratedLocations.length === 0) {
        setShowAddNewLocation(true);
      } else {
        setShowAddNewLocation(false);
      }
      
      setLocations(seekerUserData.locations || []);
      setHiddenCompanies(seekerUserData.hidden_companies || []);
      setLocationNotes(seekerUserData.location_notes || "");
      
      if (seekerUserData.locations?.length) {
        setSelectedRegionDropdown(
          seekerUserData.locations
            .map((country) => {
              if (ISO_COUNTRIES[country])
                return {
                  value: country,
                  label: ISO_COUNTRIES[country],
                  type: "country",
                };
            })
            .filter(Boolean)
        );
      } else {
        setSelectedRegionDropdown([]);
      }
      
      // Clear any previous errors when data loads successfully
      setError(null);
    } else {
      setLinkedIn("");
      setWebsite("");
      setCurrentLocation(null);
      setLocationPreferences([]);
      setLocations([]);
      setSelectedRegionDropdown([]);
      setMinSalary("");
      setResumeUrl(null);
      setSkills([]);
      setShowAddNewLocation(true);
      setLocationNotes("");
    }
  }, [seekerUserData]);

  const createProfile = async () => {
    setIsSubmitting(true);
    setError(null);
    
    if (!user) {
      try {
        await router.push({
          pathname: "/auth",
          query: { redirect: router.asPath },
        });
      } catch (err) {
        console.error("Navigation error:", err);
        setError({
          message: "Unable to redirect to sign in",
          details: "Please try again or navigate to the sign in page manually.",
          technical: `Router push failed: ${err.message}`,
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    
    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        "/api/applicant/talent_network/createProfile",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "created" || response.data.status === "already_exists") {
        posthog.capture("talent_network_profile_created");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      const serverMessage = err.response?.data?.error;
      setError({
        message: "Failed to create profile",
        details: serverMessage || err.message || "An unexpected error occurred while creating your profile.",
        technical: `Error: ${err.name || "Unknown"} - ${err.message}\nStatus: ${err.response?.status || "N/A"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = async () => {
    const skill = enterSkill;
    if (skills.includes(skill)) return;
    const newSkills = skills;
    newSkills.push(skill);
    setSkills([...newSkills]);
    setEnterSkill("");
    await updateField("skills", newSkills);
  };

  const removeSkill = async (skill) => {
    if (!skills.includes(skill)) return;
    const newSkills = skills;
    const index = newSkills.indexOf(skill);
    if (index !== -1) {
      newSkills.splice(index, 1);
    }
    setSkills([...newSkills]);
    await updateField("skills", newSkills);
  };

  const updateField = async (field, value) => {
    if (user && seekerUserData) {
      try {
        const seekerRef = doc(clientFirestore, `seeker_profiles/${user.uid}`);
        await setDoc(seekerRef, { [field]: value }, { merge: true });
        if (["skills", "locations"].includes(field)) showToast(field);
        return { success: true };
      } catch (err) {
        console.error(`Error updating field ${field}:`, err);
        return { 
          success: false, 
          error: {
            message: `Failed to update ${field.replace("_", " ")}`,
            details: err.message,
            technical: `Field: ${field}, Error: ${err.code || err.name} - ${err.message}`,
          }
        };
      }
    }
    return { success: false, error: { message: "Not authenticated" } };
  };

  // Helper to add a new location preference
  const addLocationPreference = useCallback((newLocation) => {
    if (!newLocation || !newLocation.formatted_address) return;
    
    // Check if this location already exists
    const exists = locationPreferences.some(
      loc => loc.formatted_address === newLocation.formatted_address
    );
    
    if (exists) {
      toast({
        title: "Location already added",
        description: "This location is already in your preferences.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    
    // Determine if this should be marked as current (if it's the first location)
    const isCurrent = locationPreferences.length === 0;
    
    const newPref = {
      ...newLocation,
      willing_to_relocate: !isCurrent, // First location = current, others = willing to relocate
      is_current: isCurrent,
    };
    
    setLocationPreferences(prev => [...prev, newPref]);
    setShowAddNewLocation(false);
    setLocationError(null);
  }, [locationPreferences, toast]);

  // Helper to remove a location preference
  const removeLocationPreference = useCallback((index) => {
    setLocationPreferences(prev => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      
      // If we removed the current location and there are others, mark the first one as current
      if (removed.is_current && updated.length > 0) {
        updated[0].is_current = true;
      }
      
      return updated;
    });
  }, []);

  // Helper to toggle willing_to_relocate
  const toggleWillingToRelocate = useCallback((index) => {
    setLocationPreferences(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        willing_to_relocate: !updated[index].willing_to_relocate,
      };
      return updated;
    });
  }, []);

  // Helper to set a location as current
  const setAsCurrent = useCallback((index) => {
    setLocationPreferences(prev => {
      return prev.map((loc, i) => ({
        ...loc,
        is_current: i === index,
      }));
    });
  }, []);

  const onResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];
      setResume(i);
      if (i.type !== "application/pdf") {
        setResumeIsPDF(false);
      } else {
        setResumeIsPDF(true);
      }
    }
  };

  const deleteResume = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = await user.getIdToken();
      await axios.post("/api/marketplaceFunctions/resumeDeleteSeekerPool", {
        token: token,
      });
      setResumeUrl(null);
      setResume(null);
      showToast("resume");
    } catch (err) {
      console.error("Resume delete error:", err);
      setError({
        message: "Failed to delete resume",
        details: err.response?.data?.message || err.message || "An error occurred while deleting your resume.",
        technical: `Status: ${err.response?.status || "N/A"}\nError: ${err.message}\nResponse: ${JSON.stringify(err.response?.data || {})}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadResume = async () => {
    if (isSubmitting || !resume || !user) return;
    setIsSubmitting(true);
    
    try {
      const token = await user.getIdToken();
      const resumedata = new FormData();
      resumedata.append("resume", resume);
      const dataToUpload = {
        token: token,
        resume_is_pdf: resumeIsPDF,
      };
      await axios.post(
        "/api/marketplaceFunctions/resumeUploadSeekerPool",
        resumedata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...dataToUpload,
          },
          withCredentials: true,
        }
      );
      setResumeUrl(null);
      setResume(null);
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      console.error("Resume upload error:", err);
      // Re-throw to let the caller handle it
      throw {
        name: "ResumeUploadError",
        message: err.response?.data?.message || err.message || "An error occurred while uploading your resume.",
        code: err.response?.status,
        original: err,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfile = async () => {
    if (!user || !seekerUserData) {
      setError({
        message: "Unable to save profile",
        details: "You must be signed in to save your profile.",
        technical: `user: ${!!user}, seekerUserData: ${!!seekerUserData}`,
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const errors = [];

    try {
      // Get the primary location from preferences for backward compatibility
      const primaryLocation = getPrimaryLocation(locationPreferences);
      
      // Update location preferences (new format) - sanitize for Firestore
      if (!_.isEqual(seekerUserData.location_preferences, locationPreferences)) {
        const sanitizedPrefs = sanitizeForFirestore(locationPreferences);
        const result = await updateField("location_preferences", sanitizedPrefs);
        if (!result.success) errors.push(result.error);
      }
      
      // Update current_location for backward compatibility - sanitize for Firestore
      if (!_.isEqual(seekerUserData.current_location, primaryLocation)) {
        const sanitizedLocation = sanitizeForFirestore(primaryLocation);
        const result = await updateField("current_location", sanitizedLocation);
        if (!result.success) errors.push(result.error);
        // Update local state
        setCurrentLocation(primaryLocation);
      }

      // Handle resume upload
      if (resume) {
        const hasLocation = locationPreferences.length > 0 || seekerUserData.current_location;
        if (!hasLocation) {
          setError({
            message: "Unable to go live",
            details: "Please add at least one location before uploading your resume to go live.",
            technical: "Resume upload requires at least one location preference.",
          });
          setIsSubmitting(false);
          return;
        }
        
        try {
          await uploadResume();
        } catch (uploadErr) {
          errors.push({
            message: "Failed to upload resume",
            details: uploadErr.message,
            technical: `Upload error: ${uploadErr.code || uploadErr.name} - ${uploadErr.message}`,
          });
        }
      }

      // Update other fields
      if (seekerUserData.linkedin !== linkedin) {
        const result = await updateField("linkedin", linkedin);
        if (!result.success) errors.push(result.error);
      }
      if (seekerUserData.website !== website) {
        const result = await updateField("website", website);
        if (!result.success) errors.push(result.error);
      }
      if (seekerUserData.min_salary !== min_salary) {
        const result = await updateField("min_salary", min_salary);
        if (!result.success) errors.push(result.error);
      }
      if (!_.isEqual(seekerUserData.locations, locations)) {
        const result = await updateField("locations", locations);
        if (!result.success) errors.push(result.error);
      }
      if (!_.isEqual(seekerUserData.hidden_companies || [], hiddenCompanies)) {
        const result = await updateField("hidden_companies", hiddenCompanies);
        if (!result.success) errors.push(result.error);
      }
      if ((seekerUserData.location_notes || "") !== locationNotes) {
        const result = await updateField("location_notes", locationNotes);
        if (!result.success) errors.push(result.error);
      }

      // Track activation in PostHog
      if (resume && (primaryLocation || seekerUserData.current_location)) {
        posthog.capture("activate_talent_profile_v5", {
          resume: resume,
          current_location: primaryLocation || seekerUserData.current_location,
          location_preferences: locationPreferences,
        });
      }

      // Handle results
      if (errors.length > 0) {
        setError({
          message: "Some changes could not be saved",
          details: errors.map(e => e.message).join("; "),
          technical: errors.map(e => e.technical).join("\n"),
        });
        toast({
          title: "Partial save",
          description: "Some changes were saved but others failed. See error details above.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Successfully updated profile",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError({
        message: "Failed to save profile",
        details: err.message || "An unexpected error occurred while saving your profile.",
        technical: `Error type: ${err.name || "Unknown"}\nMessage: ${err.message}\nStack: ${err.stack || "N/A"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disableSaveProfileButton = () => {
    if (isSubmitting) return true;
    if (!seekerUserData) return true;
    
    // Get the primary location from preferences for comparison
    const primaryLocation = getPrimaryLocation(locationPreferences);
    
    // Check if anything has changed
    const hasChanges = 
      resume ||
      seekerUserData.linkedin !== linkedin ||
      seekerUserData.website !== website ||
      seekerUserData.min_salary !== min_salary ||
      !_.isEqual(seekerUserData.locations, locations) ||
      !_.isEqual(seekerUserData.current_location, primaryLocation) ||
      !_.isEqual(seekerUserData.location_preferences || [], locationPreferences) ||
      !_.isEqual(seekerUserData.hidden_companies || [], hiddenCompanies) ||
      (seekerUserData.location_notes || "") !== locationNotes;
    
    return !hasChanges;
  };

  // Check if resume is missing (used for validation)
  const isMissingResume = () => {
    // Check if they have a resume URL (existing) or a new resume file to upload
    return !resumeUrl && !resume;
  };

  // Check if current location is missing (used for validation)
  const isMissingCurrentLocation = () => {
    const hasCurrentInPreferences = locationPreferences.some(loc => loc.is_current);
    return !hasCurrentInPreferences;
  };

  // Check if save is blocked due to missing required fields
  // Priority: resume first, then location
  const getSaveBlockedReason = () => {
    if (isMissingResume()) {
      return "Please upload your resume before saving.";
    }
    if (isMissingCurrentLocation()) {
      return "Please add your current location before saving.";
    }
    return null;
  };

  const showToast = (field) => {
    const fieldString = field.replace("_", " ");
    toast({
      title: "Success",
      description: `${
        fieldString.charAt(0).toUpperCase() + fieldString.slice(1)
      } updated successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  const goLive = async () => {
    const hasResume = seekerUserData.resume;
    // Check for current location specifically (not just any location)
    const hasCurrentLocation = 
      seekerUserData.current_location ||
      (seekerUserData.location_preferences && seekerUserData.location_preferences.some(loc => loc.is_current)) ||
      locationPreferences.some(loc => loc.is_current);
    
    if (hasResume && hasCurrentLocation) {
      try {
        const result = await updateField("active", true);
        if (!result.success) {
          setError(result.error);
          return;
        }
        posthog.capture("activate_talent_profile_v5", {
          resume: seekerUserData.resume,
          current_location: seekerUserData.current_location,
          location_preferences: seekerUserData.location_preferences || locationPreferences,
        });
      } catch (err) {
        setError({
          message: "Failed to go live",
          details: err.message,
          technical: `Error: ${err.name} - ${err.message}`,
        });
      }
    } else {
      const missing = [];
      if (!hasResume) missing.push("resume");
      if (!hasCurrentLocation) missing.push("current location");
      
      setError({
        message: "Unable to go live",
        details: `Please add the following before going live: ${missing.join(", ")}.`,
        technical: `Missing: ${missing.join(", ")}. hasResume: ${hasResume}, hasCurrentLocation: ${hasCurrentLocation}`,
      });
      
      toast({
        title: "Unable to go live",
        description: `Add missing information to go live: ${missing.join(", ")}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <div>
      {seekerUserData && seekerUserData.resume ? (
        <div
          className={`flex justify-center text-sm pt-4 font-medium ${
            seekerUserData?.active ? "bg-gray-100" : "bg-red-100 text-red-800"
          }`}
        >
          {seekerUserData?.active ? (
            <div className="flex rounded-full flex-col items-center text-center p-2 lg:p-0">
              <button
                className="font-bold"
                onClick={() => {
                  onMochiInfoModalOpen();
                }}
              >
                {`Your profile is live 🥳🎉`}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-2 lg:p-0">
              <span>Your profile is hidden from companies</span>
              <button onClick={() => goLive()} className="underline font-bold">
                Go live
              </button>
            </div>
          )}
        </div>
      ) : null}
      <>
        {seekerUserData ? (
          <>
            <div
              className={`flex justify-center pt-4 pb-24 px-4 lg:px-0 ${
                seekerUserData?.active ? "bg-gray-100" : "bg-red-100"
              }`}
            >
              <div className="flex flex-col flex-auto lg:max-w-2xl">
                <div className="flex flex-col p-8 bg-white rounded-md sm:rounded-lg md:rounded-2xl lg:rounded-3xl shadow sm:shadow-md md:shadow-lg lg:shadow-xl xl:shadow-2xl">
                  {/* Error banner - shows at top of form */}
                  {error && (
                    <ErrorBanner
                      message={error.message}
                      details={error.details}
                      technical={error.technical}
                      onDismiss={() => setError(null)}
                      type="error"
                    />
                  )}
                  
                  {seekerUserData ? (
                    <div className="flex flex-col items-center">
                      {/* {user ? (
                        <Link
                          href="/account"
                          className="text-gray-800 text-sm font-medium underline"
                        >
                          {userData?.name || "Unknown Name"} · {user.email}
                        </Link>
                      ) : null} */}
                      <div className="flex flex-col w-full mt-4">
                        <div className="relative">
                          {resumeUrl ? (
                            <div className="flex items-center space-x-8 justify-between border border-gray-300 rounded-md shadow-sm px-4 py-4 w-full">
                              <div className="block bg-white text-gray-900">
                                <Link
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-black underline font-medium"
                                >
                                  Resume
                                </Link>
                                <button
                                  className="ml-4 font-bold text-red-500"
                                  onClick={() => {
                                    onDeleteResumeModalOpen();
                                  }}
                                >
                                  X
                                </button>
                              </div>
                              <div className="flex items-center space-x-4 text-sm font-medium">
                                {seekerUserData?.active ? (
                                  <div className="flex items-center space-x-0.5 text-yellow-600">
                                    <span>{`Live!`}</span>
                                    <button
                                      onClick={() => {
                                        onMochiInfoModalOpen();
                                      }}
                                    >
                                      <QuestionMarkCircleIconOutline className="h-4 w-4 ml-1" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-red-800">Hidden</div>
                                )}
                                <Switch
                                  colorScheme="yellow"
                                  isChecked={seekerUserData?.active}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      goLive();
                                    } else {
                                      updateField("active", false);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-end space-x-8 w-full px-4 py-4 bg-white border border-gray-300 rounded-md text-gray-900 shadow-sm focus:border-yellow-600 focus:outline-none">
                              <div className="flex flex-col w-full">
                                <span className="font-medium mb-2 text-sm text-gray-500">
                                  Resume <span className="text-red-600">*</span>
                                </span>
                                <input
                                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
                                  accept="application/msword, application/pdf, .doc,.docx"
                                  onChange={onResumeChange}
                                  disabled={isSubmitting}
                                  type="file"
                                  placeholder="Resume"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {!seekerUserData?.active && (
                          <button
                            onClick={() => onMochiFAQOpen()}
                            className="flex justify-center mt-8 text-red-600 font-medium"
                          >
                            FAQ: Who can see my resume?
                          </button>
                        )}
                        <hr className="my-8" />
                        
                        {/* Location error banner */}
                        {locationError && (
                          <ErrorBanner
                            {...locationError}
                            type="warning"
                            showContactInfo={false}
                            onDismiss={() => setLocationError(null)}
                          />
                        )}
                        
                        {/* ===== SECTION 1: Where do you live? ===== */}
                        <div className="flex flex-col text-start w-full">
                          <label className="text-gray-700 font-medium text-base mb-1">
                            Where do you live? <span className="text-red-500">*</span>
                          </label>
                          <p className="text-gray-500 text-sm mb-3">
                            Enter your city so companies can find candidates in their area.
                          </p>
                          
                          {/* Current location display or input */}
                          {(() => {
                            const currentLoc = locationPreferences.find(loc => loc.is_current);
                            if (currentLoc) {
                              return (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200">
                                      <MapPinIcon className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{currentLoc.formatted_address}</p>
                                      <p className="text-sm text-gray-500">Your current location</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const index = locationPreferences.findIndex(loc => loc.is_current);
                                      if (index !== -1) removeLocationPreference(index);
                                    }}
                                    className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1"
                                  >
                                    Change
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <div className="flex flex-col">
                                <LocationSearchSelect
                                  instanceId="current_location_search"
                                  cityOnly={true}
                                  onChange={(res) => {
                                    if (res) {
                                      // Add as current location
                                      const newPref = {
                                        ...res,
                                        location_type: "city",
                                        willing_to_relocate: false,
                                        is_current: true,
                                      };
                                      setLocationPreferences(prev => {
                                        // Remove any existing current, add new one
                                        const filtered = prev.filter(loc => !loc.is_current);
                                        return [newPref, ...filtered];
                                      });
                                      setLocationError(null);
                                    }
                                  }}
                                  onError={(err) => setLocationError(err)}
                                  placeholder="Type your city name..."
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                  Example: San Francisco, Austin, New York
                                </p>
                              </div>
                            );
                          })()}
                        </div>

                        {/* ===== SECTION 2: Open to other locations? ===== */}
                        <div className="flex flex-col text-start w-full mt-8">
                          <label className="text-gray-700 font-medium text-base mb-1">
                            Open to working in other locations?
                          </label>
                          <p className="text-gray-500 text-sm mb-3">
                            Add cities, states, or countries where you&apos;d be willing to work. This is optional.
                          </p>
                          
                          {/* List of additional locations */}
                          <div className="space-y-2">
                            {locationPreferences
                              .filter(loc => !loc.is_current)
                              .map((loc, filteredIndex) => {
                                const originalIndex = locationPreferences.findIndex(
                                  l => l.formatted_address === loc.formatted_address && !l.is_current
                                );
                                
                                // Get context for broader locations
                                const getLocationHint = (locType, address) => {
                                  const shortName = address?.split(",")[0]?.trim() || address;
                                  switch (locType) {
                                    case "country":
                                      return `Anywhere in ${shortName}`;
                                    case "state":
                                      return `Anywhere in ${shortName}`;
                                    case "continent":
                                      return `Anywhere in ${shortName}`;
                                    default:
                                      return null;
                                  }
                                };
                                const hint = getLocationHint(loc.location_type, loc.formatted_address);
                                
                                return (
                                  <div
                                    key={`${loc.formatted_address}-${filteredIndex}`}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                                      <div>
                                        <span className="text-gray-900">{loc.formatted_address}</span>
                                        {hint && (
                                          <p className="text-xs text-gray-500">{hint}</p>
                                        )}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => removeLocationPreference(originalIndex)}
                                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                      aria-label="Remove location"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                );
                              })}
                          </div>
                          
                          {/* Add another location */}
                          {showAddNewLocation ? (
                            <div className="mt-3">
                              <LocationSearchSelect
                                instanceId={`additional_location_search_${locationPreferences.length}`}
                                onChange={(res) => {
                                  if (res) {
                                    // Check if already exists
                                    const exists = locationPreferences.some(
                                      loc => loc.formatted_address === res.formatted_address
                                    );
                                    if (exists) {
                                      toast({
                                        title: "Already added",
                                        description: "This location is already in your list.",
                                        status: "info",
                                        duration: 3000,
                                        isClosable: true,
                                        position: "top-right",
                                      });
                                      return;
                                    }
                                    // Add as additional location
                                    const newPref = {
                                      ...res,
                                      willing_to_relocate: true,
                                      is_current: false,
                                    };
                                    setLocationPreferences(prev => [...prev, newPref]);
                                    setShowAddNewLocation(false);
                                    setLocationError(null);
                                  }
                                }}
                                onError={(err) => setLocationError(err)}
                                placeholder="Type a city, state, or country..."
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Tip: Add a state or country to indicate you&apos;re open to anywhere in that region.
                              </p>
                              <button
                                onClick={() => setShowAddNewLocation(false)}
                                className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddNewLocation(true)}
                              className="flex items-center space-x-2 mt-3 py-3 px-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
                            >
                              <PlusIcon className="h-5 w-5" />
                              <span>Add a location</span>
                            </button>
                          )}
                        </div>
                        
                        {/* Validation message */}
                        {locationPreferences.filter(loc => loc.is_current).length === 0 && (
                          <p className="text-sm text-red-600 mt-4">
                            Please add where you currently live to continue.
                          </p>
                        )}

                        {/* ===== SECTION 3: Additional notes ===== */}
                        <div className="flex flex-col text-start w-full mt-8">
                          <label className="text-gray-700 font-medium text-base mb-1">
                            Anything else about your location?
                          </label>
                          <p className="text-gray-500 text-sm mb-3">
                            Optional: Add any details that might help recruiters understand your situation.
                          </p>
                          <textarea
                            value={locationNotes}
                            onChange={(e) => setLocationNotes(e.target.value)}
                            placeholder="E.g., &quot;Open to remote work&quot;, &quot;Willing to relocate for the right opportunity&quot;, &quot;Currently remote but can relocate to NYC area&quot;, etc."
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 text-sm resize-none focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            rows={3}
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-400 mt-1 text-right">
                            {locationNotes.length}/500
                          </p>
                        </div>
                        <hr className="flex flex-col my-8" />
                        <span className="mb-4 text-gray-500 font-medium text-sm">
                          Additional Information (Optional)
                        </span>
                        <div className="flex items-center w-full border border-gray-300 rounded-md space-x-4 px-4">
                          <FaLinkedin className="text-black h-5 w-5" />
                          <input
                            id="linkedin"
                            type="text"
                            value={linkedin}
                            className="w-full py-2 text-gray-900 rounded-md shadow-sm focus:border-yellow-600 focus:outline-none"
                            onChange={(e) => setLinkedIn(e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div className="flex items-center w-full border border-gray-300 rounded-md space-x-4 px-4 mt-2">
                          <FaGlobe className="text-black h-5 w-5" />
                          <input
                            id="website"
                            type="text"
                            value={website}
                            className="w-full py-2 text-gray-900 rounded-md shadow-sm focus:border-yellow-600 focus:outline-none"
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://abc.com/..."
                          />
                        </div>
                        <div className="flex items-center w-full border border-gray-300 rounded-md space-x-4 px-4 mt-2">
                          <FaDollarSign className="text-black h-5 w-5" />
                          <input
                            id="min_salary"
                            placeholder="Base salary expectation"
                            value={min_salary}
                            className="w-full py-2 text-gray-900 rounded-md shadow-sm focus:border-yellow-600 focus:outline-none"
                            onChange={(e) => setMinSalary(e.target.value)}
                          />
                        </div>
                        <hr className="flex flex-col my-8" />
                        <div className="mb-4 flex items-center space-x-1">
                          <span className="text-gray-500 font-medium text-sm">
                            Hidden Companies (Optional)
                          </span>
                          <Popover
                            isLazy
                            closeOnBlur={true}
                            closeOnEsc={true}
                            wid
                          >
                            <PopoverTrigger>
                              <button>
                                <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverBody>
                                <div className="flex flex-col text-sm">
                                  <span>
                                    {`Add email domain names you'd like to hide from. For example, if you want to hide your profile from Meta recruiters, enter `}
                                    <span className="font-bold">{`"meta.com"`}</span>
                                  </span>
                                  <span className="mt-2">{`Companies won't be able to access your identity until you accept their intro request so this step is really optional :)`}</span>
                                </div>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <TalentNetworkHiddenCompanies
                          companyDomains={hiddenCompanies}
                          setCompanyDomains={setHiddenCompanies}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* Sticky Save Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
              <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center flex-1 mr-4">
                  {getSaveBlockedReason() ? (
                    <span className="text-sm text-red-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                      {getSaveBlockedReason()}
                    </span>
                  ) : !disableSaveProfileButton() ? (
                    <span className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 flex-shrink-0"></span>
                      You have unsaved changes
                    </span>
                  ) : null}
                </div>
                <button
                  className={`font-medium rounded-lg px-6 py-2.5 transition-all flex-shrink-0 ${
                    disableSaveProfileButton() || getSaveBlockedReason()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800 active:scale-95"
                  }`}
                  disabled={disableSaveProfileButton() || !!getSaveBlockedReason()}
                  onClick={async () => updateProfile()}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <CircularProgress isIndeterminate size="16px" color="white" mr={2} />
                      Saving...
                    </span>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : loadingUser || loadingSeekerProfile ? (
          <div className="flex justify-center mt-32">
            <CircularProgress isIndeterminate color="black" size={"44px"} />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            {/* Error banner for profile creation errors */}
            {error && (
              <div className="w-full max-w-xl mt-4">
                <ErrorBanner
                  message={error.message}
                  details={error.details}
                  technical={error.technical}
                  onDismiss={() => setError(null)}
                  type="error"
                />
              </div>
            )}
            
            <div className="flex flex-col items-center text-center mt-4">
              <LottieAnimation
                width="250px"
                height="250px"
                animationData={BearBall}
              />
              <div className="flex flex-col items-center text-sm md:text-base">
                <span className="mt-8 bg-orange-100 text-orange-800 px-4 py-1.5 font-medium rounded-full">{`HiringCafe Private Talent Network`}</span>
                <span className="mt-4 text-3xl font-medium">
                  {`Let Companies Apply to You`}
                </span>
                <span className="mt-4 text-lg lg:max-w-xl">{`Submit your resume and let companies apply to you directly on HiringCafe. Go live anytime, and hide your profile whenever you want. Your identity is only revealed when you accept their intro request. Never worry about spam again!`}</span>
              </div>
              <div className="flex flex-col mt-8">
                <button
                  className="bg-yellow-600 text-yellow-50 font-semibold rounded px-8 py-2 m-1 text-2xl"
                  disabled={isSubmitting}
                  onClick={async () => {
                    await createProfile();
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress
                      isIndeterminate
                      size="24px"
                      color="yellow.800"
                    />
                  ) : (
                    <span>Get Started Now</span>
                  )}
                </button>
                <span className="mt-2 font-medium">{`It takes 30 seconds, and it's 100% free!`}</span>
              </div>
            </div>
            <div className="flex flex-col flex-auto justify-start items-start text-start lg:max-w-xl my-16">
              <span className="text-xl font-medium mb-4 text-yellow-600">
                Frequently Asked Questions
              </span>
              <Accordion items={MochiFAQ} />
            </div>
          </div>
        )}
        <Modal
          isOpen={isDeleteResumeModalOpen}
          onClose={onDeleteResumeModalClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete resume</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <span>
                Your profile will no longer be visible to recruiters if you
                delete your resume. You can upload a new resume anytime. Are you
                sure you want to delete your resume?
              </span>
            </ModalBody>
            <ModalFooter>
              <div className="flex items-center space-x-2">
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await deleteResume();
                    onDeleteResumeModalClose();
                  }}
                  isLoading={isSubmitting}
                >
                  Delete Resume
                </Button>
                <Button onClick={onDeleteResumeModalClose}>Cancel</Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isMochiInfoModalOpen}
          onClose={onMochiInfoModalClose}
          size={"xl"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your Profile is Live!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex flex-col mb-8 text-sm">
                <LottieAnimation
                  width="100px"
                  height="100px"
                  animationData={Checkout}
                  customOptions={{ loop: false }}
                />
                <span className="mt-2 font-light">
                  Frequently Asked Questions
                </span>
                <span className="font-bold mt-4">{`What happens next?`}</span>
                <span className="mt-2">{`Companies will be able to view your resume (your name and contact info redacted!) and send you an intro request. They'll be able to view your personal information only when you accept their intro request. You'll receive a notification via Email right away if a recruiter wants to chat.`}</span>
                <span className="font-bold mt-6">
                  What do I need to do now?
                </span>
                <span className="mt-2">
                  {`Nothing! You can sit back, relax, and continue job hunting. You'll receive notifications when recruiters reach out.`}
                </span>
                <span className="font-bold mt-6">
                  Who can access my information?
                </span>
                <span className="mt-2">
                  {`Approved companies who are actively hiring on HiringCafe. Your identity and contact information is only revealed when you accept their intro request.`}
                </span>
                <span className="font-bold mt-6">Can I hide my profile?</span>
                <span className="mt-2">
                  {`Yes, you can hide your profile anytime. You can also hide your profile from specific companies by adding them to the "Hidden Companies" section below.`}
                </span>
                <span className="font-bold mt-6">
                  {`Can they see what jobs I've applied to?`}
                </span>
                <span className="mt-2">{`No, absolutely not! All your account activity - job applications, tracking applications, messages, and etc - will never be shared with companies.`}</span>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal isOpen={isMochiFAQOpen} onClose={onMochiFAQClose} size={"2xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex flex-col flex-auto justify-start items-start text-start p-2">
                <span className="text-xl font-medium mb-4 text-yellow-600">
                  Frequently Asked Questions
                </span>
                <Accordion items={MochiFAQ} />
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default AccountSettings;
