import useBrowseJobsSelectedCompany from "@/hooks/useBrowseJobsSelectedCompany";

export default function SelectedCompanyBioV4() {
  const { company: selectedCompany } = useBrowseJobsSelectedCompany();

  if (!selectedCompany) {
    return null;
  }

  return (
    <div className="flex justify-center items-center flex-col px-4 md:px-8 xl:px-16">
      <span className="text-2xl font-extrabold">
        Jobs at{" "}
        <button
          onClick={() => {
            if (selectedCompany.website !== null)
              window.open(`//${selectedCompany.website}`, "_blank");
          }}
          disabled={selectedCompany.website === null}
          className={`font-bold ${
            selectedCompany.website && "text-purple-500"
          }`}
        >
          {selectedCompany.name}
        </button>
      </span>
    </div>
  );
}
