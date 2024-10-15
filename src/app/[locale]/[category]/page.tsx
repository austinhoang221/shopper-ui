import ListProduct from "@/components/product/ListProduct";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Products = ({ params }: { params: { category: string } }) => {
  return (
    <>
      <div className="flex mt-4 justify-between">
        <h1 className="text-center text-2xl font-bold ">{params.category}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild type="button">
            <Button>
              Sort by
              <FontAwesomeIcon
                className="ml-2"
                icon={faChevronCircleDown}
                width={18}
                height={18}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="Static Actions">
            <DropdownMenuGroup>
              <DropdownMenuItem key="asc">Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem key="dsc">Price: High to Low</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ListProduct isInfiniteScroll />
    </>
  );
};

export default Products;
