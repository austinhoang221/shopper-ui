"use client";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { service } from "@/api/services/service";
import { Accordion, AccordionContent, AccordionItem } from "../ui/accordion";

type Props = {};

export default function Menu({ language }) {
  React.useEffect(() => {
    const fetch = async () => {
      const categories = await service.client.productCategoriesAll();
    };
    fetch();
  }, []);
  return (
    <>
      <div className="flex bg-secondary">
        <div className="container mx-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link" className="pl-0">
                <FontAwesomeIcon className="mr-2" icon={faBars} />
                <span>All</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Hello</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <ul>
                  {/* {categories?.map((category) => (
                    <li key={category.id}>{category.name}</li>
                  ))} */}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
