"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { fallbackLng, languages } from "@/app/i18n/setting";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { ListProductCategoryResponse } from "@/api/services/api";
type Props = {
  language: string;
  categories: ListProductCategoryResponse[];
};

const ChangeLanguage = (props: Props) => {
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
      .filter((item) => item && item !== l)
      .join("/");
    router.push(`/${l}/${url}`);
  };

  return (
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
            defaultValue={props.language || fallbackLng}
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
  );
};

export default ChangeLanguage;
