import { useState } from "react";
import StepTimeline from "./StepTimeline";
import ReviewStep from "./ReviewStep";
import Questions from "./Questions";
import IntroStep from "./IntroStep";
import OutroStep from "./OutroStep";
import { doc, updateDoc } from "firebase/firestore";
import axios from "axios";
import useScreenData from "@/admin/hooks/useScreenData";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import { CircularProgress } from "@chakra-ui/react";
import { VideoCameraSlashIcon } from "@heroicons/react/24/outline";

const ScreenVideoForm = ({ screenID, job_id, public_access = null }) => {
  const { screen, error, loading } = useScreenData(screenID);

  const steps = [
    {
      id: 1,
      label: "Pitch Video",
      component: IntroStep,
    },
    {
      id: 2,
      label: "Questions",
      component: Questions,
    },
    {
      id: 3,
      label: "Outro",
      component: OutroStep,
    },
    // {
    //   id: 4,
    //   label: "Preview",
    //   component: ReviewStep,
    // },
  ];
  const [selectedStep, setSelectedStep] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  const handleTitleChange = async (e) => {
    if (e.key === "Enter") {
      await updateFormTitle(e);
    }
  };

  const updateFormTitle = async (e) => {
    const newTitle = e.target.value;
    if (newTitle === screen) return;
    const screenRef = doc(clientFirestore, "screens", screenID);
    await updateDoc(screenRef, {
      title: newTitle,
    });
    setEditingTitle(false);
    try {
      const dataToSend = {
        screenId: screenID,
        title: newTitle,
        job_id: job_id,
      };
      if (public_access) dataToSend.access_token = public_access;
      await axios.patch("/api/admin/videoScreen/updateVideoaskTitle", dataToSend);
    } catch (error) {
      console.log("Error updating videoask form title: ", error);
    }
  };

  const handleStepSelected = (stepId) => {
    setSelectedStep(stepId);
  };

  const StepComponent = steps[selectedStep - 1].component;

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <CircularProgress isIndeterminate color="black" size="30px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-8">
        <div className="flex flex-col items-center text-red-600 border border-red-200 rounded-xl p-8 space-y-8">
          <VideoCameraSlashIcon className="w-12 h-12" />
          <div className="flex flex-col items-center space-y-2">
            <span className="font-medium">{error.message}</span>
            <span className="font-medium">Please contact support.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-8">
      {/* <span className="font-bold text-sm">Title</span> */}
      {/* <div className="flex border rounded cursor-pointer hover:bg-gray-50 mt-1.5">
        {editingTitle ? (
          <input
            type="text"
            className="w-full py-2 px-4 border-none outline-none"
            defaultValue={screen.title}
            onBlur={updateFormTitle}
            onKeyDown={handleTitleChange}
            autoFocus
          />
        ) : (
          <span
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setEditingTitle(true)}
            className="w-full py-2 px-4"
          >
            {screen.title}
          </span>
        )}
      </div> */}
      <div className="">
        <StepTimeline
          steps={steps}
          selectedStep={selectedStep}
          onStepSelected={handleStepSelected}
        />
      </div>
      <div className="mt-8">
        <StepComponent
          step={steps.find((step) => step.id === selectedStep)}
          screenID={screenID}
          job_id={job_id}
          public_access={public_access}
        />
      </div>
    </div>
  );
};

export default ScreenVideoForm;
