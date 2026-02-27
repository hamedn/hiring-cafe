import StageTimeline from "./StageTimeline";
import BasicInfo from "./BasicInfo";
import NextSteps from "./NextSteps";
import Notes from "./Notes";
import InitialScreenAnswers from "./InitialScreenAnswers";
import ParsedResume from "./ParsedResume";
import Head from "next/head";
import useApplicant from "@/admin/hooks/useApplicant";
import SimilarApplicants from "./SimilarApplicants";
import ShareCandidate from "./ShareCandidate";
import Link from "next/link";

export default function CompleteCandidateProfile({ applicantId }) {
  const { applicant } = useApplicant({ applicantId });
  const headTitle = `${applicant?.profile?.name || "Applicant"} - Hiring Cafe`;

  if (!applicantId) return null;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <div className="flex xl:justify-center mx-8 mt-8 mb-32">
        <div className="flex flex-col flex-auto max-w-6xl">
          <Link href="/admin/ats" className="mb-8">
            <span className="underline">Applicant Tracking System</span>
            {` -> ${applicant?.profile?.name || "Applicant"}`}
          </Link>
          <StageTimeline applicantId={applicantId} />
          <div className="mt-8">
            <BasicInfo applicantId={applicantId} />
          </div>
          <div className="grid grid-cols-1 gap-8 my-8 items-start">
            {/* <div> */}
            {/* <InitialScreenAnswers applicantId={applicantId} /> */}
            {/* </div> */}
            <div className="rounded-2xl border pb-4">
              <ParsedResume applicantId={applicantId} />
              <ShareCandidate applicantId={applicantId} />
            </div>
          </div>
          <div className="border-t border-gray-200 mt-16" />
          <div className="grid grid-cols-2 gap-16 mt-16 items-start">
            <Notes applicantId={applicantId} />
            <NextSteps applicantId={applicantId} />
          </div>
          <div className="border-t border-gray-200 mt-16" />
          <div className="mt-16">
            <SimilarApplicants applicantId={applicantId} />
          </div>
        </div>
      </div>
    </>
  );
}
