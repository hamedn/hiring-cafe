import useApplicant from "@/admin/hooks/useApplicant";
import { useAuth } from "@/admin/hooks/useAuth";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  DocumentCheckIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function NotesSummary({ applicantId }) {
  const {
    isOpen: isAddNotesOpen,
    onToggle: onAddNotesToggle,
    onClose: onAddNotesClose,
  } = useDisclosure();
  const { applicant, loading, error } = useApplicant({ applicantId });
  const [newNote, setNewNote] = useState("");
  const { userData } = useAuth();

  const {
    isOpen: isReadAllNotesModalOpen,
    onOpen: onReadAllNotesModalOpen,
    onClose: onReadAllNotesModalClose,
  } = useDisclosure();

  if (!applicantId) return null;

  if (loading) {
    return <div className="py-8 animate-pulse bg-gray-300 h-96 rounded-lg" />;
  }

  if (error) {
    return null;
  }

  const handleAddNote = () => {
    if (newNote) {
      const newNotes = [
        ...(applicant.notes || []),

        {
          content: newNote,
          author: userData?.name || "Admin",
          date: Timestamp.now(),
        },
      ];
      setNewNote("");
      onAddNotesClose();
      setDoc(
        doc(clientFirestore, "applicants", applicantId),
        {
          notes: newNotes,
        },
        { merge: true }
      ).catch((error) => {
        console.trace(error);
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-medium">
          {`${applicant.notes?.length || "0"}`} Note
          {applicant.notes?.length !== 1 && "s"}
        </span>
        <Popover isOpen={isAddNotesOpen} onClose={onAddNotesClose}>
          <PopoverTrigger>
            <button
              className="hover:text-white border border-black rounded-full p-1 font-medium hover:bg-gray-900 hover:border-gray-900 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
              onClick={onAddNotesToggle}
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <div className="mt-4 mb-2">
                <textarea
                  className="rounded-lg p-2 h-32 resize-none outline-none w-full border-black border"
                  placeholder="Write a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end">
              <div className="flex justify-end items-center space-x-2">
                <button
                  className="border border-black rounded w-24 py-1 font-medium text-black hover:bg-gray-100 text-sm"
                  onClick={handleAddNote}
                >
                  Add note
                </button>
              </div>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
      {applicant.notes?.length > 0 ? (
        <div className="grid grid-cols-2 gap-8 mt-8">
          {[...applicant.notes]
            .sort((a, b) => b.date - a.date)
            .slice(0, 4)
            .map((note, index) => (
              <div key={`${index}`} className="flex flex-col">
                <span className="text-xl font-medium">{note.author}</span>
                <span className="text-gray-500 text-sm">
                  {note.date.toDate().toLocaleDateString()}
                </span>
                <article className="prose line-clamp-3 mt-2">
                  {note.content}
                </article>
                <div className="flex items-center space-x-1 mt-4 text-sm font-bold underline">
                  <button onClick={onReadAllNotesModalOpen}>Show more</button>
                  <ChevronRightIcon className="h-3 w-3" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="mt-8 bg-gray-100 py-8 flex justify-center rounded-xl">
          <div className="flex flex-col items-center space-y-8">
            <DocumentCheckIcon className="h-12 w-12 text-gray-800" />
            <span className="font-medium text-sm">{`You don't have any notes for this applicant yet.`}</span>
          </div>
        </div>
      )}
      {applicant.notes?.length > 0 && (
        <div>
          <button
            className="mt-12 border border-black rounded py-2 px-6 font-medium hover:bg-gray-100"
            onClick={onReadAllNotesModalOpen}
          >
            Show {applicant.notes?.length > 1 && "all"}{" "}
            {applicant.notes?.length} note
            {applicant.notes?.length > 1 && "s"}
          </button>
        </div>
      )}
      <Modal
        isOpen={isReadAllNotesModalOpen && applicant.notes?.length > 0}
        onClose={onReadAllNotesModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {`${applicant.notes?.length || "0"}`} Note
            {applicant.notes?.length > 1 && "s"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {applicant.notes?.length > 0 && (
              <div className="flex flex-col mb-8 space-y-8">
                {[...applicant.notes]
                  .sort((a, b) => b.date - a.date)
                  .map((note, index) => (
                    <div key={`${index}`} className="flex flex-col text-sm">
                      <span className="font-medium">{note.author}</span>
                      <span className="text-gray-500 text-sm">
                        {note.date.toDate().toLocaleDateString()}
                      </span>
                      <span className="mt-2 text-sm">{note.content}</span>
                    </div>
                  ))}
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
