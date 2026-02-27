import React, { useEffect, useState } from "react";
import Head from "next/head";
import useBoard from "@/admin/hooks/useBoard";
import { useAuth } from "@/admin/hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { clientFirestore } from "@/admin/lib/firebaseClient";

const EditCompanyProfile = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const maxDescriptionLength = 120;
  const { userData } = useAuth();
  const { board } = useBoard({ board_id: userData?.board });

  useEffect(() => {
    if (!board) return;
    setTitle(board.title || "");
    setDescription(board.description || "");
  }, [board]);

  if (!userData || !board) return null;

  return (
    <>
      <Head>
        <title>Company Profile - Hiring cafe</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex flex-col items-center text-lg max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl font-medium">{`Your Board Information`}</span>
          </div>
          <div className="mt-16 w-full">
            <div className="flex flex-col">
              <label className="block text-sm font-bold mb-2" htmlFor="title">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-4"
                id="title"
                type="text"
                placeholder="Your board name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (title) {
                    setDoc(
                      doc(clientFirestore, "boards", userData.board),
                      {
                        title: title,
                      },
                      { merge: true }
                    );
                  }
                }}
              />
              <label
                className="block text-sm font-bold mb-2 mt-4"
                htmlFor="description"
              >
                Tagline
              </label>
              <div className="relative flex flex-col items-end shadow border rounded py-2 px-3">
                <textarea
                  className="resize-none h-32 appearance-none w-full leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="We're building a cloud-based sustainability enterprise software that exhaustively measures emissions in real-time."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => {
                    if (description) {
                      setDoc(
                        doc(clientFirestore, "boards", userData.board),
                        {
                          description: description,
                        },
                        { merge: true }
                      );
                    }
                  }}
                />
                <span
                  className={`absolute bottom-0 right-0 text-xs mt-2 mr-1 mb-1 font-bold text-gray-500 ${
                    description.length > maxDescriptionLength
                      ? "text-red-500"
                      : ""
                  } z-10 pointer-events-none`}
                >
                  {description.length}/{maxDescriptionLength}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCompanyProfile;
