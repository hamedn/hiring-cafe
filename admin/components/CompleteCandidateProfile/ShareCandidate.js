import { useToast } from "@chakra-ui/react";
import axios from "axios";
import useApplicant from "@/admin/hooks/useApplicant";
import { useState } from "react";

export default function ShareCandidate({ applicantId }) {
  const [submitting, setSubmitting] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const { applicant, loading, error } = useApplicant({ applicantId });
  const toast = useToast();

  const shareProfileToEmail = async () => {
    setSubmitting(true);
    console.log(applicantId);
    try {
      await axios.post(`/api/applicant/generateShareLink`,
        {
          applicant_id: applicantId,
          share_to_email: true,
          target_email: shareEmail,
        });
      toast({
        title: "Profile Shared.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error, please contact support.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setSubmitting(false);
  }

  const generateShareLink = async () => {
    const share_token = applicant.share_token;
    if (!share_token || share_token.expires.toDate() < new Date()) {
      setSubmitting(true);
      try {
        await axios.post(`/api/applicant/generateShareLink`,
          {
            applicant_id: applicantId,
            share_to_email: false,
          }).then((response) => {
            const token = response.data.token;
            navigator.clipboard.writeText(`https://hiring.cafe/share/${token}`);
          });
        toast({
          title: "Link copied to Clipboard.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error, please contact support.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setSubmitting(false);
    } else {
      navigator.clipboard.writeText(`https://hiring.cafe/share/${share_token.token}`);
      toast({
        title: "Link copied to Clipboard.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading || error) return null;

  return (
    <div className="w-full grid-cols-1 mt-4">
      <hr/>
      <div className="mt-4 mx-4 px-4 font-semibold">Share this applicant's profile: </div>
      <div className="flex flex-items items-center w-full justify-center mt-2">
        <input
          className="px-2 mx-2 border border-1 rounded"
          placeholder="user@site.com"
          value={shareEmail}
          onChange={e => setShareEmail(e.target.value)}
        />
        <button
          className="items-center p-3 mx-2 text-center space-x-2 border rounded-lg hover:text-white hover:bg-gray-600 transition-all ease-in-out duration-300"
          onClick={() => shareProfileToEmail()}
          disabled={submitting}
        >
          Share by Email
        </button>
        <button
          className="items-center p-3 mx-2 text-center space-x-2 border rounded-lg hover:text-white hover:bg-gray-600 transition-all ease-in-out duration-300"
          onClick={() => generateShareLink()}
          disabled={submitting}
        >
          Copy Share Link
        </button>
      </div>
    </div>

  );
}