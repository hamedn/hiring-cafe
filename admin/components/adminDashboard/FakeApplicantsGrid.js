import FakeQuickCandidateSummaryCard from "./candidateProfiles/FakeQuickCandidateSummaryCard";
import { useEffect, useState } from "react";

export default function FakeFakeApplicantsGrid() {
  const [fakeApplicants, setFakeApplicants] = useState([]);

  // Set fake applicants
  useEffect(() => {
    setFakeApplicants([
      {
        name: "Lisa Smith",
        email: "lisa_smith@yaho.com",
        videos: [
          "",
        ],
        sub: "Boston",
      },
      {
        name: "George Castle",
        email: "george_castle@gmal.com",
        videos: [
          "",
        ],
        sub: "California",
      },
      {
        name: "Sarah Williams",
        email: "sarah.w@gmal.com",
        videos: [
          "",
        ],
        sub: "New York",
      },
      {
        name: "Scott Miller",
        email: "scott_miller@outlok.com",
        videos: [
          "",
        ],
        sub: "Florida",
      },
      {
        name: "Ali Mir",
        email: "ali@hiring.cafe",
        videos: [
          "",
        ],
        sub: "California",
      },
      {
        name: "Emma Tompson",
        email: "emma_t@gmal.com",
        videos: [
          "",
        ],
        sub: "Colorado",
      },
      {
        name: "Henry Anderson",
        email: "henryanderson@gmal.com",
        videos: [
          "",
        ],
        sub: "Michigan",
      },
      {
        name: "Jennifer Gonzalez",
        email: "jennyh@gmal.com",
        videos: [
          "",
        ],
        sub: "Texas",
      },
      {
        name: "Robert Wilson",
        email: "robertwilson@gmal.com",
        videos: [
          "",
        ],
        sub: "California",
      },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 px-4 md:px-16 w-full">
      {fakeApplicants.map((applicant, inx) => (
        <div
          key={inx}
          className={`w-full ${
            inx > 2 ? "hidden md:flex md:justify-center" : "flex justify-center"
          }`}
        >
          <FakeQuickCandidateSummaryCard
            videos={applicant.videos}
            name={applicant.name}
            email={applicant.email}
            sub={applicant.sub}
          />
        </div>
      ))}
    </div>
  );
}
