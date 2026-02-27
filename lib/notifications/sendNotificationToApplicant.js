import { Timestamp } from "@/lib/firebaseAdmin";
import axios from "axios";
import { nanoid } from "nanoid";
import { db } from "@/admin/lib/firebaseAdmin";

export const sendCandidateNotif = async ({
  boardName,
  subject,
  message,
  cta,
  applicantRef,
  noExpiry = false,
}) => {
  let applicant = (await applicantRef.get()).data();

  // Check expiry
  if (
    !applicant.candidate_token ||
    applicant.candidate_token.expires.toDate() < new Date()
  ) {
    // Create new token
    const token = nanoid();
    const expires = noExpiry ? Timestamp.fromMillis(Date.now() + (365 * 24 * 60 * 60 * 1000)) : // expires in 1 year
      Timestamp.fromDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 1));  // expires in 1 Day
    await applicantRef.update({ candidate_token: { token, expires } });
    applicant = (await applicantRef.get()).data();
  }

  const magicLink = `https://hiring.cafe/applicant/${applicant.candidate_token.token}`;
  let emailTarget = applicant.profile.contact_email || applicant.profile.email;
  const withdrawLink = `${magicLink}#withdraw`;

  const bodyPrep = {
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
      template: "NH92TXB0H544Z7MKF0VVEWW8EAQA",
      to: {
        data: {
          subject,
          message,
          company: boardName,
          magic_link: magicLink,
          cta: cta,
          withdraw_link: withdrawLink,
        },
        email: emailTarget,
      },
    },
  };

  if (applicant.profile.phone) bodyPrep.message.to.phone_number = applicant.profile.phone;
  const body = JSON.stringify(bodyPrep);

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
