import { useAuth } from "@/hooks/useAuth";
import useFetchCommentsForMarketplaceJob from "@/hooks/useFetchCommentsForMarketplaceJob";
import { clientAuth } from "@/lib/firebaseClient";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import Comment from "./Comment";

const createComment = async ({ userToken, jobID, comment }) => {
  try {
    const response = await axios.post("/api/ugc/create-comment", {
      marketplace_job_id: jobID,
      comment_text: comment,
      user_token: userToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default function MarketplaceJobComments({ jobID }) {
  const { comments, getComments, loading } = useFetchCommentsForMarketplaceJob({
    jobID,
  });
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [isCommentEditMode, setIsCommentEditMode] = useState(false);
  const commentRef = useRef(null);
  const [comment, setComment] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const handleEditMode = () => {
    setIsCommentEditMode(true);
    // Ensure input is focused after the component updates
    setTimeout(() => {
      commentRef.current?.focus();
    }, 0);
  };

  const setInitialComment = useCallback(() => {
    if (comments.length) {
      const userComment = comments.find((comment) => comment.isOwner);
      if (userComment) {
        setComment(userComment.commentText);
      }
    }
  }, [comments]);

  useEffect(() => {
    setInitialComment();
  }, [setInitialComment]);

  const handleAddComment = async () => {
    if (user) {
      setIsCommentSubmitting(true);
      try {
        await createComment({
          userToken: await clientAuth.currentUser.getIdToken(),
          jobID,
          comment: comment,
        });
        // Refresh the comments
        await getComments();
        setComment("");
        setIsCommentEditMode(false);
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully",
          status: "success",
          isClosable: true,
        });
      } catch (e) {
        console.trace(e);
        toast({
          title:
            "Please contact support: ali@hiring.cafe and include a screenshot of this error.",
          description: e.response?.data?.error || "Unknown Error",
          status: "error",
          isClosable: true,
        });
      } finally {
        setIsCommentSubmitting(false);
      }
    } else {
      router.push("/auth");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full h-96 overflow-y-auto">
        <div className="flex flex-col p-4 flex-auto">
          <span className="font-medium text-lg md:text-xl">Comments</span>
          <span className="text-gray-400 mt-8">{`Loading comments...`}</span>
        </div>
        <div className="lg:sticky lg:bottom-0 border-t p-4 rounded-b-3xl bg-white">
          <button
            disabled
            className="bg-gray-200 font-medium text-gray-400 p-4 text-start rounded-full w-full"
          >
            <span>Add a comment anonymously</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full h-64 md:h-96 overflow-y-auto">
        <div className="flex flex-col p-4 flex-auto">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-lg md:text-xl">Comments</span>
          </div>
          {!comments.length ? (
            <span className="text-gray-400 mt-4">
              {`No comments yet! Add one to start the conversation. Your identity is always kept hidden.`}
            </span>
          ) : (
            <div className="flex flex-col mt-8 space-y-4">
              {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="lg:sticky lg:bottom-0 border-t p-4 rounded-b-3xl bg-white">
        {isCommentEditMode ? (
          <div className="flex items-center space-x-2 border font-medium text-start rounded-xl w-full px-4">
            <textarea
              type="textfield"
              ref={commentRef}
              placeholder="Add a comment anonymously"
              value={comment}
              onBlur={() => {
                if (!comment.length) {
                  setIsCommentEditMode(false);
                  setInitialComment();
                }
              }}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              className="w-full h-20 my-4 px-2 focus:outline-none resize-none"
            />
            {comment?.length ? (
              isCommentSubmitting ? (
                <CircularProgress
                  isIndeterminate
                  size="24px"
                  color="orange.600"
                />
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddComment();
                  }}
                  className="rounded-full bg-orange-600 hover:bg-orange-700 text-white p-2"
                >
                  <PaperAirplaneIcon className="h-6 w-6" />
                </button>
              )
            ) : null}
          </div>
        ) : (
          <button
            onClick={() => {
              handleEditMode();
            }}
            className="bg-gray-200 hover:bg-gray-300 font-medium text-gray-400 p-4 text-start rounded-full w-full"
          >
            Add a comment anonymously
          </button>
        )}
      </div>
    </>
  );
}
