import axios from "axios";
import { CircularProgress, Tooltip, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import { CheckIfBoardPublicIdAvailable } from "@/admin/utils/client/checkIfBoardPublicIdAvailable";
import { Picture } from "@/utils/picture";
import useAllBoardInvites from "@/admin/hooks/invites/useAllBoardInvites";
import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function BoardInfo({ userData, boardData }) {
  const toast = useToast();
  const [emailTarget, setEmailTarget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [removingInvite, setRemovingInvite] = useState(false);
  const [publicBoardToken, setPublicBoardToken] = useState(
    boardData.public_board_id || ""
  );
  const [boardImageUrl, setBoardImageUrl] = useState(
    boardData.image_url || null
  );
  const { invites } = useAllBoardInvites();

  const [boardAdmins, setBoardAdmins] = useState([]);

  useEffect(() => {
    const getBoardAdmins = async () => {
      try {
        const { data } = await axios.get(`/api/admin/board/getAdmins`);
        setBoardAdmins(data.admins || []);
      } catch (error) {
        console.trace(error.message);
        setBoardAdmins([]);
      }
    };
    getBoardAdmins();
  }, []);

  const manageBoardAdmins = async (action) => {
    setSubmitting(true);
    try {
      const dataToSubmit = {
        email: emailTarget,
        action: action,
      };
      await axios.post(`/api/admin/board/manageAdmins`, dataToSubmit);
      toast({
        title: `Successfully ${action}d ${emailTarget}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
  };

  const isValidImageUrl = (url) => {
    // Regular expression to match common image file extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;

    // Use the regular expression to test the URL
    return imageExtensions.test(url);
  };

  return (
    <div className="m-2">
      <div className="mb-2">
        {/* <div className="font-semibold text-lg flex flex-items">
          <span>Board Logo Image Url:</span>
          {isValidImageUrl(boardImageUrl) ?
            <Picture
              alt={"logo"}
              src={boardImageUrl}
              properties={"w-12 max-h-12 object-contain ml-4"}
            />
            :
            boardImageUrl?.length && <div className="font-normal text-xs mt-2 ml-2">[Invalid/Missing Image]</div>
          }
        </div> */}
        {/* <div className="text-xs">This will be displayed on your board and job posts.</div>
        <input type="text"
          placeholder="https://logosite.com/LogoUrl.svg"
          value={boardImageUrl}
          onChange={e => setBoardImageUrl(e.target.value)}
          onBlur={async () => {
            if (boardImageUrl === boardData.image_url || !boardImageUrl?.length) return;
            if (isValidImageUrl(boardImageUrl)) {
              await updateDoc(
                doc(clientFirestore, "boards", boardData.id),
                {
                  image_url: boardImageUrl,
                }
              );
            } else {
              toast({
                title: "This Image Url is not valid.",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
              setBoardImageUrl(null);
            }
          }}
          className="border border-1 px-2 rounded w-3/5"
        /> */}
      </div>
      {false && (
        <div className="mb-2">
          <div className="font-semibold text-lg">Public Board Id: </div>
          <div className="text-xs">
            Coming Soon: If this is set, applicants can view all jobs from your
            company on this page.
          </div>
          <input
            type="text"
            placeholder="CompanyName"
            value={publicBoardToken}
            onChange={(e) => {
              let value = e.target.value;
              if (/^[A-Za-z0-9]*$/.test(value)) {
                setPublicBoardToken(value);
              }
            }}
            onBlur={async () => {
              if (publicBoardToken === boardData.public_board_id) return;
              if (publicBoardToken) {
                if (
                  await CheckIfBoardPublicIdAvailable(
                    publicBoardToken,
                    boardData.id
                  )
                ) {
                  await updateDoc(
                    doc(clientFirestore, "boards", boardData.id),
                    {
                      public_board_id: publicBoardToken,
                    }
                  );
                } else {
                  toast({
                    title: "This ID is not available.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }
            }}
            className="border border-1 px-2 rounded w-3/5"
          />
          {false && publicBoardToken?.length > 0 && (
            <div>
              Your URL:{" "}
              <a
                className="text-blue-500 underline text-sm"
                href={`/board/${publicBoardToken}`}
              >{`https://hiring.cafe/board/${publicBoardToken}`}</a>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center font-bold text-gray-600">
        Invite admin
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex items-start">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder={`sammy@${userData.email.split("@")[1]}`}
              value={emailTarget}
              onChange={(e) => setEmailTarget(e.target.value)}
              className="border border-1 px-2 py-1 rounded w-64"
            />
            {emailTarget?.length &&
            emailTarget.includes("@") &&
            emailTarget.includes(".") &&
            userData.email.split("@")[1] !== emailTarget.split("@")[1] ? (
              <span className="mt-2 text-xs font-medium">{`Must be a '${
                userData.email.split("@")[1]
              }' email`}</span>
            ) : null}
          </div>
          <Tooltip label="Send invite">
            <button
              disabled={submitting}
              onClick={() => manageBoardAdmins("invite")}
              className={`${
                !submitting && "hover:bg-gray-200 text-gray-800"
              } font bold px-2 py-1 mx-2 rounded`}
            >
              {submitting ? (
                <CircularProgress
                  isIndeterminate
                  size="24px"
                  color="gray.600"
                />
              ) : (
                <PaperAirplaneIcon className="w-6 h-6" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
      {invites?.filter((admin) =>
        admin?.email?.includes("hiring.cafe") ? false : true
      )?.length ? (
        <div className="flex justify-center">
          <div className="flex flex-col flex-auto max-w-xl mt-4 space-y-4">
            <div className="flex justify-center mt-16 font-bold text-yellow-600">
              Pending invites
            </div>
            {invites.map((invite) => (
              <div
                className="flex items-center justify-between space-x-8 border rounded-lg py-4 px-6"
                key={invite.id}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-medium">{invite.email}</span>
                  <span className="mt-2 font-light text-sm">
                    Sent on{" "}
                    {invite.last_sent.toDate().toLocaleDateString("en-US")} at{" "}
                    {invite.last_sent.toDate().toLocaleTimeString("en-US")} by{" "}
                    {invite.inviter_name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip label="Resend invite">
                    <button
                      className={`p-2 rounded font-medium ${
                        !submitting && "hover:bg-gray-200 hover:text-gray-800"
                      } transition duration-200 ease-in-out`}
                      disabled={submitting}
                      onClick={async () => {
                        setSubmitting(true);
                        try {
                          const dataToSubmit = {
                            email: invite.email,
                            action: "invite",
                          };
                          await axios.post(
                            `/api/admin/board/manageAdmins`,
                            dataToSubmit
                          );
                          toast({
                            title: `Successfully resent invite.`,
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                          });
                        } catch (e) {
                          console.trace(e.message);
                          toast({
                            title: "Error resending invite.",
                            description: e.message,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          });
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip label="Remove invite">
                    <button
                      onClick={async () => {
                        setSubmitting(true);
                        try {
                          const dataToSubmit = {
                            email: invite.email,
                            action: "remove",
                          };
                          await axios.post(
                            `/api/admin/board/manageAdmins`,
                            dataToSubmit
                          );
                          toast({
                            title: `Successfully removed invite.`,
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                          });
                        } catch (e) {
                          console.trace(e.message);
                          toast({
                            title: "Error removing invite.",
                            description: e.message,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          });
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      className={`p-2 rounded font-medium text-red-600 ${
                        !submitting &&
                        "hover:bg-red-600 hover:text-red-50 transition duration-200 ease-in-out"
                      }`}
                      disabled={submitting}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {boardAdmins.length ? (
        <div className="flex justify-center mt-16 font-bold text-gray-600">
          Current admins
        </div>
      ) : null}
      {boardAdmins.length ? (
        <div className="flex justify-center mb-32">
          <div className="flex flex-col flex-auto max-w-xl mt-4 space-y-4">
            {boardAdmins
              .filter((admin) =>
                admin?.email?.includes("hiring.cafe") ? false : true
              )
              .map((admin) => (
                <div
                  className="flex flex-col space-y-1 border rounded-lg py-4 px-6"
                  key={admin.email}
                >
                  <span className="font-bold text-gray-600">{admin.name}</span>
                  <span className="font-light">{admin.email}</span>
                  {admin.email === userData.email && (
                    <span className="text-xs font-light">
                      <span className="text-red-600">*</span> You
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
