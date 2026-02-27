import { collection, where, query, getCountFromServer } from "firebase/firestore";
import { clientFirestore } from "@/admin/lib/firebaseClient";

export const CheckIfBoardPublicIdAvailable = async (public_id, board_id) => {
  const q = query(
    collection(clientFirestore, "boards"),
    where("public_board_id", "==", public_id),
    where("id", "!=", board_id)
  );
  const snapshot = await getCountFromServer(q);
  if (snapshot.data().count > 0) return false;
  return true;
};