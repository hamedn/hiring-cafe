import VideoPlayer from "@/admin/components/adminDashboard/candidateProfiles/VideoPlayer";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserProfile = ({ user }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { videos, user_url, profile } = user;

  useEffect(() => {
    setCurrentIndex(0);
  }, [user]);

  return (
    <div className="flex flex-col space-y-2">
      <VideoPlayer
        videos_id={user_url}
        showControls={true}
        onVideoChange={(i) => {
          setCurrentIndex(i);
        }}
        videoSrcs={videos.map((video) => video.url)}
      />
      <div className="flex justify-center text-center items-center">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-medium">
            {videos?.[currentIndex]?.title || ""}
          </span>
          <div className="flex flex-col items-center mt-4">
            <div className="flex items-center divide-x">
              {profile.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline px-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
