import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

export default function InterviewAvailability({ applicant_info, mutate }) {
  const [availability, setAvailability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (applicant_info) {
      setAvailability(applicant_info.availability || "");
    }
  }, [applicant_info]);

  const submitAvailability = async () => {
    setIsSubmitting(true);
    const submitData = {
      applicant_id: applicant_info.applicantId,
      access_token: applicant_info.candidate_token.token,
      availability: availability,
    };
    try {
      await axios.post(`/api/applicant/updateApplicant`, submitData);
      mutate();
      toast({
        title: "Availability saved.",
        description: "We'll email you as soon as we review your application.",
        status: "success",
        isClosable: true,
        duration: 9000,
      });
    } catch (error) {
      toast({
        title: "Unable to save.",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 9000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      {!applicant_info.availability && (
        <span className="text-2xl font-medium">
          {`What's Your Interview Availability?`}
        </span>
      )}
      {applicant_info.availability ? (
        <span className="w-full m-2">{`Thanks for providing your availability. We'll email you as soon as we review your application for next steps.`}</span>
      ) : (
        <span className="w-full m-2">
          {`Enter your availability for the next 14 days.`}{" "}
          <span className="font-bold">
            Be sure to include your timezone.
          </span>
        </span>
      )}
      <textarea
        className="w-full p-4 lg:w-96 h-20 mt-8 border border-1 rounded-lg resize-none outline-none focus:border-yellow-600"
        type="text"
        placeholder={`I'm usually available from 9am to 5pm PST on weekdays.`}
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
      />
      <button
        disabled={isSubmitting}
        onClick={() => submitAvailability()}
        className={`px-6 py-2 text-sm m-4 font-bold rounded ${
          isSubmitting ? "bg-gray-200" : "bg-yellow-600 text-white"
        }`}
      >
        {applicant_info.availability
          ? "Update Availability"
          : "Add Availability"}
      </button>
    </div>
  );
}
