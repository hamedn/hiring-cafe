export default function Resume({ applicant }) {
  if (!applicant) return null;

  return (
    <div className="w-full">
      <iframe
        className="rounded w-full h-[600px]"
        id={applicant.resume}
        src={
          applicant.resume_is_pdf
            ? applicant.resume
            : `https://view.officeapps.live.com/op/embed.aspx?src=${applicant.resume}`
        }
        height="100%"
        width="100%"
      />
    </div>
  );
}
