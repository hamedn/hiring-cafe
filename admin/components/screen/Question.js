import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  CircularProgress,
  Tooltip,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import {
  ArrowsUpDownIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useScreenData from "@/admin/hooks/useScreenData";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import VideoPlayer from "../adminDashboard/candidateProfiles/VideoPlayer";

const Question = ({ index, id, screenID, job_id, public_access = null }) => {
  const toast = useToast();
  const [question, setQuestion] = useState({});
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const { screen } = useScreenData(screenID);
  const [indexToUpdate, setIndexToUpdate] = useState(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateScreenData = async (updatedQuestions) => {
    try {
      if (public_access) {
        const dataToSend = {
          screenId: screenID,
          job_id: job_id,
          access_token: public_access,
          questions: updatedQuestions,
        };
        await axios.patch("/api/admin/videoScreen/publicUpdateVideoScreenQuestion", dataToSend);
      } else {
        await setDoc(
          doc(clientFirestore, "screens", screenID),
          {
            questions: updatedQuestions,
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (
      screen &&
      screen.questions &&
      index >= 0 &&
      index < screen.questions.length
    ) {
      setQuestion(screen.questions[index]);
      setTitle(`${screen.questions[index].title}`);
    }
  }, [index, screen]);

  useEffect(() => {
    let isSubscribed = true;
    const submittedVideo = (message) =>
      message.data &&
      message.data.mediaType &&
      message.data.mediaType === "video" &&
      message.data.type &&
      message.data.type === "videoask_question_submitted";

    const handler = async (message) => {
      if (indexToUpdate === null || !submittedVideo(message)) {
        return;
      }

      const updatedQuestions =
        screen.questions && screen.questions.length > 0
          ? [...screen.questions]
          : [];
      updatedQuestions[indexToUpdate] = {
        ...updatedQuestions[indexToUpdate],
        is_processing_video_update: true,
      };

      try {
        if (public_access) {
          const dataToSend = {
            screenId: screenID,
            job_id: job_id,
            access_token: public_access,
            questions: updatedQuestions,
          };
          await axios.patch("/api/admin/videoScreen/publicUpdateVideoScreenQuestion", dataToSend);
        } else {
          await setDoc(
            doc(clientFirestore, "screens", screenID),
            {
              questions: updatedQuestions,
            },
            { merge: true }
          );
        }
      } catch (error) {
        console.log(error);
      }
      setIndexToUpdate(null);
    };

    window.addEventListener("message", handler);
    return () => isSubscribed && window.removeEventListener("message", handler);
  }, [indexToUpdate, screen, screenID]);

  const handleDurationChange = async (e) => {
    if (e.target.value === question.answer_time_limit) {
      return;
    }
    const updatedQuestions = [
      ...screen.questions.slice(0, index),
      { ...screen.questions[index], answer_time_limit: e.target.value },
      ...screen.questions.slice(index + 1),
    ];

    await updateScreenData(updatedQuestions);
    await updateQuestionMetadata({ media_time_limit: e.target.value });
  };

  const handleTitleChange = async (e) => {
    if (e.target.value === title) {
      setEditingTitle(false);
      return;
    }
    const updatedQuestions = [
      ...screen.questions.slice(0, index),
      { ...screen.questions[index], title: e.target.value },
      ...screen.questions.slice(index + 1),
    ];
    
    await updateScreenData(updatedQuestions);
    setEditingTitle(false);
    await updateQuestionMetadata({ title: e.target.value });
  };

  const handleRemoveQuestion = () => {
    setIsOpen(true);
  };

  const confirmRemoveQuestion = async () => {
    setIsDeletingQuestion(true);
    try {
      const dataToSend = {
        screenId: screenID,
        questionIndex: index,
        job_id: job_id,
      };
      if (public_access) dataToSend.access_token = public_access;
      await axios.delete("/api/admin/videoScreen/deleteQuestion", {
        data: dataToSend,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error deleting question",
        description: error.response.data.error,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsDeletingQuestion(false);
      onClose();
    }
  };

  const handleUpdateQuestionVideo = () => {
    setIndexToUpdate(index);
    window.videoask.loadModal({
      url: `https://ask.hiring.cafe/f4x9d6jjd#question_to_update=${question.videoask_question_id}&screen_id=${screenID}&screen_type=INITIAL_VIDEO_SCREEN_QUESTION&question_index=${index}`, // TODO: Make videoask url dynamic
      options: { modalType: "Fullscreen" },
    });
  };

  const updateQuestionMetadata = async (metadata) => {
    try {
      const dataToSend = {
        screenId: screenID,
        questionIndex: index,
        metadata: metadata,
        job_id: job_id,
      };
      if (public_access) dataToSend.access_token = public_access;
      await axios.patch("/api/admin/videoScreen/updateQuestionMetadata", dataToSend);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!question || !screen) return null;

  const PreviewModal = () => (
    <Modal
      size={"3xl"}
      isOpen={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="mb-8">
            <VideoPlayer videoSrcs={[previewUrl]} showControls={true} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <PreviewModal />
      <div ref={setNodeRef} style={style}>
        <div className="flex items-center space-x-4 mb-4 p-4 border rounded shadow-sm bg-white">
          <div className="flex flex-none items-center space-x-4">
            {screen.questions.length > 1 && (
              <ArrowsUpDownIcon
                {...attributes}
                {...listeners}
                className="flex-none h-5 w-5 text-gray-400 cursor-move focus:outline-none"
              />
            )}
          </div>
          <div className="flex flex-col flex-auto">
            {editingTitle ? (
              <input
                type="text"
                defaultValue={title}
                onBlur={handleTitleChange}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await handleTitleChange(e);
                  }
                }}
                className="border rounded p-2 w-full"
                autoFocus
              />
            ) : (
              <span
                onClick={() => setEditingTitle(true)}
                className="cursor-pointer text-lg font-semibold"
              >
                {title}
              </span>
            )}
            <div className="mt-2 text-gray-600 flex items-center space-x-2">
              <span>{`Respond time:`}</span>
              <Tooltip
                hasArrow
                label="This sets the duration of how long the candidate has to answer your question."
                fontSize="md"
              >
                <span className="ml-1">
                  <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                </span>
              </Tooltip>
              <select
                value={question.answer_time_limit}
                onChange={handleDurationChange}
                className="border rounded p-1"
              >
                <option value="60">1 min</option>
                <option value="120">2 min</option>
                <option value="180">3 min</option>
                <option value="240">4 min</option>
                <option value="300">5 min</option>
              </select>
            </div>
          </div>
          <div className="flex flex-none items-center space-x-2">
            {question.is_processing_video_update ? (
              <>
                <CircularProgress
                  isIndeterminate
                  color="yellow.500"
                  size="20px"
                />
                <span>Video is being processed...</span>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsPreviewOpen(true);
                    setPreviewUrl(question.media_url);
                  }}
                  className="border-black border rounded px-4 py-1 mr-2"
                >
                  Preview
                </button>
                <button
                  className="text-white bg-black rounded px-4 py-1 mr-2"
                  onClick={handleUpdateQuestionVideo}
                >
                  Change
                </button>
                {index !== 0 && (
                  <button
                    onClick={handleRemoveQuestion}
                    className="p-1 text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </>
            )}
          </div>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Question
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete this question? All associated
                  recorded responses will be permanently deleted. This action
                  cannot be undone.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={confirmRemoveQuestion}
                    isLoading={isDeletingQuestion}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default Question;
