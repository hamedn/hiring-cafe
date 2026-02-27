import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { clientFirestore } from "@/lib/firebaseClient";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { ISO_COUNTRIES } from "@/utils/backend/countries";

export default function AddExternalJob({ defaultStage = "saved", onComplete }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("US");
  const [jobUrl, setJobUrl] = useState("");
  const [stage, setStage] = useState(defaultStage);
  const [location, setLocation] = useState("");

  if (loading) return null;

  const validateJob = () => {
    if (!jobTitle || !jobTitle.length) return false;
    if (!companyName || !companyName.length) return false;
    if (!jobUrl || !jobUrl.length) return false;
    if (!location || !location.length) return false;
    return true;
  };

  // hideJob = true if report, false if apply button.
  const saveJob = (redirectIfSignedOut = true) => {
    if (user) {
      let url = jobUrl;
      // Add 'https' if not present
      if (!jobUrl.startsWith("http")) {
        url = `https://${jobUrl}`;
      }

      const ref = collection(clientFirestore, "savedJobs");
      const docRef = doc(ref);
      const jobToSave = {
        job_title: jobTitle,
        applyUrl: url,
        companyInfo: { name: companyName },
        country: country,
        dateFetched: Timestamp.now(),
        isSalaryAvailable: false,
        job_location: ISO_COUNTRIES[country],
        source: "import",
        objectID: null,
        isHidden: false,
        owner: user.uid,
        dateSaved: Timestamp.now(),
        stage: stage,
      };
      setDoc(docRef, jobToSave, { merge: true });
      onComplete();
    } else if (redirectIfSignedOut) {
      router.push({
        pathname: "/auth",
        query: { redirect: router.asPath },
      });
    }
  };

  return (
    <div className="m-2">
      <div className="text-lg font-bold">Add an External Job</div>
      <div className="text-xs mt-1 mb-4">
        {
          "Add a job that isn't listed on our site to your list. All fields are required."
        }
      </div>
      <div className="mt-2 mb-1 text-sm font-bold text-gray-500">
        Job Url <span className="text-xs text-red-500">*</span>
      </div>
      <input
        type="text"
        placeholder="https://www.example.com/job/1234"
        onChange={(e) => setJobUrl(e.target.value)}
        className="border border-1 p-1 w-full rounded"
      />
      <div className="mt-4 mb-1 text-sm font-bold text-gray-500">
        Job Title <span className="text-xs text-red-500">*</span>
      </div>
      <input
        type="text"
        placeholder="Software Engineer"
        onChange={(e) => setJobTitle(e.target.value)}
        className="border border-1 p-1 w-full rounded"
      />
      <div className="mt-4 mb-1 text-sm font-bold text-gray-500">
        Company <span className="text-xs text-red-500">*</span>
      </div>
      <input
        type="text"
        placeholder="Google"
        onChange={(e) => setCompanyName(e.target.value)}
        className="border border-1 p-1 w-full rounded"
      />
      <div className="mt-4 mb-1 text-sm font-bold text-gray-500">
        Job Location <span className="text-xs text-red-500">*</span>
      </div>
      <input
        type="text"
        placeholder="Mountain View, CA"
        onChange={(e) => setLocation(e.target.value)}
        className="border border-1 p-1 w-full rounded"
      />
      <div className="mt-4 mb-1 text-sm font-bold text-gray-500">
        Country <span className="text-xs text-red-500">*</span>
      </div>
      <select
        className="border p-1 rounded outline-none w-full"
        value={country}
        onChange={(e) => {
          setCountry(e.target.value);
        }}
      >
        {Object.keys(ISO_COUNTRIES).map((c) => (
          <option key={c} value={c}>
            {ISO_COUNTRIES[c]}
          </option>
        ))}
      </select>
      <button
        disabled={!validateJob()}
        className={`px-4 py-2 mt-4 rounded font-semibold ${
          validateJob() ? "bg-black text-white" : "bg-gray-200"
        }`}
        onClick={() => saveJob()}
      >
        Save Job
      </button>
    </div>
  );
}
