"use client";
import { fallbackLng, languages } from "@/app/i18n/setting";
import {
  faGlobe,
  faHeadphones,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import SearchBox from "./SearchBox";
import Menu from "../menu/Menu";
import DeliverTo from "./DeliverTo";
import Cart from "./Cart";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const Header = ({ language }: { language: string }) => {
  const router = useRouter();
  const onRenderLanguageItem = (lang: string) => {
    switch (lang) {
      case "en":
        return "English - EN";
      case "fr":
        return "French - FR";
      case "vn":
        return "Vietnamese - VN";
    }
  };

  const onChangeLanguage = (l: string) => {
    const url = window.location.pathname
      .split("/")
      .filter((item) => item && item !== "en")
      .join("/");
    router.push(`/${l}/${url}`);
  };
  return (
    <nav className=" w-full px-2 bg-white/90 sticky top-0 z-40 backdrop-blur-sm border-b flex-none transition-colors duration-500  ">
      <div className="container mx-auto items-center flex h-14 justify-between gap-3">
        <div className="flex justify-start items-center">
          <Menu language={language} />
          <Link href="/" className="mr-4">
            <p className="font-bold text-inherit">LOGO</p>
          </Link>
        </div>
        <div className="basis-full flex justify-center">
          <div className="w-full flex gap-3 items-center basis-full">
            <DeliverTo />
            <SearchBox className="hidden md:block basis-full" />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Cart />
          <Separator orientation="vertical" className="h-1/2 " />
          <div className="hidden sm:block">
            <Button size="icon" variant="ghost">
              <FontAwesomeIcon
                icon={faHeadphones}
                className="text-primary cursor-pointer"
                width={18}
                height={18}
              />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-1/2 hidden sm:block" />
          <Button variant="ghost" className="hidden sm:block px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="text-primary cursor-pointer"
                  width={18}
                  height={18}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent aria-label="Static Actions">
                <RadioGroup
                  defaultValue={language || fallbackLng}
                  className="p-1"
                >
                  <div className="flex flex-col justify-center p-2 gap-y-2">
                    <h2>Change language</h2>
                    <Separator className="bg-[#d5dbdb] " />

                    {languages.map((l, index) => (
                      <div key={index} className="flex items-center ">
                        <RadioGroupItem
                          value={l}
                          id={`radio-${index}`}
                          onClick={() => {
                            onChangeLanguage(l);
                          }}
                        />
                        <Label className="ml-2" htmlFor={`radio-${index}`}>
                          {onRenderLanguageItem(l)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
          <Separator orientation="vertical" className="h-1/2 hidden sm:block" />
          <Button variant="ghost" className="px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-primary cursor-pointer"
                  width={18}
                  height={18}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent aria-label="Profile Actions">
                <DropdownMenuGroup>
                  <DropdownMenuItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">zoey@example.com</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem key="settings">
                    My Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem key="team_settings">
                    Team Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem key="analytics">Analytics</DropdownMenuItem>
                  <DropdownMenuItem key="system">System</DropdownMenuItem>
                  <DropdownMenuItem key="configurations">
                    Configurations
                  </DropdownMenuItem>
                  <DropdownMenuItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownMenuItem>
                  <DropdownMenuItem key="logout" color="danger">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
