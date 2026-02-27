import axios from "axios";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

export default function AddNotesToCandidate({ applicant_info }) {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerNote, setReviewerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  const submitReview = async () => {
    if (!reviewerName || reviewerName.length < 1 || !reviewerNote || reviewerNote.length < 1) {
      toast({
        title: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setSubmitting(true);
    try {
      const submitData = {
        applicant_id: applicant_info.applicantId,
        reviewer_name: reviewerName,
        reviewer_note: reviewerNote,
        share_token: applicant_info.share_token.token,
      };
      await axios.post(`/api/applicant/addNotes`, submitData);
      toast({
        title: "Review Added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error Adding Note",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="m-2 p-2 border border-1">
      <div>
        Review This Candidate:
      </div>
      {isSubmitted ?
        <div>Your review was submitted.</div>
        :
        <div>
          <div>Your Name: </div>
          <input
            type="text"
            className="p-1 m-2 border border-1 rounded"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
          />
          <div>Review: </div>
          <textarea
            className="mt-2 border rounded p-4 h-96 resize-none outline-none w-full border-black"
            value={reviewerNote}
            onChange={(e) => setReviewerNote(e.target.value)}
          />
          <button
            disabled={submitting}
            onClick={() => submitReview()}
            className="bg-blue-500 text-white font-bold p-3 m-2 rounded"
          >
            Submit
          </button>
        </div>}
    </div>
  );

}