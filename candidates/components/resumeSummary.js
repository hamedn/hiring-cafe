import { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useToast } from "@chakra-ui/react";

export default function ResumeSummary({ applicant_id, access_token, mutate }) {
  const [resumeTokens, setResumeTokens] = useState([]);
  const [educationTokens, setEducationTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getGeneratedExperienceTokens = async () => {
      await axios
        .post(`/api/applicant/getResumeTokens`, { applicant_id: applicant_id, access_token: access_token })
        .then((response) => {
          const serverResumeTokens = response.data.tokens;
          const serverEducationTokens = response.data.educationTokens;
          setResumeTokens(serverResumeTokens);
          setEducationTokens(serverEducationTokens);
          setIsLoading(false);
        });
    };

    getGeneratedExperienceTokens();
  }, [applicant_id]);

  if (isLoading)
    return (
      <span>We are processing your resume. Please wait a few minutes.</span>
    );

  const addJob = () => {
    const newTokens = resumeTokens;
    newTokens.push({
      start_date: "",
      end_date: "",
      title: "",
      summary: "",
      company: "",
      employment_type: "Full-time",
    });
    setResumeTokens([...newTokens]);
  };

  const removeJob = (index) => {
    const newTokens = resumeTokens;
    newTokens.splice(index, 1);
    setResumeTokens([...newTokens]);
  };

  const updateJobData = (index, field, newValue) => {
    const newTokens = resumeTokens;
    newTokens[index][field] = newValue;
    setResumeTokens([...newTokens]);
  };

  const addEducation = () => {
    const newTokens = educationTokens;
    newTokens.push({
      institute: "",
      graduation_year: "",
      credentials: "",
    });
    setEducationTokens([...newTokens]);
  };

  const removeEducation = (index) => {
    const newTokens = educationTokens;
    newTokens.splice(index, 1);
    setEducationTokens([...newTokens]);
  };

  const updateEducationData = (index, field, newValue) => {
    const newTokens = educationTokens;
    newTokens[index][field] = newValue;
    setEducationTokens([...newTokens]);
  };

  const submitChanges = async () => {
    setIsProcessing(true);
    const submitData = {
      applicant_id: applicant_id,
      access_token: access_token,
      resume_summary: {
        jobs: resumeTokens,
        education: educationTokens,
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
      setIsProcessing(false);
    }
  };

  const jobsComponent = () => {
    return (
      <div className="my-2">
        <span className="font-xl font-bold p-2 mt-2"> Job History: </span>
        {resumeTokens.map((job, index) => (
          <div key={index} className="mx-3 my-2 border-2 rounded">
            <div className="w-full relative">
              <button
                className="text-red-500 text-xs m-1 top-0 right-0 absolute"
                onClick={() => removeJob(index)}
              >
                <TrashIcon /> Delete
              </button>
              <div className="m-2 w-full flex flex-items items-center">
                <span className="my-2 py-2 font-bold text-lg">Job Title: </span>
                <input
                  type="text"
                  value={job.title}
                  onChange={(e) =>
                    updateJobData(index, "title", e.target.value)
                  }
                  className="m-2 w-3/5 border border-1 rounded pl-2"
                />
              </div>
            </div>
            <hr />
            <div className="m-2 w-full">
              <span className="my-2">Company: </span>
              <input
                type="text"
                value={job.company}
                placeholder="Ex: Meta/Google/Amazon"
                onChange={(e) =>
                  updateJobData(index, "company", e.target.value)
                }
                className="m-2 w-3/5 border border-1 rounded pl-2"
              />
            </div>
            <div className="m-2 w-full">
              <span className="my-2">Employment Type: </span>
              <select
                type="text"
                value={job.employment_type}
                onChange={(e) =>
                  updateJobData(index, "employment_type", e.target.value)
                }
                className="m-2 w-3/5 border border-1 rounded pl-2"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="m-2 w-full">
              <span className="my-2">Start Date: </span>
              <input
                type="text"
                value={job.start_date}
                placeholder="MM/DD/YYYY"
                onChange={(e) =>
                  updateJobData(index, "start_date", e.target.value)
                }
                className="m-2 w-3/5 border border-1 rounded pl-2"
              />
            </div>
            <div className="m-2 w-full">
              <span className="my-2">End Date: </span>
              <input
                type="text"
                value={job.end_date}
                placeholder="MM/DD/YYYY or Current"
                onChange={(e) =>
                  updateJobData(index, "end_date", e.target.value)
                }
                className="m-2 w-3/5 border border-1 rounded pl-2"
              />
            </div>
            <span className="mt-2 pl-2 w-full">Summary:</span>
            <div className="mb-2 mx-2 w-full">
              <textarea
                value={job.summary}
                onChange={(e) =>
                  updateJobData(index, "summary", e.target.value)
                }
                className="m-2 border border-1 rounded pl-2"
                cols={50}
              />
            </div>
          </div>
        ))}
        <div className="w-full mb-4 mx-4">
          <button
            className={`bg-green-600 text-white p-2 m-2 rounded`}
            onClick={() => addJob()}
          >
            <span className="my-3 bold">Add Job</span>
          </button>
        </div>
      </div>
    );
  };

  const educationComponent = () => {
    return (
      <div>
        <span className="font-xl font-bold p-2 mt-2">Education History: </span>
        {educationTokens.map((education, index) => (
          <div key={index} className="mx-3 my-2 border-2 rounded">
            <div className="w-full relative">
              <button
                className="text-red-500 text-xs m-1 top-0 right-0 absolute"
                onClick={() => removeEducation(index)}
              >
                <TrashIcon /> Delete
              </button>
              <div className="m-2 w-full flex flex-items items-center">
                <span className="my-2 py-2 font-bold text-lg">Institute: </span>
                <input
                  type="text"
                  value={education.institute}
                  onChange={(e) =>
                    updateEducationData(index, "institute", e.target.value)
                  }
                  className="m-2 w-3/5 border border-1 rounded pl-2"
                />
              </div>
            </div>
            <hr />
            <div className="m-2 w-full">
              <span className="my-2">Graduation Year: </span>
              <input
                type="text"
                value={education.graduation_year}
                placeholder="YYYY"
                onChange={(e) =>
                  updateEducationData(index, "graduation_year", e.target.value)
                }
                className="m-2 w-3/5 border border-1 rounded pl-2"
              />
            </div>
            <div className="m-2 w-full">
              <span className="my-2">Degree/Credentials: </span>
              <input
                type="text"
                value={education.credentials}
                onChange={(e) =>
                  updateEducationData(index, "credentials", e.target.value)
                }
                className="m-2 w-3/5 border border-1 rounded pl-2"
              />
            </div>
          </div>
        ))}
        <div className="w-full mb-4 mx-4">
          <button
            className={`bg-green-600 text-white p-2 m-2 rounded`}
            onClick={() => addEducation()}
          >
            <span className="my-3 bold">Add Education</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full m-2">
      <div className="w-full flex flex-wrap mb-2">
        <span className="w-full">
          Please wait for your recruiter to contact you.
        </span>
        <span className="w-full">
          You can verify and update your work experience in the meantime.
        </span>
      </div>
      <div className="border-4 rounded">
        {jobsComponent()}
        {educationComponent()}
        <button
          disabled={isProcessing}
          className={`${!isProcessing ? "bg-blue-500 text-white" : "bg-gray-200"
            } mx-4 mb-4 p-3 rounded`}
          onClick={() => submitChanges()}
        >
          <span className="mx-4 p-3 font-bold text-lg">Submit Changes</span>
        </button>
      </div>
    </div>
  );
}
