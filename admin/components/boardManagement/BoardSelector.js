import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CircularProgress } from "@chakra-ui/react";
import { useAuth } from "@/admin/hooks/useAuth";

export default function BoardSelector() {
  const toast = useToast();
  const router = useRouter();
  const { userData, loadingUserData } = useAuth();
  const [boardsList, setBoardsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadBoards = async () => {
    // get Data
    await axios
      .get(`/api/admin/board/getBoards`)
      .then((response) => {
        const boardsGet = response.data.board_list || [];
        setBoardsList(boardsGet);
      });
    setLoading(false);
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const changeBoard = async (board_id) => {
    setSubmitting(true);
    try {
      await axios.post(`/api/admin/board/changeBoard`, { board_id: board_id });
      toast({
        title: "Success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/admin");
    } catch (error) {
      toast({
        title: "Error updating board.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setSubmitting(false);
  }

  if (loading || loadingUserData) {
    return <CircularProgress isIndeterminate color="gray.600" size={"30px"} />;
  }

  const getRowHighLight = (board, index) => {
    if (userData && userData.board === board.board_id) {
      return "bg-green-100";
    } else if (index % 2) {
      return "bg-gray-100";
    } else return "";
  };

  return null; // TODO: FINISH THIS LATER.

  return (
    <div className="m-2">
      <div className="font-semibold text-lg">Switch Board: </div>
      <div className="flex flex-col border rounded-xl divide-y my-4">
        <div className="flex divide-x items-center font-medium bg-gray-100">
          <span className="p-4 w-5/6 text-center">Board</span>
          <span className="p-4 w-1/6 text-center">Select</span>
        </div>
        <div className="flex flex-col max-h-72 overflow-y-auto">
          {boardsList
            .map((board, index) => (
              <div key={board.board_id} className={`flex divide-x items-center border border-1 ${getRowHighLight(board, index)}`}>
                <span className="p-1 w-5/6 text-center">
                  {board.title} <span className="text-red-500 text-xs">{board.is_owner ? "*Board Owner" : ""}</span>
                </span>
                <span className="p-1 w-1/6 text-center">
                  <button disabled={submitting} onClick={() => changeBoard(board.board_id)} className="p-2 m-2 bg-blue-500 text-white rounded">Select</button>
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
