import ListProduct from "@/components/product/ListProduct";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { convertHandleToString } from "@/utils/utils";
import {
  faChevronCircleDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ProductByCategory = ({ params }: { params: { category: string } }) => {
  return (
    <>
      <div className="block md:flex mt-4 justify-between">
        <h1 className="text-lg font-bold truncate mb-2 md:mb-0">
          {convertHandleToString(params.category.split("-cat")[0])}
        </h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger type="button">
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
                <DropdownMenuItem key="asc">
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem key="dsc">
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger className="block sm:hidden">
              <Button>
                Filters
                <FontAwesomeIcon
                  className="ml-2"
                  icon={faFilter}
                  width={18}
                  height={18}
                />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <h1 className="font-bold my-2">Price</h1>
              <Separator className="bg-[#d5dbdb]" />
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className={cn("w-[60%]")}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="hidden md:grid grid-cols-12 gap-4 mt-2">
        <div className="col-span-2">
          <h1 className="text-lg font-bold">Filters</h1>
          <Separator className="bg-[#d5dbdb] my-2" />
          <h1 className="fon-bold my-2">Price</h1>
          <Separator className="bg-[#d5dbdb]" />
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            className={cn("w-[60%]")}
          />
        </div>
        <div className="col-span-10">
          <ListProduct category={params.category} isInfiniteScroll />
        </div>
      </div>

      <div className="block md:hidden">
        <ListProduct category={params.category} isInfiniteScroll />
      </div>
    </>
  );
};

export default ProductByCategory;
