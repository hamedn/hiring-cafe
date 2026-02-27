import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { PlayIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer({
  videos_id,
  videoSrcs = [],
  showControls,
  onVideoChange,
  isMuted,
  autoplay = false,
  loop = false,
}) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    if (onVideoChange) {
      onVideoChange(currentVideo);
    }
  }, [currentVideo, onVideoChange]);

  useEffect(() => {
    setCurrentVideo(0);
  }, [videos_id]);

  const nextVideo = () => {
    setCurrentVideo((prevVideo) => prevVideo + 1);
  };

  const prevVideo = () => {
    setCurrentVideo((prevVideo) => prevVideo - 1);
  };

  return (
    <div
      className={`rounded-xl relative overflow-hidden border`}
      style={{
        paddingTop: "56.25%",
      }}
    >
      <ReactPlayer
        ref={playerRef}
        url={videoSrcs[currentVideo]}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          borderRadius: "0.8rem 0.8rem 0 0",
          objectFit: "cover",
        }}
        playing={isPlaying}
        onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        onDuration={setDuration}
        playbackRate={playbackRate}
        muted={isMuted || false}
        loop={loop}
        pip
        controls={false}
        config={{
          file: {
            attributes: {
              playsInline: true,
            },
          },
        }}
      />
      <button
        className={`absolute top-0 left-0 w-full h-full`}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {showControls && !isPlaying && (
          <PlayIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-gray-300 transition-all duration-200 hover:scale-110" />
        )}
      </button>
      <button
        className={`absolute top-6 right-12 rounded py-0.5 text-xs font-bold w-8 h-6 text-center
       ${
         playbackRate !== 1
           ? "bg-white border border-gray text-black"
           : "bg-gray-600 text-white border-white border-2"
       }
       transition-all duration-200 scale-100 hover:scale-110 ${
         showControls ? "opacity-100" : "opacity-0"
       }`}
        onClick={() => {
          const newPlaybackRate =
            playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
          setPlaybackRate(newPlaybackRate);
        }}
      >
        {playbackRate}x
      </button>
      <button
        className={`absolute top-6 right-2 border-2 border-white rounded py-0.5 text-xs font-bold w-8 h-6 text-center bg-gray-600 text-white transition-all duration-200 scale-100 hover:scale-110 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={() =>
          playerRef.current.getInternalPlayer().requestPictureInPicture()
        }
      >
        <Square2StackIcon className="h-full w-full" />
      </button>
      <div
        className={`absolute -top-2 left-0 w-full ${
          showControls ? "opacity-100" : "opacity-0"
        } transition-all duration-200`}
      >
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            const newTime = Number(e.target.value);
            setCurrentTime(newTime);
            if (playerRef.current && playerRef.current.seekTo) {
              playerRef.current.seekTo(newTime);
            }
          }}
          className="w-full accent-white"
        />
      </div>
      {currentVideo > 0 && (
        <div className={`absolute left-6 top-1/2`}>
          <button onClick={prevVideo}>
            <ChevronLeftIcon
              className={`h-10 w-10 bg-black text-white opacity-70 rounded-full p-1.5 ${
                showControls ? "opacity-100" : "opacity-0"
              } transition-all duration-200 hover:scale-110
              `}
            />
          </button>
        </div>
      )}
      {videoSrcs.length > 1 && (
        <div
          className={`flex absolute bottom-4 inset-x-0 justify-center space-x-2 ${
            showControls ? "opacity-100" : "opacity-0"
          } transition-all duration-200`}
        >
          {videoSrcs.map((src, index) => (
            <div
              key={src}
              className={`h-1.5 w-1.5 bg-white rounded-full ${
                currentVideo !== index && "opacity-20"
              }`}
            />
          ))}
        </div>
      )}
      {currentVideo < videoSrcs.length - 1 && (
        <div className="absolute right-6 top-1/2">
          <button onClick={nextVideo}>
            <ChevronRightIcon
              className={`h-10 w-10 bg-black text-white opacity-70 rounded-full p-1.5 ${
                showControls ? "opacity-100" : "opacity-0"
              } transition-all duration-200 hover:scale-110
              `}
            />
          </button>
        </div>
      )}
    </div>
  );
}
