import React, { createContext, useState } from "react";

const PromotedJobsContext = createContext();

function PromotedJobsProvider({ children }) {
  const [cache, setCache] = useState([[]]);
  const [queryInProgress, setQueryInProgress] = useState(false);

  const contextValue = {
    boards: cache,
    queryInProgress,
  };

  return (
    <PromotedJobsContext.Provider value={contextValue}>
      {children}
    </PromotedJobsContext.Provider>
  );
}

export { PromotedJobsContext, PromotedJobsProvider };
