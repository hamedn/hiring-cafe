import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function EditApplicantModal({
  onModalClose,
  applicantInfo,
  mutate,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(applicantInfo.profile.name);
  const [contactEmail, setContactEmail] = useState(
    applicantInfo.profile.contact_email || applicantInfo.profile.email
  );
  const [phone, setPhone] = useState(applicantInfo.profile.phone || "");
  const [website, setWebsite] = useState(applicantInfo.profile.website || "");
  const [linkedIn, setLinkedin] = useState(
    applicantInfo.profile.linkedin || ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeIsPDF, setResumeIsPDF] = useState(false);
  const toast = useToast();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

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

  const submitChanges = async () => {
    setSubmitting(true);
    const submitData = {
      applicant_id: applicantInfo.applicantId,
      access_token: applicantInfo.candidate_token.token,
      profile: {
        name: name,
        email: applicantInfo.profile.email,
        contact_email: contactEmail,
        phone: phone,
        website: website,
        linkedin: linkedIn,
      },
    };
    try {
      await axios.post(`/api/applicant/updateApplicant`, submitData);
      mutate();
      toast({
        title: "Successfully Saved.",
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
      setSubmitting(false);
    }
  };

  const changeResume = async () => {
    if (!resume) return;
    setSubmitting(true);
    const resumedata = new FormData();
    resumedata.append("resume", resume);
    const submitData = {
      applicant_id: applicantInfo.applicantId,
      access_token: applicantInfo.candidate_token.token,
      resume_is_pdf: resumeIsPDF,
    };
    try {
      await axios.post("/api/applicant/updateApplicantResume", resumedata, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...submitData,
        },
        withCredentials: true,
      });
      mutate();
      toast({
        title: "Resume updated!",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating Resume. Please contact support.",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onModalClose();
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col">
            <span className="text-4xl bold">Edit Profile Info</span>
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="m-2">
            <div>
              <span>Name</span>
              <input
                type="text"
                className="p-1 m-2 border border-1 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <span>Email</span>
              <input
                type="text"
                disabled
                className="p-1 m-2 bg-gray-200 border border-1 rounded"
                value={applicantInfo.profile.email}
              />
            </div>
            <div>
              <span>Contact Email</span>
              <input
                type="text"
                className="p-1 m-2 border border-1 rounded"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div>
              <span>Website</span>
              <input
                type="text"
                className="p-1 m-2 border border-1 rounded"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <span>LinkedIn:</span>
              <input
                type="text"
                className="p-1 m-2 border border-1 rounded"
                value={linkedIn}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
            <button
              className={`${
                submitting ? "bg-gray-200" : "bg-blue-500 text-white"
              } p-3 m-2 font-bold rounded`}
              disabled={submitting}
              onClick={() => submitChanges()}
            >
              Submit
            </button>
            <hr />
            <div className="flex flex-col my-4 space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-lg font-bold">Replace Resume:</span>
                <span className="text-gray-400 text-xs font-medium">{`Max. file size: 4MB (pdf, doc, and docx only)`}</span>
              </div>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
                accept="application/msword, application/pdf, .doc,.docx"
                onChange={onResumeChange}
                disabled={submitting}
                type="file"
              />
            </div>
            <button
              className={`${
                submitting ? "bg-gray-200" : "bg-blue-500 text-white"
              } p-3 m-2 font-bold rounded`}
              disabled={!resume || submitting}
              onClick={() => changeResume()}
            >
              Replace
            </button>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
