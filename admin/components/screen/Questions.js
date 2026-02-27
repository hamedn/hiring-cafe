import { useState, useEffect } from "react";
import Question from "./Question";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useScreenData from "@/admin/hooks/useScreenData";
import axios from "axios";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const Questions = ({ screenID, job_id, public_access = null }) => {
  const toast = useToast();
  const [questions, setQuestions] = useState([]);
  const { screen } = useScreenData(screenID);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  useEffect(() => {
    if (screen && screen.questions) {
      setQuestions(screen.questions);
    }
  }, [screen]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onAddQuestion = async () => {
    setCreatingQuestion(true);
    try {
      const dataToSend = {
        screenId: screenID,
        job_id: job_id,
      };
      if (public_access) dataToSend.access_token = public_access;
      await axios.post("/api/admin/videoScreen/createQuestion", dataToSend);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error adding question",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setCreatingQuestion(false);
    }
  };

  async function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id && over.id && active.id !== over.id) {
      const oldIndex = questions.findIndex(
        (question) => question.videoask_question_id === active.id
      );
      const newIndex = questions.findIndex(
        (question) => question.videoask_question_id === over.id
      );

      const updatedQuestions = arrayMove(questions, oldIndex, newIndex);

      try {
        const dataToSend = {
          screenId: screenID,
          job_id: job_id,
          questions: updatedQuestions,
        };
        if (public_access) dataToSend.access_token = public_access;
        await axios.patch("/api/admin/videoScreen/reorderQuestions", {
          screenId: screenID,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error reordering questions",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      }
    }
  }

  return (
    <div className="">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={questions.map((question) => question.videoask_question_id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question, index) => (
            <Question
              key={question.videoask_question_id}
              id={question.videoask_question_id}
              index={index}
              screenID={screenID}
              job_id={job_id}
              public_access={public_access}
            />
          ))}
        </SortableContext>
      </DndContext>
      {screen?.questions?.length < 3 && (
        <button
          className={`border border-black rounded mt-4 px-6 py-2 w-full font-bold ${!creatingQuestion &&
            "hover:text-white hover:bg-gray-900 hover:border-gray-900 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
            }`}
          onClick={onAddQuestion}
          disabled={creatingQuestion}
        >
          {creatingQuestion ? (
            <CircularProgress
              isIndeterminate
              size="20px"
              color="black"
              trackColor="transparent"
            />
          ) : (
            "Add Question"
          )}
        </button>
      )}
    </div>
  );
};

export default Questions;
