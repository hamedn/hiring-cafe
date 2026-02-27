export default function SearchTips() {
  return (
    <div className="flex flex-col space-y-4 text-xs">
      <div className="flex flex-col space-y-2">
        <span className="font-bold">How Search Works</span>
        <span className="flex flex-col space-y-4 font-medium text-gray-600">
          {`You can search by Job Title, Requirements, and / or Tech. Results are sorted in that order, and sorted by date (most recent listing first).`}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-bold">Combining Job Title with Keywords</span>
        <span className="flex flex-col space-y-4 font-medium text-gray-600">
          {`You can combine the job title with keywords from requirements / tech. Ex: "Product Designer Figma".`}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-bold">Exact Keywords</span>
        <span className="flex flex-col space-y-4 font-medium text-gray-600">
          {`You can search for exact keywords by wrapping double quotes ("") around keywords. Ex: "HRIS" (with double quotes) will search for jobs with the exact phrase "HRIS".`}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-bold">Exclude Keywords</span>
        <span className="flex flex-col space-y-4 font-medium text-gray-600">
          {`You can exclude keywords by adding a dash (-) before the keyword. Ex: "Engineering Manager -Civil" will search for any engineering manager jobs but exclude Civil Engineering jobs.`}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-bold">Advanced Example</span>
        <span className="flex flex-col space-y-4 font-medium text-gray-600">
          {`Suppose you're looking for a Software Engineering job and are only interested in jobs that use React, but not React Native. Simply type:`}
          <span className=" block font-bold">
            {`Software Engineer "React" -Native`}
          </span>
        </span>
      </div>
    </div>
  );
}
