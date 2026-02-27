import { clientFirestore } from "@/admin/lib/firebaseClient";
import { addDoc, collection } from "firebase/firestore";

export const dumpErrorMessage = async (error, additionalNotes = "") => {
  try {
    let docToCreate = collection(clientFirestore, "error_logs");
    await addDoc(docToCreate, {
      message: error.toString(),
      timestamp: new Date(),
      additional_notes: additionalNotes,
      response_details: error.response || "",
      trace: error.trace || "", 
    });
  } catch (error2) {
    console.log(error2);
  }
};
