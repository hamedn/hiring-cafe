import axios from "axios";
import { db } from "@/admin/lib/firebaseAdmin";

export const sendGenericApplyNotifToApplicant = async ({
  boardName,
  jobTitle,
  candidateName,
  candidateEmail,
}) => {
  const subject = `Thank you for applying to ${boardName}`;
  const body = JSON.stringify({
    message: {
      providers: {
        sendgrid: {
          override: {
            body: {
              from: {
                name: boardName,
                email: "hi@hiring.cafe",
              },
            },
          },
        },
      },
      template: "2VFTDPR0BT4ZZ7PHKM2KV3HBFAWH",
      to: {
        data: {
          subject: subject,
          candidate_name: candidateName,
          job_title: jobTitle,
          board_name: boardName,
        },
        email: candidateEmail,
      },
    },
  });
  // if (applicant.profile.phone) body.phone_number = applicant.profile.phone;
  try {
    await axios.post("https://api.courier.com/send", body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.COURIER_API_KEY}`,
      },
    });
  } catch (error) {
    // Error monitoring handled by Courier.
    console.log(error);
    const errorRef = db.collection("error_logs").doc();
    try {
      await errorRef.set({
        message: error.message,
        timestamp: new Date(),
      });
    } catch (error2) {
      //donothing
    }
  }
};
