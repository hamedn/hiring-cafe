import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState } from "react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { blacklistedStageNames } from "@/admin/utils/inputBlacklists";

export default function CustomHiringStage({
  id,
  stage,
  onStageNameChange,
  onStageRemove,
  isUpdating,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const handleStageRemoveClick = () => {
    setIsOpen(true);
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [stageName, setStageName] = useState(stage);

  const handleStageNameChange = (event) => {
    setStageName(event.target.value);
  };

  const handleStageNameClick = () => {
    setIsEditing(true);
  };

  const handleStageNameBlur = () => {
    if (blacklistedStageNames.includes(stageName)) {
      setStageName(stage);
      return;
    }
    setIsEditing(false);
    onStageNameChange(stageName);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isUpdating) {
    return (
      <div className="flex items-center space-x-6 border p-4 rounded bg-white">
        <div className="h-5 bg-gray-300 animate-pulse w-96" />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="">
      <div className={"flex items-center space-x-6 border w-96 p-4 rounded bg-white"}>
        <EllipsisVerticalIcon
          className="flex-none h-5 w-5 text-gray-400 outline-none cursor-move"
          {...attributes}
          {...listeners}
        />
        <div className="flex flex-col flex-auto">
          {isEditing ? (
            <input
              type="text"
              value={stageName}
              onChange={handleStageNameChange}
              onBlur={handleStageNameBlur}
              autoFocus
              className="outline-none bg-transparent"
            />
          ) : (
            <span className="" onClick={handleStageNameClick}>
              {stage}
            </span>
          )}
        </div>
        <button className="p-1 text-red-500" onClick={handleStageRemoveClick}>
          <TrashIcon className="flex-none h-5 w-5" />
        </button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Stage
              </AlertDialogHeader>

              <AlertDialogBody>
                {`Are you sure? You can't undo this action afterwards.`}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    onStageRemove();
                    onClose();
                  }}
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
  );
}
