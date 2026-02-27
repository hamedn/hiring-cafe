import Link from "next/link";
import axios from "axios";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import xss from "xss";
import {
  Stack,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/react";
import { ISO3166CountryCodes } from "@/utils/countryCodes";
import useJobWithRequisitionId from "@/admin/hooks/useJobWithRequisitionId";
import { useRouter } from "next/router";
import { dumpErrorMessage } from "@/candidates/utils/errorDumps";
import HiringCafeLogo from "./HiringCafeLogo";
import { useAuth } from "@/hooks/useAuth";
import { clientFirestore } from "@/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { ISO_COUNTRIES } from "@/utils/backend/countries";
import { Picture } from "@/utils/picture";
import { jobTypeMap } from "@/utils/constants";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function RenderResume({ url, isPdf }) {
  return (
    <div className="w-full">
      <div>Resume: </div>
      <iframe
        id={url}
        src={
          isPdf
            ? url
            : `https://view.officeapps.live.com/op/embed.aspx?src=${url}`
        }
        height="100%"
        width="100%"
        className="rounded w-full h-96"
      />
    </div>
  );
}

// jobID is the requisition ID
export default function JobApplication({ isPreview, jobID }) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [website, setWebsite] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeIsPDF, setResumeIsPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [country, setCountry] = useState("US");
  const [validLocation, setValidLocation] = useState("");
  const [workAuth, setWorkAuth] = useState("");
  const { job, loading, error } = useJobWithRequisitionId({
    requisition_id: jobID,
  });
  const [userCountry, setUserCountry] = useState(null);
  const [loadingUserCountry, setLoadingUserCountry] = useState(true);
  const { user, loading: loadingUser } = useAuth();
  const [userData, setUserData] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const title = () =>
    job
      ? `${job.job_info.title} - Jobs at ${job.board.title}`
      : "Job Application";

  useEffect(() => {
    if (!loading && error) {
      router.replace("/404");
    }
  }, [error, loading, router]);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(clientFirestore, `users/${user.uid}`), (doc) => {
      setUserData(doc.data());
    });
  }, [user]);

  useEffect(() => {
    const checkCountry = async () => {
      try {
        await axios.get(`/api/getCountry`).then((response) => {
          const countryGet = response.data.country;
          setUserCountry(countryGet);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUserCountry(false);
      }
    };

    checkCountry();
  }, []);

  // useEffect(() => {
  //   if (!screen || userCountry !== "US") return;
  //   // Add the VIDEOASK_EMBED_CONFIG to the window object
  //   window.VIDEOASK_EMBED_CONFIG = {
  //     kind: "widget",
  //     // url: "https://ask.hiring.cafe/fw994ejra",
  //     url: screen.videoask_share_url + "?justvideo",
  //     options: {
  //       widgetType: "VideoThumbnailExtraLarge",
  //       text: "",
  //       backgroundColor: "#FFFFFF",
  //       position: "bottom-right",
  //       dismissible: true,
  //     },
  //   };

  //   // Load the VideoAsk script
  //   const script = document.createElement("script");
  //   script.src = "https://www.videoask.com/embed/embed.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   // Cleanup on component unmount
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, [userCountry, screen]);

  const isResumeOptional = () => (job ? job.is_resume_optional : false);

  const verifyApplyWithAccount = () => {
    if (isSubmitted || isSubmitting) return false;
    if (!user || !userData || !job) return false;
    if (!userData.name?.length) return false;
    if (!userData.country?.length) return false;
    if (!userData.resume?.length && !job.isResumeOptional) return false;
    return true;
  };

  const submitWithAccount = async () => {
    if (!verifyApplyWithAccount()) return;
    setIsSubmitting(true);
    try {
      await axios.post("/api/applicant/createApplicantWithSeeker", {
        seeker_uid: user.uid,
        email: user.email,
        jobrequisitionid: jobID,
      });
      toast({
        title: "Application submitted!",
        status: "success",
        isClosable: true,
      });
      onClose();
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title:
          "Enter submitting application. Please contact support: ali@hiring.cafe",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
    setIsSubmitting(false);
  };

  const submitApplication = async () => {
    if (isPreview) return;
    const additionalFieldsCheck = () => {
      if (!country) return false;
      if (!workAuth) return false;
      if (!validLocation && job.job_info.workplace_address_type !== "anywhere")
        return false;
      if (!job.application_fields) return true;
      if (job.application_fields.linkedin && !linkedIn) {
        return false;
      }
      if (job.application_fields.website && !website) {
        return false;
      }
      if (job.application_fields.phone && !phone) {
        return false;
      }
      return true;
    };

    const resumeCheck = () => {
      if (isResumeOptional()) return true; //if optional, its fine either way
      if (!resume) return false;
      return true;
    };

    if (!(name && email && resumeCheck() && additionalFieldsCheck())) {
      let missingFields = [];
      if (!name) missingFields.push("Name");
      if (!email) missingFields.push("Email");
      if (!workAuth) missingFields.push("Work Authorization");
      if (!validLocation) missingFields.push("Location Info");
      if (!resumeCheck()) missingFields.push("Resume");
      let errormessage = `Missing: ${missingFields.shift()}`;
      while (missingFields.length)
        errormessage = `${errormessage}, ${missingFields.shift()}`;
      errormessage = `${errormessage}.`;
      toast({
        title: "Enter required fields",
        description: errormessage,
        status: "error",
        isClosable: true,
      });
      return;
    }
    setIsSubmitting(true);
    const resumedata = new FormData();
    let resume_exists = 0;
    if (resume) {
      resume_exists = 1;
      resumedata.append("resume", resume);
    }

    const application = {
      name,
      phone: phone || "",
      email,
      linkedin: linkedIn || "",
      website: website || "",
      resume_is_pdf: resumeIsPDF,
      resume_exists: resume_exists,
      country_code: country,
    };
    try {
      if (workAuth === "Yes" && validLocation !== "No") {
        await axios.post("/api/applicant/createApplicant", resumedata, {
          headers: {
            "Content-Type": "multipart/form-data",
            jobrequisitionid: jobID,
            ...application,
          },
          withCredentials: true,
        });
      } else {
        await delay(2500);
      }
      toast({
        title: "Application submitted!",
        status: "success",
        isClosable: true,
      });
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title:
          "Enter submitting application. Please contact support: ali@hiring.cafe",
        description: error.message,
        status: "error",
        isClosable: true,
      });
      await dumpErrorMessage(error, JSON.stringify(application));
    }
    setIsSubmitting(false);
  };

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

  const checkAllowedCountries = () => {
    const defaultAllows = new Set([
      "US",
      "CA",
      "Unlisted",
      "Localhost",
      "Unlisted/Localhost",
    ]);
    if (job.job_info.workplace_location) {
      defaultAllows.add(job.job_info.workplace_location);
    }
    if (defaultAllows.has(userCountry)) return true;
    return false;
  };

  const displayJob = () => {
    if (isPreview) return true;
    // if (!checkAllowedCountries()) return false;
    if (job?.status === "listed") return true;
    return false;
  };

  const applyButton = () => {
    if (job.external_redirect)
      return (
        <button
          href={job.external_url}
          className="bg-blue-700 hover:bg-blue-900 py-2 px-8 text-md font-bold rounded-md text-white"
          onClick={async () => {
            router.replace(job.external_url);
          }}
        >
          Apply Now
        </button>
      );

    return (
      <Link
        href="#app"
        className="bg-blue-700 hover:bg-blue-900 py-2 px-8 text-md font-bold rounded-md text-white"
      >
        Apply Now
      </Link>
    );
  };

  const applicationForm = () => {
    if (isSubmitted) {
      return (
        <>
          <div
            id="app"
            className="flex flex-col border rounded-xl p-12 space-y-6"
          >
            <span className="flex flex-col items-center text-center">
              <PaperAirplaneIcon className="h-12 w-12" />
              <span className="mt-4 font-medium">
                Your application has been submitted!
              </span>
              <span className="text-red-600 mt-4 font-medium">
                Please check your spam folder and whitelist our email address to
                ensure you receive our response.
              </span>
            </span>
          </div>
        </>
      );
    }

    if (job.external_redirect) {
      return <div className="w-1/3">{applyButton()}</div>;
    }

    let countrySelections = Object.keys(ISO3166CountryCodes);

    return (
      <>
        <div
          id="app"
          className="flex flex-col border rounded-lg py-4 px-6 space-y-6"
        >
          <span className="font-bold text-xl">Application</span>
          {!displayJob() && <span>This job is currently closed</span>}
          {displayJob() && (
            <>
              <div className="flex flex-col space-y-4 text-xs">
                <div className="flex flex-col space-y-4">
                  {/* {(user && userData) &&
                    <div>
                      <button
                        onClick={onOpen}
                        className="bg-blue-200 hover:bg-blue-300 py-3 w-44 rounded-lg font-bold text-blue-800 px-1"
                      >
                        Apply with HiringCafe
                      </button>
                      <div className="mt-4 text-lg font-bold">Or</div>
                    </div>
                  } */}
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-500">
                      Full Name <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={name}
                      className="border rounded py-1 px-2"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      onChange={(e) => {
                        setName(e.target.value || "");
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-500">
                      What country are you currently located in?
                      <span className="text-red-600">*</span>
                    </span>
                    <select
                      value={country}
                      className="border border-gray-500 rounded-md h-9 pl-2"
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                    >
                      <option disabled={true} value="">
                        Select...
                      </option>
                      {Object.keys(ISO_COUNTRIES).map((c) => (
                        <option key={c} value={c}>
                          {ISO_COUNTRIES[c]}
                        </option>
                      ))}
                    </select>
                  </div>
                  {job.job_info.workplace_address_type !== "anywhere" && (
                    <div className="flex flex-col space-y-2">
                      <span className="text-gray-500">
                        Are you willing to relocate for this job?
                        <span className="text-red-600">*</span>
                      </span>
                      <select
                        value={validLocation}
                        className="border border-gray-500 rounded-md h-9 pl-2"
                        onChange={(e) => {
                          setValidLocation(e.target.value);
                        }}
                      >
                        <option disabled={true} value="">
                          Select...
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )}
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-500">
                      {job.job_info.workplace_address_type === "country"
                        ? `Are you authorized to work in ${
                            ISO_COUNTRIES[job.job_info.workplace_address]
                          }?`
                        : job.job_info.workplace_address_type === "region"
                        ? `Are you authorized to work within the following region: ${job.job_info.workplace_address}?`
                        : `Are you authorized to work ${
                            job.job_info.workplace_address_type !== "anywhere"
                              ? "within this job's required location"
                              : "in your current location"
                          }?`}
                      <span className="text-red-600">*</span>
                    </span>
                    <select
                      value={workAuth}
                      className="border border-gray-500 rounded-md h-9 pl-2"
                      onChange={(e) => {
                        setWorkAuth(e.target.value);
                      }}
                    >
                      <option disabled={true} value="">
                        Select...
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-500">
                      Phone number with full area code{" "}
                      {job.application_fields.phone && (
                        <span className="text-red-500"> *</span>
                      )}
                      <span className="font-bold">
                        (Receive status updates via SMS)
                      </span>
                    </span>
                    <span>Include country code: (+1) 111-222-2222</span>
                    <input
                      value={phone}
                      className="border rounded py-1 px-2"
                      type="text"
                      name="name"
                      placeholder="Phone number"
                      onChange={(e) => {
                        setPhone(e.target.value || "");
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2 flex-auto">
                    <span className="text-gray-500">
                      Email <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={email}
                      className="border rounded py-1 px-2"
                      type="text"
                      name="email"
                      placeholder="Email"
                      onChange={(e) => {
                        setEmail(e.target.value || "");
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 flex-auto">
                  <span className="text-gray-500">
                    LinkedIn
                    {job.application_fields?.linkedin && (
                      <span className="text-red-500"> *</span>
                    )}
                  </span>
                  <input
                    value={linkedIn}
                    className="border rounded py-1 px-2"
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn"
                    onChange={(e) => {
                      setLinkedIn(e.target.value || "");
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2 flex-auto">
                  <span className="text-gray-500">
                    Website
                    {job.application_fields?.website && (
                      <span className="text-red-500"> *</span>
                    )}
                  </span>
                  <input
                    value={website}
                    className="border rounded py-1 px-2"
                    type="text"
                    name="website"
                    placeholder="Website"
                    onChange={(e) => {
                      setWebsite(e.target.value || "");
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span>
                      Resume{" "}
                      {!isResumeOptional() && (
                        <span className="text-red-500">*</span>
                      )}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">{`Max. file size: 4MB (pdf, doc, and docx only)`}</span>
                  </div>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
                    accept="application/msword, application/pdf, .doc,.docx"
                    onChange={onResumeChange}
                    disabled={isSubmitting}
                    type="file"
                  />
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    disabled={isSubmitting}
                    className="bg-blue-200 hover:bg-blue-300 py-3 w-44 rounded-lg font-bold text-blue-800"
                    onClick={async () => {
                      await submitApplication();
                    }}
                  >
                    {isSubmitting ? (
                      <span className="animate-ping">...</span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  if (loading || loadingUserCountry) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex flex-col w-full max-w-xl">
          <Stack>
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="300px" />
            <Skeleton height="100px" />
          </Stack>
        </div>
      </div>
    );
  }

  if (!job) {
    return <span>Job not found!</span>;
  }

  const returnHeaderImage = () => {
    const url = job.board?.public_board_id?.length
      ? `/board/${job.board.public_board_id}`
      : "/";
    if (job.board.image_url) {
      return (
        <a href={url}>
          <Picture
            alt={"logo"}
            src={job.board.image_url}
            properties={"w-28 max-h-28 object-contain"}
          />
        </a>
      );
    } else {
      return <HiringCafeLogo href={url} />;
    }
  };

  return (
    <>
      <div className="flex justify-center mt-4 mx-6 mb-16 pb-16 pt-8">
        <div className="flex flex-auto flex-col space-y-8 max-w-xl">
          <div className="flex justify-between items-center">
            {displayJob() && (
              <span className="text-2xl font-extrabold">{job.board.title}</span>
            )}
            {job.status === "listed" &&
              !isPreview &&
              displayJob() &&
              applyButton()}
          </div>
          {displayJob() ? (
            <div className="flex flex-col space-x-0 space-y-8">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span className="text-4xl font-bold text-gray-800">
                      {job.job_info.title}
                    </span>
                    {job.job_info.workplace_address && (
                      <span className="font-bold text-xl">
                        {job.job_info.workplace_address}
                      </span>
                    )}
                  </div>
                  {job.job_info.salary && (
                    <span className="w-fit font-semibold px-2 py-1 text-lg bg-blue-100 text-blue-600 rounded">
                      Salary: {job.job_info.salary}
                    </span>
                  )}
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2 items-center">
                      {job.job_info.job_type && (
                        <span className="font-semibold px-2 py-1 text-sm bg-gray-200 rounded">
                          {jobTypeMap[job.job_info.job_type] ||
                            job.job_info.job_type}
                        </span>
                      )}
                      {job.job_info.workplace && (
                        <span className="font-semibold px-2 py-1 text-sm bg-gray-200 rounded">
                          {job.job_info.workplace}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Body */}
                <div className="flex flex-col space-y-8">
                  <article className="prose prose-h1:text-2xl">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: xss(job.job_info.job_description || ""),
                      }}
                    />
                  </article>
                </div>
              </div>
              {applicationForm()}
            </div>
          ) : (
            <span className="flex justify-center font-bold text-xl px-4 py-2 bg-red-400 text-white">
              This job is currently closed
            </span>
          )}
          <Link
            href={"/"}
            target="_blank"
            rel="noreferrer"
            className="flex justify-center hover:text-red-600"
          >
            <div className="flex flex-col space-y-1 items-center mt-2">
              <span className="text-xs">Powered by </span>
              <span className="text-xl font-extrabold">HiringCafe</span>
            </div>
          </Link>
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Apply with HiringCafe Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {userData && (
                <div className="mb-4">
                  <div className="text-lg font-bold">
                    Please review your information first.
                  </div>
                  <div className="text-xs">
                    You can make changes on your{" "}
                    <Link href={"/account"} className="underline text-blue-500">
                      Account
                    </Link>{" "}
                    page.
                  </div>
                  <div className="border border-1 m-1 p-2 rounded">
                    <div
                      className={`${!userData?.name?.length && "text-red-500"}`}
                    >
                      Name: {userData.name || ""}
                    </div>
                    <div>Email: {user.email}</div>
                    <div>Phone: {userData.phone || "Not Provided"}</div>
                    <div>LinkedIn: {userData.linkedin || "Not Provided"}</div>
                    <div>
                      Twitter/Website: {userData.twitter || "Not Provided"}
                    </div>
                    <div>
                      Country:{" "}
                      {ISO_COUNTRIES[userData.country?.toUpperCase() || ""]}
                    </div>
                    {userData.resume?.length ? (
                      RenderResume({
                        url: userData.resume,
                        isPdf: userData.resume_is_pdf,
                      })
                    ) : (
                      <div className="text-red-500">Resume: Not Provided</div>
                    )}
                  </div>
                  <button
                    disabled={!verifyApplyWithAccount()}
                    className="bg-blue-200 hover:bg-blue-300 py-3 w-44 rounded-lg font-bold text-blue-800"
                    onClick={async () => {
                      await submitWithAccount();
                    }}
                  >
                    {isSubmitting ? (
                      <span className="animate-ping">...</span>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
