import { faBars, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { convertStringToHandle } from "@/utils/utils";
import { ListProductCategoryResponse } from "@/api/services/api";

type Props = {
  language: string;
  className?: string;
  categories: ListProductCategoryResponse[];
};

export default function Menu(props: Props) {
  return (
    <div className={props.className}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="pl-0">
            <FontAwesomeIcon className="mr-2" icon={faBars} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Discover categories</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            {props.categories.map((category, index) => (
              <div key={category.id!.toString()}>
                <Collapsible>
                  <div className="flex items-center justify-between space-x-4">
                    <Link
                      href={`/${
                        props.language
                      }/category/${convertStringToHandle(
                        category.name
                      )}-cat.${category?.id?.toString()}`}
                      className="text-sm block font-bold w-full"
                    >
                      {category.name}
                    </Link>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          className="h-4 w-4"
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    {category.children?.map((child) => (
                      <Link
                        href={`/${
                          props.language
                        }/category/${convertStringToHandle(
                          child.name
                        )}-cat.${child?.id?.toString()}`}
                        key={child.id?.toString()}
                        className="block px-4 py-2 text-sm hover:bg-muted"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                {index < props.categories.length - 1 && (
                  <Separator className="mt-4 bg-[#d5dbdb]" />
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
