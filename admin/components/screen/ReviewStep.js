import useScreenData from "@/admin/hooks/useScreenData";
import Script from "next/script";
import useJob from "@/admin/hooks/useJob";

const ReviewStep = ({ screenID, job_id }) => {
  const { screen } = useScreenData(screenID);
  const { job, loading } = useJob({job_id: job_id})

  if (!screen) return null;
  if (loading) return null;

  return (
    <>
      <Script id="s1" src="https://www.videoask.com/embed/embed.js" />
      <div className="flex flex-col items-start">
        <div className="flex flex-col items-center justify-center w-full h-96 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between w-full h-8 px-2 bg-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between w-12 h-full space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col w-full h-full space-y-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex w-full mt-4 border-b">
                  <span className="font-bold ml-4 mb-4">
                    {job?.board?.title || "Acme"}
                  </span>
                </div>
              </div>
              <div className="flex flex-auto justify-center">
                <div className="flex flex-col text-sm mt-8 mx-4 w-96">
                  <span className="">{`Hello Lisa,`}</span>
                  <span className="">{`Thank you for applying for the ${
                    job?.job_info?.title || "Sales"
                  } role at our company. We'd love to learn more about you and your background. Please follow the link below to complete the initial steps.`}</span>
                  {screen.videoask_share_url && (
                    <div className="flex justify-center mt-8">
                      <button
                        className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-6 rounded"
                        onClick={() => {
                          window.videoask.loadModal({
                            url: `${screen.videoask_share_url}?preview`,
                            options: { modalType: "Fullscreen" },
                          });
                        }}
                      >
                        {`Next steps`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewStep;
