import axios from "axios";
/*
    boardname: displayed as sender.
    subject
    message: fully custom
    cta: link button's message
    hotlink: custom link if necessary. Link to admin landing page by default
    adminEmail:
*/
export const sendAdminNotif = async ({
    boardName,
    subject,
    message,
    cta,
    hotlink = "https://hiring.cafe/admin",
    adminEmail,
}) => {
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
            template: "MG5A3E6YV54HE6P6WJHJV0RFPREV",
            to: {
                data: {
                    subject,
                    message,
                    company: boardName,
                    magic_link: hotlink,
                    cta: cta,
                },
                email: adminEmail,
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
        throw error;
    }
};
