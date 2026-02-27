import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/admin/hooks/useAuth";
import axios from "axios";
import { clientFirestore } from "@/admin/lib/firebaseClient";

const ScreenList = () => {
  const [screens, setScreens] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    if (!userData) return;
    const q = query(
      collection(clientFirestore, "screens"),
      where("board", "==", userData.board, "type", "==", "video")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let screensData = [];
      querySnapshot.forEach((doc) => {
        screensData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setScreens(screensData);
    });

    return () => unsubscribe();
  }, [userData]);

  const handleCreateNewForm = async () => {
    try {
      const res = await axios.post(`/api/admin/videoScreen/createForm`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Screen List</h1>
      {screens.map((screen, index) => (
        <div key={index}>
          <button
            onClick={() => {
              // handle select screen
            }}
          >
            {screen.title} - {screen.id}
          </button>
        </div>
      ))}
      <button onClick={handleCreateNewForm}>Create new form</button>
    </>
  );
};

export default ScreenList;
