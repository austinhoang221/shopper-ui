import React from "react";
import { Input } from "../ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  className?: string;
};

const SearchBox = (props: Props) => {
  return (
    <div className={props.className}>
      <Input
        placeholder="Type to search..."
        className="w-full"
        endContent={
          <FontAwesomeIcon
            icon={faSearch}
            width={18}
            height={18}
            className="text-primary"
          />
        }
        type="search"
        startContent={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FontAwesomeIcon
                icon={faChevronCircleDown}
                width={18}
                height={18}
                className="text-primary cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent aria-label="Static Actions">
              <DropdownMenuGroup>
                <DropdownMenuItem key="new">New file</DropdownMenuItem>
                <DropdownMenuItem key="copy">Copy link</DropdownMenuItem>
                <DropdownMenuItem key="edit">Edit file</DropdownMenuItem>
                <DropdownMenuItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Delete file
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
    </div>
  );
};

export default SearchBox;
