import useApplicant from "@/admin/hooks/useApplicant";
import { codeToCountry, codeToEmoji } from "@/utils/countryCodes";
import { readableDate } from "@/utils/helpers";

export default function BasicInfo({ applicantId }) {
  const { applicant, loading, error } = useApplicant({ applicantId });

  if (!applicantId) return null;

  if (loading) {
    return (
      <div className="py-8 animate-pulse bg-gray-300 20 w-1/2 rounded-lg" />
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <span className="text-4xl font-medium">{applicant.profile.name}</span>
      <span className="mt-4">
        <span className="underline font-medium mr-2">
          {applicant.profile.email}
        </span>{" "}
        ·
        <span className="mx-2">
          {codeToEmoji[applicant.country_code] || ""}{" "}
          {codeToCountry[applicant.country_code]}
        </span>{" "}
        ·{" "}
        <span className="mx-2">
          {readableDate(applicant.date_applied.toDate())}
        </span>
      </span>
    </div>
  );
}
