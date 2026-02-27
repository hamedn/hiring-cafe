import { Picture } from "@/utils/picture";

export default function BoardInfo({ board }) {
  return (
    <>
      <div className="flex justify-between items-center p-8 border-b">
        <span className="text-lg font-bold flex w-3/5 items-center">
          {board.image_url &&
            <Picture
              alt={"logo"}
              src={board.image_url}
              properties={"w-28 max-h-28 object-contain mr-4"}
            />
          }
          {board.title}
        </span>
        <span className="text-xs align-text-bottom">Powered by <a href={'/'} className="underline text-blue-500">Hiring.Cafe</a></span>
      </div>
    </>
  );
}
