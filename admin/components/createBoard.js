import { Button, CircularProgress, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/admin/hooks/useAuth";
import useBoard from "@/admin/hooks/useBoard";
import { signout } from "../utils/client/signOut";
import HiringCafeEmployersLogo from "@/components/HiringCafeEmployersLogo";

export default function CreateBoard() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const router = useRouter();
  const { userData, loadingUserData } = useAuth();
  const { board } = useBoard({
    board_id: userData?.board,
  });

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description);
      setWorkspaceName(board.workspace_name || "");
    }
  }, [userData, board]);

  const onCreateBoardFinish = () => {
    router.replace(`/admin/onboarding/payment`);
  };

  if (loadingUserData) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress isIndeterminate size={"24px"} color="black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-8">
      <div className="flex-auto max-w-xl bg-white p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center justify-center">
          <HiringCafeEmployersLogo />
        </div>
        <div className="flex flex-col mb-6 text-center items-center mt-8">
          <span className="text-2xl font-bold text-gray-900 text-center">
            Set up your account
          </span>
        </div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="title"
        >
          Company Name
        </label>
        <input
          className="shadow appearance-none border border-black-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          id="title"
          type="text"
          placeholder={`Ex: Meta`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label
          className="block text-gray-700 text-sm font-bold mb-1"
          htmlFor="workspace_name"
        >
          Workspace Name
        </label>
        <label
          htmlFor="workspace_name"
          className="p-2 bg-slate-200 rounded text-sm"
        >
          Name of your workspace for your team members. Not visible to
          candidates.
        </label>
        <input
          className="mt-3 shadow appearance-none border border-black-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          id="workspace_name"
          type="text"
          placeholder={`Ex: Public Groups Team`}
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Tagline
        </label>
        <textarea
          className="resize-none h-28 shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          id="description"
          placeholder={`Describe your company in a few words...`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-between items-center space-x-8">
          <button
            className="text-red-600 text-sm font-medium"
            onClick={() => {
              signout();
              router.reload();
            }}
          >
            Log out
          </button>
          <Button
            colorScheme="orange"
            textColor={"white"}
            isLoading={isCreatingBoard}
            onClick={async () => {
              setIsCreatingBoard(true);
              try {
                await axios.post("/api/admin/board/createBoard", {
                  title,
                  description,
                  workspace_name: workspaceName,
                });
                setTitle("");
                setDescription("");
                onCreateBoardFinish();
              } catch (error) {
                console.trace(error);
                toast({
                  title: "Error creating board",
                  description: error.response.data.error,
                  status: "error",
                  isClosable: true,
                });
              } finally {
                setIsCreatingBoard(false);
              }
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
