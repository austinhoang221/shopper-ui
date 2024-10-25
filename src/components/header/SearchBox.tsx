"use client";
import React, { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ListProductCategoryResponse } from "@/api/services/api";
import { Icon } from "../ui/icon";
import { convertStringToHandle } from "@/utils/utils";
import Link from "next/link";

type Props = {
  language: string;
  className?: string;
  categories: ListProductCategoryResponse[];
};

const SearchBox = (props: Props) => {
  const [inputValue, setValue] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<ListProductCategoryResponse>(props.categories?.[0]);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
  };

  const handleSearch = () => {
    if (inputValue) {
      const href = `${
        props.language
      }/?q=${inputValue}/category/${convertStringToHandle(
        selectedCategory.name
      )}-cat.${selectedCategory?.id?.toString()}`;
      router.push(href);
      router.refresh();
    }
  };

  const handleKeyPress = (event: { key: A }) => {
    if (event.key === "Enter") handleSearch();
  };

  const onChangeCategory = (category: ListProductCategoryResponse) => {
    setSelectedCategory(category);
  };
  return (
    <div className={props.className}>
      <Input
        placeholder="Type to search..."
        className="w-full"
        value={inputValue ?? ""}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        endContent={
          <Link
            href={`${
              props.language
            }/?q=${inputValue}/category/${convertStringToHandle(
              selectedCategory.name
            )}-cat.${selectedCategory?.id?.toString()}`}
          >
            <FontAwesomeIcon
              icon={faSearch}
              width={18}
              height={18}
              className="text-primary cursor-pointer"
            />
          </Link>
        }
        type="search"
        startContent={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Icon iconName={categoryIcon} /> */}
              <FontAwesomeIcon
                icon={faSearch}
                width={18}
                height={18}
                className="text-primary cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent aria-label="Static Actions">
              <DropdownMenuGroup>
                {props.categories.map((category) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={selectedCategory?.id === category.id}
                      onCheckedChange={() => onChangeCategory(category)}
                    >
                      <div className="flex items-center gap-2">
                        {/* <Icon iconName={category.icon ?? ""} /> */}
                        <span>{category.name}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
    </div>
  );
};

export default SearchBox;
