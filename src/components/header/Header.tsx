"use client";
import { languages } from "@/app/i18n/setting";
import {
  faCartShopping,
  faChevronCircleDown,
  faGlobe,
  faHeadphones,
  faLocationDot,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import React from "react";
import { Input } from "../ui/input";
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

const Header = ({ language }) => {
  const router = useRouter();
  return (
    <nav className=" w-full px-2 bg-white ">
      <div className="container mx-auto items-center flex h-14 justify-between gap-3">
        <div className="flex justify-start items-center">
          <Menu language={language} />
          <Link href="/" className="mr-4">
            <p className="font-bold text-inherit">LOGO</p>
          </Link>
        </div>
        <div className="basis-full flex justify-center">
          <div className="w-full flex gap-3 items-center basis-full">
            <div className="hidden md:block">
              <DeliverTo />
            </div>
            <SearchBox className="hidden md:block basis-full" />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Button size="icon" variant="ghost">
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-primary cursor-pointer"
              width={18}
              height={18}
            />
          </Button>
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
                <DropdownMenuGroup>
                  {languages
                    .filter((l) => l !== language)
                    .map((l, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => router.push(l)}
                      >
                        {l.toUpperCase()}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
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
