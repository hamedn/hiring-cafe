import useJob from "@/admin/hooks/useJob";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import { useToast } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import axios from "axios";

const TimezoneButton = ({ timezone, label, sublabel, job_id, public_access = null }) => {
  const { job, error, loading } = useJob({ job_id });
  const toast = useToast();
  const [pending, setPending] = useState(false);

  const handleTimezoneClick = async () => {
    if (pending) return;
    setPending(true);
    const updatedTimezones = job.timezones
      ? job.timezones.includes(timezone)
        ? job.timezones.length === 1
          ? job.timezones // Keep the last selected timezone
          : job.timezones.filter((tz) => tz !== timezone)
        : [...job.timezones, timezone]
      : [timezone];

    try {
      if (public_access) {
        const dataToSend = {
          job_id: job_id,
          access_token: public_access,
          timezones: updatedTimezones,
        };
        await axios.post(`/api/adminpublicjob/updateJobPublic`, dataToSend);
      } else {
        await updateDoc(doc(clientFirestore, "jobs", job_id), {
          timezones: updatedTimezones,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setPending(false);
  };

  return (
    <button
      className={`border rounded-lg hover:border-black hover:border-2 p-10 ${job?.timezones?.includes(timezone) &&
        "border-black border-2 bg-gray-100"
        } hover:cursor-pointer hover:shadow-md hover:scale-105 transition-all`}
      onClick={handleTimezoneClick}
      disabled={loading || error}
    >
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-400 rounded w-1/2"></div>
          <div className="h-4 bg-gray-400 rounded w-1/4"></div>
        </div>
      ) : error ? (
        <span className="font-medium text-red-500">{error.message}</span>
      ) : (
        <div className="flex flex-col items-center">
          <span className="font-medium">{label}</span>
          <span className="font-medium text-sm">{sublabel}</span>
        </div>
      )}
    </button>
  );
};

export default TimezoneButton;
