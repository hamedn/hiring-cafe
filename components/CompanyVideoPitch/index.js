import { useState } from "react";
import UserProfile from "./UserProfile";

const CompanyVideoPitch = ({ companyPitchVideoData }) => {
  const [selectedUser, setSelectedUser] = useState(
    companyPitchVideoData?.[0] || null
  );

  if (!companyPitchVideoData?.length) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col flex-auto w-full md:max-w-xl p-4 mb-2">
        {selectedUser && <UserProfile user={selectedUser} />}
        <div className="mt-4 flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          {companyPitchVideoData.map((user) => (
            <button
              key={user.user_url}
              className={`flex flex-col flex-none items-center space-y-1 p-4 rounded-md ${
                selectedUser === user
                  ? "border-2 border-black font-medium"
                  : "border"
              }`}
              onClick={() => {
                setSelectedUser(user);
              }}
            >
              <span className="flex-none">{user.profile.name}</span>
              <span className="flex-none text-sm font-light">
                {user.profile.bio}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyVideoPitch;
