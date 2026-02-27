import Link from "next/link";

export default function ScreenList({
  applicant_info
}) {
  const screens = applicant_info.screens;

  /* const nextWeek = new Date();
  // add 7 days to the current date
  nextWeek.setDate(new Date().getDate() + 7);
  const dateString = nextWeek.toLocaleDateString();
  const tempScreens = [
    {
      type: "video",
      deadline_readable: dateString,
      status: "requested",
      id: "id1",
    },
    {
      type: "video",
      deadline_readable: dateString,
      status: "started",
      id: "id2",
    },
    {
      type: "video",
      deadline_readable: dateString,
      status: "complete",
      id: "id3",
    },
  ]; */

  return (
    <div className="flex flex-col border rounded-xl divide-y mt-4">
      <div className="m-2 font-bold text-lg">Screens: </div>
      <div className="flex divide-x items-center font-medium bg-gray-100">
        <span className="p-4 w-1/4 text-center">Type</span>
        <span className="p-4 w-1/4 text-center">Deadline</span>
        <span className="p-4 w-1/4 text-center">Status</span>
        <span className="p-4 w-1/4 text-center">Actions</span>
      </div>
      {
        screens.map((screen, index) =>
          <div key={index} className={`flex divide-x items-center border border-1 ${index % 2 && "bg-gray-100"}`}>
            <span className="p-1 w-1/4 text-center">
              {screen.type}
            </span>
            <span className="p-1 w-1/4 text-center">
              {screen.deadline_readable}
            </span>
            <span className="p-1 w-1/4 text-center">
              {screen.status}
            </span>
            <span className="p-1 w-1/4 text-center">
              {screen.status === "requested" &&
                <Link
                  href={`/applicant/${applicant_info.candidate_token.token}/${screen.id}`}
                >
                  <button
                    className="p-1 mx-2 bg-green-500 text-white rounded"
                  >
                    {`Start ->`}
                  </button>
                </Link>
              }
              {screen.status === "started" &&
                <Link
                  href={`/applicant/${applicant_info.candidate_token.token}/${screen.id}`}
                >
                  <button
                    className="p-1 mx-2 bg-green-500 text-white rounded"
                  >
                    {`View ->`}
                  </button>
                </Link>
              }
            </span>
          </div>
        )
      }
    </div>
  )
}