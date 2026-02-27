import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { clientAuth, clientFirestore } from "@/lib/firebaseClient";
import { useToast } from "@chakra-ui/react";
import { FaLink, FaRegIdBadge } from "react-icons/fa";
import { signOut, updateEmail } from "firebase/auth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import ThemeToggle from "./ThemeToggle";

export default function Account() {
  const { user, loading: loadingUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setLink(userData.link || "");
      setImageURL(userData.img_url || "");
    } else {
      setName("");
      setLink("");
      setImageURL("");
    }
  }, [userData]);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(clientFirestore, `users/${user.uid}`), (doc) => {
      setUserData(doc.data());
    });
  }, [user]);

  const handleBlur = (field, value) => {
    if (
      !userData ||
      !userData.hasOwnProperty(field) ||
      userData[field] !== value
    ) {
      updateField(field, value);
    }
  };

  const updateField = async (field, value) => {
    if (user) {
      const userRef = doc(clientFirestore, `users/${user.uid}`);
      setDoc(userRef, { [field]: value }, { merge: true });
      showToast(field);
    }
  };

  const showToast = (field) => {
    const fieldString = field.replace("_", " ");
    toast({
      title: "Success",
      description: `${
        fieldString.charAt(0).toUpperCase() + fieldString.slice(1)
      } updated successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  if (loadingUser) return <span>Loading...</span>;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col flex-auto sm:max-w-lg">
        <div className="flex flex-col items-center space-y-8 p-4 h-full">
          {user.email && (
            <div className="flex items-center space-x-2">
              <span>{user.email}</span>
              <button
                onClick={() => {
                  // Prompt for updated email
                  const newEmail = prompt(
                    "Enter your new email address",
                    user.email
                  );
                  if (newEmail) {
                    updateEmail(clientAuth.currentUser, newEmail)
                      .then(() => {
                        showToast("email");
                        signOut(clientAuth).then(() => {
                          router.reload();
                        });
                      })
                      .catch((error) => {
                        toast({
                          title: "Error",
                          description:
                            error.code === "auth/requires-recent-login"
                              ? `Whoops! Please re-login to your ${user.email} account and try again.`
                              : error.code === "auth/email-already-in-use"
                              ? `The email address ${newEmail} is already in use.`
                              : "An error occurred.",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                      });
                  }
                }}
                className="text-red-600 text-sm"
              >
                (edit)
              </button>
            </div>
          )}
          <div className="space-y-4 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaRegIdBadge className="text-blue-600 h-5 w-5" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                className="block w-full mt-1 px-4 py-2 pl-10 bg-white border border-gray-300 rounded-md text-gray-900 shadow-sm focus:border-yellow-600 focus:outline-none"
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => {
                  handleBlur("name", e.target.value);
                }}
                placeholder="Enter your name..."
              />
            </div>
          </div>
          <div className="space-y-4 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLink className="text-blue-600 h-5 w-5" />
              </div>
              <input
                id="link"
                type="text"
                value={link}
                className="block w-full mt-1 px-4 py-2 pl-10 bg-white border border-gray-300 rounded-md text-gray-900 shadow-sm focus:border-yellow-600 focus:outline-none"
                onChange={(e) => setLink(e.target.value)}
                onBlur={(e) => {
                  handleBlur("link", e.target.value);
                }}
                placeholder="LinkedIn, GitHub, or personal website URL"
              />
            </div>
          </div>
          {/* <div className="space-y-4 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLink className="text-blue-600 h-5 w-5" />
              </div>
              <input
                id="img_url"
                type="text"
                value={imageURL}
                className="block w-full mt-1 px-4 py-2 pl-10 bg-white border border-gray-300 rounded-md text-gray-900 shadow-sm focus:border-yellow-600 focus:outline-none"
                onChange={(e) => setImageURL(e.target.value)}
                onBlur={(e) => {
                  handleBlur("img_url", e.target.value);
                }}
                placeholder="Image URL"
              />
            </div>
          </div> */}
          <button
            onClick={() => {
              signOut(clientAuth);
              router.reload();
            }}
            className="flex items-center text-start space-x-2 text-red-600"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
