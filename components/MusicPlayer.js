import { useState, useRef, useCallback, useEffect } from "react";

// Each genre has an array of long-duration YouTube video IDs (focus/study music)
const PLAYLISTS = [
  {
    label: "Lo-fi Beats",
    // Popular lofi study/chill videos (1-10+ hours each)
    videos: ["jfKfPfyJRdk", "rUxyKA_-grg", "4xDzrJKXOOY"],
  },
  {
    label: "Jazz",
    // Smooth jazz / cafe jazz instrumental videos
    videos: ["neV3EPgvZ3g", "Dx5qFachd3A", "fEvM-OUbaKs"],
  },
  {
    label: "Focus Music",
    // Classical music for studying compilations
    videos: ["jgpJVI3tDbY", "mIYzp5rcTvU", "WJ3-F02-F_Y"],
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(0);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Close expanded menu when clicking outside
  useEffect(() => {
    if (!isExpanded) return;
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isExpanded]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsExpanded(false);
    }, 400);
  }, []);

  const createPlayer = useCallback(
    (idx) => {
      const videos = PLAYLISTS[idx].videos;
      playerRef.current = new window.YT.Player("yt-music-player", {
        height: "0",
        width: "0",
        videoId: videos[0],
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videos.join(","),
        },
        events: {
          onReady: (event) => {
            setIsReady(true);
            event.target.setShuffle(true);
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event) => {
            // When video ends, play next
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.nextVideo();
            }
          },
        },
      });
    },
    []
  );

  // Load YouTube IFrame API and create player
  const loadPlayer = useCallback(
    (playlistIndex) => {
      const idx = playlistIndex ?? currentPlaylist;

      // If API is already loaded, recreate the player
      if (window.YT && window.YT.Player) {
        if (playerRef.current) {
          playerRef.current.destroy();
          // destroy() removes the element from DOM, so recreate it
          const container = document.getElementById("yt-music-container");
          if (container) {
            const div = document.createElement("div");
            div.id = "yt-music-player";
            container.appendChild(div);
          }
        }
        createPlayer(idx);
        return;
      }

      // Load the API script
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        createPlayer(idx);
      };
    },
    [currentPlaylist, createPlayer]
  );

  const togglePlay = useCallback(() => {
    if (!isReady) {
      loadPlayer();
      return;
    }

    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  }, [isReady, isPlaying, loadPlayer]);

  const switchPlaylist = useCallback(
    (index) => {
      setCurrentPlaylist(index);
      setIsExpanded(false);
      loadPlayer(index);
    },
    [loadPlayer]
  );

  const skipTrack = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.nextVideo();
    }
  }, [isReady]);

  if (isDismissed) return null;

  return (
    <div ref={containerRef} className="fixed bottom-20 right-4 lg:bottom-6 z-30 flex flex-col items-end gap-2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Playlist selector */}
      {isExpanded && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[160px]">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
            Focus Music
          </div>
          {PLAYLISTS.map((pl, i) => (
            <button
              key={pl.label}
              onClick={() => switchPlaylist(i)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                i === currentPlaylist
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {pl.label}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {isReady && isHovered && (
          <>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="h-10 px-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Switch playlist"
            >
              {PLAYLISTS[currentPlaylist].label}
            </button>
            <button
              onClick={skipTrack}
              className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Next track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M2.555 3.168A1 1 0 001 4.073v11.854a1 1 0 001.555.832l8-5.927a1 1 0 000-1.664l-8-5.927z" />
                <path d="M12.555 3.168A1 1 0 0011 4.073v11.854a1 1 0 001.555.832l8-5.927a1 1 0 000-1.664l-8-5.927z" />
              </svg>
            </button>
          </>
        )}

        {/* Dismiss button - always visible when not playing */}
        {!isPlaying && (
          <button
            onClick={() => setIsDismissed(true)}
            className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            title="Hide music player"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}

        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className={`h-11 w-11 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isPlaying
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          title={isPlaying ? "Pause music" : "Play focus music"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>
      </div>

      {/* Hidden YouTube player */}
      <div id="yt-music-container" className="hidden">
        <div id="yt-music-player" />
      </div>
    </div>
  );
}
