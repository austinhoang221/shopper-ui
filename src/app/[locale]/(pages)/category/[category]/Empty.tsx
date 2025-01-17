import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import React from "react";

const Empty = () => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q");

  return (
    <div className="mx-auto mt-4 text-center">
      <FontAwesomeIcon icon={faSearch} className="mb-4 text-primary text-2xl" />
      <h1 className="mb-2 text-lg">
        {searchValue ? (
          <span>No result for &quot;{searchValue}&quot;</span>
        ) : (
          <span>No result</span>
        )}
      </h1>

      {searchValue && (
        <p>
          You may want to try different keywords, checking for typos or
          adjusting your filters
        </p>
      )}
    </div>
  );
};

export default Empty;
