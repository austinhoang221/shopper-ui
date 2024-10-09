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
import { service } from "@/api/services/service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "../../components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import { Separator } from "../ui/separator";

type Props = {
  language: string;
  className?: string;
};

export default function Menu(props: Props) {
  const categories = [
    {
      id: 1,
      icon: "fa eyes",
      name: "fashion",
      children: [
        {
          id: 2,
          name: "lips",
          children: [],
        },
        {
          id: 3,
          name: "clothes",
          children: [],
        },
        {
          id: 4,
          name: "shoes",
          children: [],
        },
      ],
    },
    {
      id: 5,
      name: "sport",
      children: [
        {
          id: 6,
          name: "football",
          children: [],
        },
        {
          id: 7,
          name: "soccer",
          children: [],
        },
        {
          id: 8,
          name: "basketball",
          children: [],
        },
      ],
    },
  ];
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
            <SheetTitle>Hello</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.id}>
                <Collapsible>
                  <div className="flex items-center justify-between space-x-4">
                    <Link
                      href={category.name}
                      className="text-base font-semibold w-full"
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
                    {category.children.map((child) => (
                      <Link
                        href={`${props.language}/${child.name}`}
                        key={child.id}
                        className="block px-4 py-2 text-sm "
                      >
                        {child.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                {index < categories.length - 1 && (
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
