import { Menu } from "./Menu";

export default function BrowseMenu({ children }) {
  return (
    <div className="flex">
      <div className="hidden md:flex h-screen p-2 pt-8 border-r">
        <Menu />
      </div>
      <div
        className="h-screen overflow-x-hidden w-full"
        id="infiniteJobsScrollDivAdmin"
      >
        {children}
      </div>
    </div>
  );
}
