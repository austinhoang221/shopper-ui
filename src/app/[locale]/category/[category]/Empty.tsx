import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import React from "react";

type Props = {};

const Empty = (props: Props) => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q");

  return (
    <div className="mx-auto mt-4 text-center">
      <FontAwesomeIcon icon={faSearch} className="mb-4 text-primary text-2xl" />
      <h1 className="mb-2 text-xl">
        {searchValue ? (
          <span>No result for "{searchValue}"</span>
        ) : (
          <span>No result</span>
        )}
      </h1>

      <p>
        You may want to try different keywords, checking for typos or adjusting
        your filters
      </p>
    </div>
  );
};

export default Empty;
