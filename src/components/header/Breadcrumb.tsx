"use client";
import React from "react";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { languages } from "@/app/i18n/setting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { convertHandleToString } from "@/utils/utils";

const Breadcrumb = ({ language }) => {
  const paths = usePathname();
  const pathNames = paths
    .split("/")
    .filter((path) => !languages.includes(path) && path);
  if (pathNames.length > 0)
    return (
      <BreadcrumbComponent className="flex bg-quaternary  items-center  p-2">
        <BreadcrumbList className="container">
          <BreadcrumbItem>
            <BreadcrumbLink className="text-primary" href={`/${language}`}>
              <FontAwesomeIcon icon={faHome} />
              <span className="ml-2">Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {pathNames.length > 0 &&
            pathNames.map((link, index) => {
              const href =
                pathNames.length > 1
                  ? `/${pathNames.slice(0, index + 1).join("/")}`
                  : pathNames[0];
              const itemLink =
                link[0].toUpperCase() + link.slice(1, link.length);
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className={`text-primary ${
                        index === pathNames.length - 1 ? "font-bold" : ""
                      }`}
                      href={`/${language}/${href}`}
                    >
                      {convertHandleToString(
                        itemLink.includes("-cat")
                          ? itemLink.split("-cat")[0]
                          : itemLink.split("-p")[0]
                      )}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < pathNames.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
        </BreadcrumbList>
      </BreadcrumbComponent>
    );
};

export default Breadcrumb;
