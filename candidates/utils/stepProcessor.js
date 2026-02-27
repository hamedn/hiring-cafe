import {
    doc,
    getDoc,
} from "firebase/firestore";
import { clientFirestore } from "@/admin/lib/firebaseClient";
// input: applicant_info (Public Info from candidate dashboard)
// output: stage index, any necessary data
/*
    {
        index: N
        data: data...
    }
*/
// Step 1: VideoAsk Component
// Step 2: Resume Tokens Component
// Step 3: Dashboard Component, Interview Availability for custom_step, Messaging, etc
// Step 4: Screens List
// Step 5: Completed!

// check 1, then 5, then 4, then 3, then 2. 2 Will display by default.

export default async function stepProcessor(applicant_info) {
    // first check if their video screen has been submitted.

    if (applicant_info.stage === "Submitted") {
        // if the job is unlisted but they aren't in pipeline. Don't let them proceed.
        if (applicant_info.job_status === "unlisted") {
            return {
                index: 5,
                data: {
                    rejection_message: "We are no longer accepting applications at the moment.",
                },
            };
        }
        const screenDocRef = doc(clientFirestore, "applicant_screens", applicant_info.initial_screen);
        const screenDocSnap = await getDoc(screenDocRef);
        const screenDocData = screenDocSnap.data();
        return {
            index: 1,
            data: screenDocData
        };
    }

    const step5Stages = [
        "Hired",
        "Rejected",
        "Withdrawn",
        "PreSubmitted",
    ];
    if (step5Stages.includes(applicant_info.stage)) {
        const data = {
            stageName: applicant_info.stage,
        };
        if (applicant_info.stage === "Rejected") {
            data.rejection_message = applicant_info.rejection_message || "Thank you for your interest. Unfortunately, we decided to move forward with other applications. We encourage you to check back for future opportunities.";
            data.rejection_date = applicant_info.rejection_date || null;
        } else if (applicant_info.stage === "Withdrawn") {
            data.rejection_message = "Your application was withdrawn.";
        }
        return {
            index: 5,
            data: data,
        };
    }

    if (applicant_info.incomplete_screens) {
        return {
            index: 4,
            data: null,
        };
    }

    return {
        index: 3,
        data: {},
    };
    /*
        if (!applicant_info.availability || applicant_info.availability.length < 1) {
            return {
                index: 3,
                data: { hideMessaging: true },
            };
        }
    
        for (let i = 0; i < applicant_info.stages.length; i++) {
            if (applicant_info.stage === applicant_info.stages[i]) {
                return {
                    index: 3,
                    data: {},
                };
            }
        }
    
        // Display step 2 by default
        return {
            index: 2,
            data: {},
        };
    */
}
