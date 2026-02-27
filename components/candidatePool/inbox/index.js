import xss from "xss";
import he from "he";
import { useCallback, useEffect, useState } from "react";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  HandRaisedIcon,
  HandThumbDownIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import useSeekerProfile from "@/hooks/useSeekerProfile";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Picture } from "@/utils/picture";
import { ISO_COUNTRIES } from "@/utils/backend/countries";
import {
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

const InboxSeekers = () => {
  const toast = useToast();
  const { seekerUserData } = useSeekerProfile();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [invites, setInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { getIDToken, user } = useAuth();

  const {
    isOpen: isFullJDOpen,
    onOpen: onFullJDOpen,
    onClose: onFullJDClose,
  } = useDisclosure();

  const submitInviteResponse = async (
    invite,
    response,
    showProgressUI = true
  ) => {
    const token = await getIDToken();
    setUpdating(true);
    try {
      await axios.post(
        "/api/applicant/talent_network/respondToInvite",
        {
          invitation_id: invite.id,
          invitation_response: response,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getInvites();
      if (showProgressUI) {
        toast({
          title: "Success",
          description: "Your response has been submitted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.trace(error);
      if (showProgressUI) {
        toast({
          title: "Error",
          description:
            error.response?.data?.error?.message ||
            error.response?.data ||
            error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const getInvites = useCallback(async () => {
    if (!user || !getIDToken) {
      return;
    }
    const token = await getIDToken();
    try {
      // const idToken = await getIDToken();
      const res = await axios.get(
        "/api/applicant/talent_network/getJobInvites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.error) {
        console.trace(res.data.error);
        setErrorMsg("Internal server error");
      } else {
        setInvites(res.data);
      }
    } catch (error) {
      console.trace(error);
      setErrorMsg(error.response?.data?.error?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getInvites();
  }, [getInvites]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Inbox | Hiring Cafe</title>
        </Head>
        <div className="flex flex-col h-96 items-center justify-center mt-12 p-4">
          <div className="flex space-x-2 justify-center">
            <div className="bg-gray-800 rounded-full w-2 h-2 animate-pulse"></div>
            <div className="bg-gray-600 rounded-full w-2 h-2 animate-pulse delay-75"></div>
            <div className="bg-black rounded-full w-2 h-2 animate-pulse delay-100"></div>
          </div>
        </div>
      </>
    );
  }

  if (errorMsg) {
    return (
      <>
        <Head>
          <title>Inbox | Hiring Cafe</title>
        </Head>
        <div className="flex flex-col items-center justify-center mt-28 text-red-600">
          <ChatBubbleLeftRightIcon className="h-12 w-12" />
          <p className="mt-4 text-center font-medium">
            {`There was an error loading your messages. Please try again later.`}
          </p>
          <span>Error: {errorMsg}</span>
        </div>
      </>
    );
  }

  if (!invites?.length) {
    return (
      <>
        <Head>
          <title>Inbox | Hiring Cafe</title>
        </Head>
        <div className="flex flex-col items-center justify-center mt-28">
          <ChatBubbleLeftRightIcon className="h-12 w-12" />
          <h2 className="mt-8 text-xl font-medium">No Requests Yet</h2>
          <div className="mt-4 text-center font-light">
            {!seekerUserData ? (
              `Join HiringCafe Talent Network (free!) and let companies apply to you!`
            ) : !seekerUserData.active ? (
              <Link href="/talent-network" className="underline">
                Go live to be contacted by companies.
              </Link>
            ) : (
              "Please wait for companies to contact you!"
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Inbox | Hiring Cafe</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex flex-col flex-auto max-w-2xl text-sm">
          <span className="mb-4">
            <span className="font-bold">{invites.length}</span> new invites
          </span>
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex flex-col space-y-4 border p-4 rounded"
            >
              <div className="flex items-center space-x-2">
                {invite.company.image_url ? (
                  <Picture
                    src={invite.company.image_url}
                    properties={"w-12 h-12 object-cover rounded flex-none"}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded flex-none">
                    <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-gray-500">
                      <BuildingOfficeIcon className="w-6 h-6" />
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-base">
                    {invite.company.title}
                  </span>
                  <span className="font-light line-clamp-2">
                    {invite.company.description}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-bold">{invite.job.title}</span>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4 flex-none" />
                  {invite.job.workplace_address && (
                    <span className="">{invite.job.workplace_address}</span>
                  )}
                  {invite.job.workplace_country && (
                    <span className="">
                      ({ISO_COUNTRIES[invite.job.workplace_country]})
                    </span>
                  )}
                </div>
                {invite.job.salary && (
                  <div className="flex items-center space-x-1">
                    <BanknotesIcon className="w-4 h-4 flex-none" />
                    <span>{invite.job.salary}</span>
                  </div>
                )}
              </div>
              <button
                className="bg-white py-1.5 px-4 rounded-lg font-bold border border-black hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => {
                  setSelectedInvite(invite);
                  onFullJDOpen();
                  submitInviteResponse(invite, "opened", false);
                }}
              >
                Job Description
              </button>
              {updating && (
                <div className="flex justify-center">
                  <CircularProgress isIndeterminate size="24px" color="black" />
                </div>
              )}
              <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-center md:items-center md:text-center md:space-x-8">
                <button
                  disabled={updating}
                  onClick={async () => {
                    await submitInviteResponse(invite, "accepted");
                  }}
                  className="flex items-center space-x-1"
                >
                  <span className="font-medium">Accept invite</span>
                  <CheckIcon className="w-4 h-4 text-green-600" />
                </button>
                <button
                  disabled={updating}
                  onClick={async () => {
                    await submitInviteResponse(invite, "temp_rejected");
                  }}
                  className="flex items-center space-x-1"
                >
                  <span className="font-medium">Maybe later</span>
                  <HandRaisedIcon className="w-4 h-4" />
                </button>
                <button
                  disabled={updating}
                  onClick={async () => {
                    await submitInviteResponse(invite, "rejected");
                  }}
                  className="flex items-center space-x-1"
                >
                  <span className="font-medium">Reject anonymously</span>
                  <HandThumbDownIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isFullJDOpen} onClose={onFullJDClose} size={"full"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {selectedInvite && (
              <div className="flex justify-center mt-16 mb-8">
                <div className="flex flex-col flex-auto max-w-2xl items-center">
                  <div className="flex flex-col items-center text-center mb-8 mr-4 text-base">
                    <span className="font-bold text-xl">
                      {selectedInvite.job.title}
                    </span>
                    <span className="font-light text-lg mt-2">
                      @ {selectedInvite.company.title}
                    </span>
                  </div>
                  <article className="prose prose-h1:text-2xl mt-4 p-4 w-full">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: xss(
                          he.decode(
                            selectedInvite.job.full_job_description || ""
                          )
                        ),
                      }}
                    />
                  </article>
                  <div className="sticky bottom-0 pb-4 flex items-center justify-center text-center">
                    <button
                      className="bg-white mt-4 py-2 px-8 rounded-lg font-bold border border-black shadow-2xl"
                      onClick={() => {
                        onFullJDClose();
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <XMarkIcon className="h-5 w-5 flex-none" />
                        <span>Close</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InboxSeekers;
