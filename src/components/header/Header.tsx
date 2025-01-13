import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import SearchBox from "./SearchBox";
import DeliverTo from "./DeliverTo";
import Cart from "./Cart";

import ChangeLanguage from "./ChangeLanguage";
import { service } from "@/app/api/services/service";
import Authentication from "./Authentication";
import Menu from "../Menu/Menu";

export default async function Header({
  language,
}: Readonly<{ language: string }>) {
  const categories = await service.client.productCategoriesAll();
  return (
    <>
      <nav className=" w-full px-2 bg-white/90 sticky top-0 z-40 backdrop-blur-sm border-b flex-none transition-colors duration-500  ">
        <div className="container mx-auto items-center flex h-14 justify-between gap-5">
          <div className="flex justify-start items-center">
            <Menu categories={categories} language={language} />
            <Link href="/" className="mr-4">
              <p className="font-bold text-inherit">LOGO</p>
            </Link>
          </div>
          <div className="basis-full flex justify-center">
            <div className="w-full flex gap-3 items-center basis-full">
              <DeliverTo />
              <SearchBox
                categories={
                  categories ? JSON.parse(JSON.stringify(categories)) : []
                }
                language={language}
                className="hidden md:flex basis-full"
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-1">
            <Cart />
            <Separator orientation="vertical" className="h-1/2 " />
            {/* <div className="hidden sm:block">
              <Button size="icon" variant="ghost">
                <FontAwesomeIcon
                  icon={faHeadphones}
                  className="text-primary cursor-pointer"
                  width={18}
                  height={18}
                />
              </Button>
            </div> */}

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:block">
                  <Button size="icon" variant="ghost" className="relative ">
                    <FontAwesomeIcon
                      icon={faGlobe}
                      className="text-primary cursor-pointer"
                      width={30}
                      height={30}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent aria-label="Change language">
                  <ChangeLanguage language={language} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Authentication />
          </div>
        </div>
      </nav>
      <SearchBox
        categories={JSON.parse(JSON.stringify(categories))}
        language={language}
        className="flex md:hidden mb-2 px-2"
      />
    </>
  );
}
