import Head from "next/head";
import BoardInfo from "./BoardInfo";
import { CircularProgress } from "@chakra-ui/react";
import { useAuth } from "@/admin/hooks/useAuth";
import useBoard from "@/admin/hooks/useBoard";
import BoardSelector from "./BoardSelector";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import { updateDoc, doc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import { withBoard } from "../withUserCheck";

function BoardManagement() {
  const { userData, loadingUserData } = useAuth();
  const { board, loading } = useBoard({ board_id: userData?.board });
  const toast = useToast();

  if (loadingUserData)
    return (
      <Head>
        <title>Team | HiringCafe</title>
      </Head>
    );

  return (
    <>
      <Head>
        <title>Team | HiringCafe</title>
      </Head>
      <div className="flex justify-center mt-8 mx-8">
        <span className="m-2 text-xl font-bold items-center">Settings</span>
      </div>
      <div className="flex xl:justify-center my-4 mx-8">
        <div className="flex flex-col flex-auto max-w-7xl">
          {true && (
            <div className="flex flex-col flex-auto justify-center">
              <div className="mx-2 flex justify-center font-bold text-gray-600">
                Your Name:{" "}
              </div>
              <div className="flex justify-center">
                <input
                  defaultValue={userData.name}
                  placeholder="Jon Doe"
                  onBlur={async (e) => {
                    if (e.target.value !== userData.name) {
                      await updateDoc(
                        doc(clientFirestore, `users/${userData.uid}`),
                        { name: e.target.value }
                      );
                      toast({
                        title: "Complete",
                        description: "Name Updated.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                    }
                  }}
                  className="border border-1 px-2 py-1 m-2 rounded"
                />
              </div>
            </div>
          )}
          {/* <span className="m-2 text-xl font-semibold items-center">Manage Board: {board.title}</span> */}
          {!userData || loading || !board.id ? (
            <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
          ) : (
            <BoardInfo userData={userData} boardData={board} />
          )}
          <div>
            <BoardSelector />
          </div>
        </div>
      </div>
    </>
  );
}

export default withBoard(BoardManagement);
