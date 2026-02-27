import axios from "axios";

export const shareCandidate = async ({
  candidateName,
  recruiterName,
  access_token,
  shareTargetEmail,
}) => {
  const magicLink = `https://hiring.cafe/share/${access_token}`;

  const body = JSON.stringify({
    message: {
      providers: {
        sendgrid: {
          override: {
            body: {
              from: {
                name: "Hiring Cafe",
                email: "hi@hiring.cafe",
              },
            },
          },
        },
      },
      template: "6WZFC1SCVW4C2DQFE88VZABAX8VX",
      to: {
        data: {
          candidateName: candidateName,
          recruiterName: recruiterName,
          magic_link: magicLink,
        },
        email: shareTargetEmail,
      },
    },
  });
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
  }
};
