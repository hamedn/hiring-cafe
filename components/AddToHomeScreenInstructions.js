import { Picture } from "@/utils/picture";

const AddToHomeScreenInstructions = () => {
  return (
    <div className="flex justify-center bg-slate-200">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-full p-8">
          <div className="flex items-center justify-center rounded-3xl bg-white h-28 w-28">
            <Picture
              src="/static/icons/icon-192x192.png"
              properties={"w-20 h-20 object-contain"}
            />
          </div>
          <div className="flex flex-col items-center text-center mt-8">
            <span className="text-xl font-medium">HiringCafe</span>
            <span className="font-medium mt-2 text-gray-600">
              Get the app in 5 seconds. No download required.
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center w-full p-8 bg-slate-600 text-white">
          <Picture
            src="/static/images/share-btn.png"
            properties={"w-full h-20 object-contain"}
          />
          <span className="mt-4 text-xl mb-16">
            1. Tap the share button on the bottom of the screen
          </span>
          <Picture
            src="/static/images/add-to-home-screen-btn.png"
            properties={"w-full h-44 object-contain"}
          />
          <span className="mt-4 text-xl">
            {`2. Tap the "Add to Home Screen" button`}
          </span>
          <span className="mt-4 text-xl">
            {`3. Tap the "Add" button in the top right corner`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddToHomeScreenInstructions;
