import { useState, useEffect, useRef, useMemo } from "react";
import {
  ClockIcon,
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  LinkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { camelToTitleCase, timeAgo } from "@/utils/helpers";
import useSavedSearchV4 from "@/hooks/useSavedSearchV4";
import withAuth from "./withAuth";
import { Tooltip } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useFetchPreferences from "@/hooks/useFetchPreferences";
import { useToast } from "@chakra-ui/react";

/* mark searches older than this date as outdated */
export const validSavedSearchTimestamp = new Date("2024-12-13");

/* util – move an item inside an array */
const reorder = (arr = [], from, to) => {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
};

/* safely coerce any timestamp-like value to a JS Date */
const toJSDate = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  const d = new Date(value);
  return isNaN(d) ? undefined : d;
};

/* Main wrapper */
function SavedSearchesV4({
  newWindow = true,
  onLoadSearchComplete = () => {},
}) {
  const {
    loading,
    savedSearches,
    deleteSearch,
    loadSearch,
    deleteAllSavedSearches,
    renameSearch,
    getURL,
    reorderSavedSearches,
  } = useSavedSearchV4();
  const {
    userPreferences,
    setUserPreferences,
    loading: loadingPreferences,
  } = useFetchPreferences();
  const digestOptedOut = userPreferences?.dailyDigestOptOut === false;
  const [digestLoading, setDigestLoading] = useState(false);
  const toast = useToast();

  /* drag-reorder support */
  const [orderedSearches, setOrderedSearches] = useState([]);
  useEffect(() => {
    if (
      Array.isArray(savedSearches) &&
      savedSearches.every((s) => s && typeof s.id === "string")
    ) {
      setOrderedSearches(savedSearches);
    }
  }, [savedSearches]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    setOrderedSearches((prev = []) => {
      const next = reorder(prev, source.index, destination.index);
      // persist, if available
      reorderSavedSearches?.(next.map((s) => s.id));
      return next;
    });
  };

  /* rename / edit state */
  const [editingId, setEditingId] = useState(null);
  const [nameDraft, setNameDraft] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const cancelEdit = () => {
    setEditingId(null);
    setNameDraft("");
  };
  const commitRename = (id, current = "") => {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === current) return cancelEdit();
    renameSearch?.(id, trimmed);
    cancelEdit();
  };

  const handleOptInDigest = async () => {
    setDigestLoading(true);
    try {
      await setUserPreferences({ dailyDigestOptOut: true });
      toast({
        title: "You've opted in to daily email digests!",
        description:
          "You'll receive daily email digests for your saved searches.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Could not update your email digest preference.",
        description: "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setDigestLoading(false);
    }
  };

  /* early states */
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <span className="animate-pulse text-sm font-semibold text-gray-400">
          Loading…
        </span>
      </div>
    );
  }

  if (!orderedSearches?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] py-8 px-4 bg-white rounded-xl shadow-md mx-auto max-w-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          No Saved Searches Yet
        </h2>
        <p className="text-gray-500 text-center mb-4">
          {`You haven't saved any searches yet.`}
          <br />
          To save a search, click the{" "}
          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold text-xs align-middle">
            Save Search
          </span>{" "}
          button after running a search.
        </p>
        <div className="w-full flex justify-center mb-2">
          <video
            src="/Save-Search-Demo.mp4"
            controls
            className="rounded-lg shadow-lg border w-full"
            style={{ background: "#f3f4f6" }}
          >
            {`Sorry, your browser doesn't support embedded videos.`}
          </video>
        </div>
        <span className="text-xs text-gray-400 mt-2">
          Need help? Watch the video above!
        </span>
      </div>
    );
  }

  /* render */
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      {digestOptedOut && (
        <div className="flex flex-col space-y-2 items-center justify-center mb-4 bg-gray-100 rounded-lg p-6">
          <div className="mb-2 text-center text-red-700 font-semibold text-sm">
            You are currently <b>not receiving daily email digests</b> for your
            saved searches.
            <br />
            Want to get daily updates? Opt in below!
          </div>
          <button
            onClick={handleOptInDigest}
            disabled={digestLoading || loadingPreferences}
            className="px-6 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {digestLoading ? "Opting in..." : "Receive daily email digests"}
          </button>
        </div>
      )}
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-base font-extrabold">
          {orderedSearches.length} saved{" "}
          {orderedSearches.length > 1 ? "searches" : "search"}
        </h2>

        <button
          onClick={() =>
            confirm("Delete ALL saved searches?") && deleteAllSavedSearches?.()
          }
          className="rounded-md px-3 py-1 text-sm font-semibold text-pink-600 transition hover:underline"
        >
          Delete all
        </button>
      </header>

      {/* draggable list */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          key="list"
          droppableId="saved-searches"
          direction="vertical"
          renderClone={(provided, snapshot, rubric) => {
            const s = orderedSearches[rubric.source.index];
            return (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="w-full select-none cursor-grabbing opacity-90"
                style={{ ...provided.draggableProps.style, listStyle: "none" }}
              >
                <SearchCard
                  search={s}
                  isEditing={false}
                  isValid={toJSDate(s.timestamp) > validSavedSearchTimestamp}
                  dragHandleProps={{}}
                />
              </li>
            );
          }}
        >
          {(dropProvided) => (
            <ul
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
              role="list"
              className="list-none flex flex-col gap-4"
            >
              {orderedSearches.map((s, i) => (
                <Draggable key={s.id} draggableId={s.id} index={i}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`w-full select-none ${
                        snapshot.isDragging
                          ? "cursor-grabbing"
                          : "cursor-default"
                      }`}
                      style={{
                        ...provided.draggableProps.style,
                        listStyle: "none",
                      }}
                    >
                      <SearchCard
                        search={s}
                        isEditing={editingId === s.id}
                        isValid={
                          toJSDate(s.timestamp) > validSavedSearchTimestamp
                        }
                        nameDraft={nameDraft}
                        setNameDraft={setNameDraft}
                        inputRef={inputRef}
                        setEditingId={setEditingId}
                        commitRename={commitRename}
                        cancelEdit={cancelEdit}
                        loadSearch={loadSearch}
                        onLoadSearchComplete={onLoadSearchComplete}
                        deleteSearch={deleteSearch}
                        newWindow={newWindow}
                        getURL={getURL}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}

function SearchCard({
  search,
  isEditing,
  isValid,
  nameDraft,
  setNameDraft,
  inputRef,
  setEditingId,
  commitRename,
  cancelEdit,
  loadSearch,
  onLoadSearchComplete,
  deleteSearch,
  newWindow,
  getURL,
  dragHandleProps = {},
}) {
  const parsed = useMemo(() => {
    if (search?.state) {
      return typeof search.state === "string"
        ? (() => {
            try {
              return JSON.parse(search.state);
            } catch {
              return {};
            }
          })()
        : search.state;
    }
    return {};
  }, [search?.state]);

  /* scroll-hint logic */
  const listRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 0);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [parsed]);

  /* copy-link feedback */
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef();
  useEffect(() => () => clearTimeout(copyTimeoutRef.current), []);

  const handleCopy = async () => {
    const url = getURL?.(search.id) || window.location.origin;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // fallback or ignore
      }
    }
    setCopied(true);
    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  /* timestamp */
  const ts = toJSDate(search.timestamp);

  return (
    <div className="group flex h-full w-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      {/* top section */}
      <div className="flex flex-col gap-3">
        {isEditing ? (
          /* edit mode */
          <div className="flex items-start gap-2">
            <input
              ref={inputRef}
              value={nameDraft}
              placeholder="Give this search a name"
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename(search.id, search.name);
                if (e.key === "Escape") cancelEdit();
              }}
              className="w-full border-b-2 border-pink-500 bg-transparent pb-0.5 text-base font-black placeholder-gray-300 focus:outline-none"
            />
            <button
              onClick={() => commitRename(search.id, search.name)}
              className="rounded p-1 text-pink-600 hover:bg-gray-100 active:scale-95"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={cancelEdit}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 active:scale-95"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* view mode */
          <div className="flex w-full items-center gap-2">
            <Tooltip label="Drag to reorder" hasArrow>
              <div
                {...dragHandleProps}
                className="rounded p-1 text-gray-300 transition hover:text-gray-500 active:cursor-grabbing cursor-grab"
              >
                <Bars3Icon className="h-5 w-5" />
              </div>
            </Tooltip>

            <span className="flex-1 min-w-0">
              <button
                onClick={() => {
                  if (isValid) {
                    loadSearch?.(search.id, newWindow);
                    onLoadSearchComplete();
                  }
                }}
                disabled={!isValid}
                className={`inline-flex max-w-full items-center gap-1 truncate rounded px-1 py-0.5 text-start font-black transition ${
                  isValid
                    ? "text-pink-600 hover:bg-gray-100 hover:underline"
                    : "cursor-not-allowed text-gray-400"
                }`}
              >
                <span className="truncate text-base sm:text-lg">
                  {search.name || "Untitled"}
                </span>
                {!isValid && <span className="text-xs">(outdated)</span>}
              </button>
            </span>
            <Tooltip label="Edit saved search name" hasArrow>
              <button
                onClick={() => {
                  setEditingId(search.id);
                  setNameDraft(search.name || "");
                }}
                className="rounded p-1 text-gray-400 transition hover:text-pink-600 focus-visible:outline-pink-600"
                aria-label="Rename saved search"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        )}

        {/* bullet list */}
        {Object.keys(parsed).length > 0 && (
          <div className="relative">
            <ul
              ref={listRef}
              className="whitespace-nowrap space-y-1 overflow-x-auto pb-1 text-xs leading-tight text-gray-700 scrollbar-hide sm:text-[13px]"
            >
              {Object.entries(parsed).map(([k, v]) => {
                const toReadable = (str) => {
                  if (typeof str !== "string") return str;
                  if (str.includes("_")) {
                    // snake_case to Title Case
                    return str
                      .split("_")
                      .map((w) =>
                        w.length > 0
                          ? w.charAt(0).toUpperCase() + w.slice(1)
                          : ""
                      )
                      .join(" ");
                  }
                  return str;
                };

                // —— updated value logic to avoid rendering objects directly ——
                const val = (() => {
                  // booleans
                  if (typeof v === "boolean") return v ? "true" : "false";
                  // arrays
                  if (Array.isArray(v)) {
                    return v
                      .map((item) => {
                        if (item && typeof item === "object") {
                          // prefer formatted_address or .value, else JSON‐stringify
                          return toReadable(
                            item.formatted_address ||
                              item.value ||
                              JSON.stringify(item)
                          );
                        }
                        return toReadable(item);
                      })
                      .join(", ");
                  }
                  // objects
                  if (v && typeof v === "object") {
                    return toReadable(
                      v.formatted_address || v.value || JSON.stringify(v)
                    );
                  }
                  // everything else
                  return toReadable(v);
                })();
                // — end updated section ——

                return (
                  <li
                    key={k}
                    className="list-inside list-disc whitespace-nowrap"
                  >
                    <span className="font-medium">{camelToTitleCase(k)}</span>
                    {val && (
                      <>
                        <span className="text-gray-400">: </span>
                        <span className="font-semibold text-indigo-600">
                          {val}
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* fade-out scroll cues */}
            {!atStart && (
              <div className="pointer-events-none absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-white to-transparent" />
            )}
            {!atEnd && (
              <div className="pointer-events-none absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-white to-transparent" />
            )}
          </div>
        )}
      </div>

      {/* bottom actions */}
      <div className="mt-4 flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 transition ${
              copied
                ? "bg-green-100 border-green-200"
                : "hover:bg-gray-200 bg-gray-100 border-gray-200"
            }`}
            aria-label="Share saved search"
            disabled={copied}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() =>
              confirm("Delete this saved search?") && deleteSearch?.(search.id)
            }
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-pink-600 transition hover:bg-gray-100 active:scale-95"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
        {ts && (
          <Tooltip
            label="The last time you created or modified this search."
            hasArrow
          >
            <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-[13px]">
              <ClockIcon className="h-4 w-4 shrink-0" />
              {timeAgo(ts)}
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default withAuth(SavedSearchesV4);
