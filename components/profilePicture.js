import React, { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AiOutlineEdit } from "react-icons/ai";
import { Picture } from "@/utils/picture";
import { clientFirestore, clientStorage } from "@/lib/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { UserCircleIcon } from "@heroicons/react/20/solid";

export default function ProfilePicture({ src, properties }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);

      const storageRef = ref(
        clientStorage,
        `users/profilePictures/${user.uid}/images/${nanoid()}`
      );

      try {
        const fileRef = await uploadBytes(storageRef, file);

        const fileURL = await getDownloadURL(fileRef.ref);

        await setDoc(
          doc(clientFirestore, `users/${user.uid}`),
          {
            profilePicture: fileURL,
          },
          { merge: true }
        );
      } catch (e) {
        console.log(e);
        toast({
          title: "Error uploading image",
          description: "Please try again later",
          status: "error",
          isClosable: true,
        });
      }

      setLoading(false);
    }
  };

  return (
    <div
      className={`relative ${properties}`}
      onClick={() => {
        !loading && fileInputRef.current.click();
      }}
    >
      {loading ? (
        <div className="flex h-full justify-center items-center">
          <CircularProgress isIndeterminate />
        </div>
      ) : src ? (
        <Picture src={src} properties={properties} alt="Profile" />
      ) : (
        <UserCircleIcon className="text-gray-500 h-full w-full" />
      )}
      <div className="absolute top-0 right-0 bg-gray-600 bg-opacity-50 rounded-full p-1">
        <AiOutlineEdit className="text-white" />
      </div>
      {!loading && (
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleUpload}
        />
      )}
    </div>
  );
}
