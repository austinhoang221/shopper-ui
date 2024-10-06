"use client";
import { useTranslation } from "@/app/i18n/client";
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
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";

const Header = ({ language }) => {
  const { t } = useTranslation(language);
  return (
    <Navbar isBordered>
      <NavbarContent justify="center" className="w-full">
        <NavbarContent>
          <NavbarBrand className="mr-4">
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="basis-full" justify="center">
          <NavbarItem className="w-full flex gap-3 items-center basis-full">
            <div className="items-center gap-2 hidden sm:flex">
              <FontAwesomeIcon
                icon={faLocationDot}
                width={18}
                height={18}
                className="text-primary"
              />
              <div className="flex-col leading-4 flex">
                <span>Deliver to</span>
                <span className="text-primary font-bold">Vietnam</span>
              </div>
            </div>
            <Input
              radius="none"
              placeholder="Type to search..."
              size="sm"
              variant="bordered"
              endContent={
                <FontAwesomeIcon
                  icon={faSearch}
                  width={18}
                  height={18}
                  className="text-primary"
                />
              }
              type="search"
              classNames={{
                inputWrapper: "pl-0 rounded-sm border-primary",
              }}
              startContent={
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" radius="none" className="h-full">
                      All
                      <FontAwesomeIcon
                        icon={faChevronCircleDown}
                        width={18}
                        height={18}
                        className="text-primary"
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="new">New file</DropdownItem>
                    <DropdownItem key="copy">Copy link</DropdownItem>
                    <DropdownItem key="edit">Edit file</DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                    >
                      Delete file
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              }
            />
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button isIconOnly>
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-primary"
                width={18}
                height={18}
              />
            </Button>
          </NavbarItem>
          <Divider orientation="vertical" className="h-1/2 " />
          <NavbarItem className="hidden sm:block">
            <Button isIconOnly>
              <FontAwesomeIcon
                icon={faHeadphones}
                className="text-primary"
                width={18}
                height={18}
              />
            </Button>
          </NavbarItem>
          <Divider orientation="vertical" className="h-1/2 hidden sm:block" />
          <NavbarItem className="hidden sm:block">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly>
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="text-primary"
                    width={18}
                    height={18}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {languages
                  .filter((l) => l !== language)
                  .map((l, index) => (
                    <DropdownItem key={index} href={`/${l}`}>
                      <Link href={`/${l}`}>{l.toUpperCase()}</Link>
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <Divider orientation="vertical" className="h-1/2 hidden sm:block" />
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly>
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-primary"
                    width={18}
                    height={18}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
