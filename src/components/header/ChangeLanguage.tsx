"use client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { fallbackLng, languages } from "@/app/i18n/setting";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useParams, useRouter } from "next/navigation";
type Props = {
  language: string;
};

const ChangeLanguage = (props: Props) => {
  const router = useRouter();
  const params = useParams();
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
    // const url = window.location.pathname.replace(`/${props.language}`, `/${l}`);
    router.push(`/${l}`, { scroll: false });
  };

  return (
    <RadioGroup
      defaultValue={props.language || fallbackLng}
      className="p-0 md:p-1"
    >
      <div className="flex flex-col justify-center p-0 md:p-2 gap-y-2">
        <h2 className="text-sm block font-bold w-full">Change language</h2>
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
  );
};

export default ChangeLanguage;
