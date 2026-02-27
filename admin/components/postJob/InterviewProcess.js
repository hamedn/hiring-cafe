import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import CustomHiringStage from "./CustomHiringStage";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { ArrowDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import useJob from "@/admin/hooks/useJob";
import axios from "axios";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Head from "next/head";
import { blacklistedStageNames } from "@/admin/utils/inputBlacklists";

export default function InterviewProcess({ jobID, public_access = null }) {
  const toast = useToast();
  const { job, loading, error, setJob } = useJob({ job_id: jobID });
  const marginBetweenStages = "my-4";
  const sensors = useSensors(useSensor(PointerSensor));
  const [updatingStage, setUpdatingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const from = job.interview_process.findIndex(
        (stage) => stage === active.id
      );
      const to = job.interview_process.findIndex((stage) => stage === over.id);
      const updatedInterviewProcess = arrayMove(
        job.interview_process,
        from,
        to
      );
      setUpdatingStage(true);
      try {
        const dataToSend = {
          job_id: jobID,
          patch_data: {
            interview_process: updatedInterviewProcess,
          },
        };
        if (public_access) dataToSend.access_token = public_access;
        await axios.patch(`/api/admin/job`, dataToSend);
      } catch (err) {
        toast({
          title: "Error updating interview process",
          description: err.response.data.error,
          status: "error",
          isClosable: true,
        });
      } finally {
        setUpdatingStage(false);
      }
    }
  };

  const handleStageRemove = async (stageIndex) => {
    if (job.interview_process.length === 1) {
      toast({
        title: "Please keep at least one additional stage",
        status: "error",
        isClosable: true,
      });
      return;
    }

    // Optimistically update the interview process
    const updatedInterviewProcess = [...job.interview_process];
    updatedInterviewProcess.splice(stageIndex, 1);
    setJob({
      ...job,
      interview_process: updatedInterviewProcess,
    });

    try {
      const patchData = {
        job_id: job.id,
        step_index: stageIndex,
        action: "delete",
        newStepName: "",
      };
      if (public_access) patchData.access_token = public_access;
      await axios.patch(`/api/admin/specialCases/jobStep`, patchData);
    } catch (err) {
      setJob({
        ...job,
        interview_process: job.interview_process,
      });
      toast({
        title: "Error removing the stage",
        description: err.response.data.error,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleStageNameChange = async (newName, stageIndex) => {
    // do not allow usage of reserved names.
    if (blacklistedStageNames.includes(newName)) return;
    // no need to make api call if the stage hasn't changed.
    if (newName === job.interview_process[stageIndex]) return;
    // Make sure the new name is not a duplicate
    const uniqueStages = new Set(job.interview_process);
    uniqueStages.delete(job.interview_process[stageIndex]);
    if (uniqueStages.has(newName)) {
      toast({
        title: "Stage names must be unique",
        description: "Please enter a different name for the stage.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const updatedInterviewProcess = [...job.interview_process];
    updatedInterviewProcess[stageIndex] = newName;
    // Optimistically update the interview process
    setJob({
      ...job,
      interview_process: updatedInterviewProcess,
    });

    try {
      const patchData = {
        job_id: job.id,
        step_index: stageIndex,
        action: "edit",
        newStepName: newName,
      };
      if (public_access) patchData.access_token = public_access;
      await axios.patch(`/api/admin/specialCases/jobStep`, patchData);
    } catch (err) {
      setJob({
        ...job,
        interview_process: job.interview_process,
      });
      toast({
        title: "Error updating the stage name",
        description: err.response.data.error,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleNewStageAdd = async () => {
    if (newStageName.trim().length === 0) {
      toast({
        title: "Stage name can't be empty",
        description: "Please enter a name for the new stage.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    setUpdatingStage(true);

    const updatedInterviewProcess = [
      ...(job.interview_process || []),
      newStageName.trim(),
    ];

    try {
      await axios.patch(`/api/admin/job`, {
        job_id: jobID,
        patch_data: {
          interview_process: updatedInterviewProcess,
        },
      });
    } catch (err) {
      toast({
        title: "Error adding the stage",
        description: err.response.data.error,
        status: "error",
        isClosable: true,
      });
    } finally {
      setUpdatingStage(false);
      setNewStageName(""); // clear input field
    }
  };

  return (
    <>
      <Head>
        <title>Interview Process - Hiring cafe</title>
      </Head>
      <div className="flex justify-center flex-auto">
        <div className="flex flex-col items-center text-lg max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl font-medium">{`Configure Stages`}</span>
            <span className="mt-6 text-gray-500 font-medium">{`You can modify stages any time. Candidates won't be able to view this information.`}</span>
          </div>
          <div className="w-full mt-16">
            <div className="flex flex-col items-center">
              <div className="flex w-96 border p-4 rounded bg-gray-100">
                <span className="">{"Submit Application"}</span>
              </div>
              <ArrowDownIcon
                className={`h-5 w-5 text-gray-400 ${marginBetweenStages}`}
              />
              <div className="flex w-96 border p-4 rounded bg-gray-100">
                <span className="">{"Screen"}</span>
              </div>
              <ArrowDownIcon
                className={`h-5 w-5 text-gray-400 ${marginBetweenStages}`}
              />
            </div>
            {loading ? (
              <div className="flex justify-center">
                <div className="flex w-96 border p-4 rounded bg-gray-200 animate-pulse">
                  <span>Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center">
                <span className="text-red-600 w-96">
                  {"There was an error loading the interview process: " +
                    error.message}
                </span>
              </div>
            ) : (
              job.interview_process && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={job.interview_process.map((stage) => stage)}
                    strategy={verticalListSortingStrategy}
                  >
                    {job.interview_process.map((stage, i) => (
                      <div key={stage} className="flex flex-col items-center">
                        <CustomHiringStage
                          id={stage}
                          stage={stage}
                          onStageRemove={async () => await handleStageRemove(i)}
                          onStageNameChange={async (newName) => {
                            await handleStageNameChange(newName, i);
                          }}
                          isUpdating={updatingStage}
                        />
                        {i !== job.interview_process.length - 1 && (
                          <ArrowDownIcon
                            className={`h-5 w-5 text-gray-400 ${marginBetweenStages}`}
                          />
                        )}
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
              )
            )}
          </div>
          {!loading && !error && (
            <div className="flex space-x-2 mt-10">
              <input
                className="w-64 px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="New stage..."
              />
              <button
                className={`flex justify-center items-center w-32 border border-black rounded px-6 py-2 ${
                  !updatingStage &&
                  "hover:text-white font-bold hover:bg-gray-900 hover:border-gray-900 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
                }`}
                onClick={handleNewStageAdd}
                disabled={updatingStage}
              >
                {updatingStage ? (
                  <CircularProgress isIndeterminate size="20px" color="black" />
                ) : (
                  <PlusIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
