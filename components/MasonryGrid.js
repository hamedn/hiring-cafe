import React from "react";
import Masonry from "react-masonry-css";
import "tailwindcss/tailwind.css";

const MasonryGrid = ({ items }) => {
  const breakpointColumnsObj = {
    default: 5,
    1700: 4,
    1400: 3,
    1000: 2,
    760: 1,
  };

  return (
    <div className="px-4 pb-4 md:px-8 xl:px-16 h-full flex-grow">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {items.map((item, index) => (
          <div key={item.key}>{item}</div>
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryGrid;
