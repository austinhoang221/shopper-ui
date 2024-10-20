"use client";
import React from "react";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAppSelector } from "@/hooks/reduxHooks";

const Breadcrumb = ({ language }) => {
  const breadcrumbs = useAppSelector((state) => state.breadcrumb);
  if (breadcrumbs.value.length > 0)
    return (
      <BreadcrumbComponent className="flex bg-tertiary  items-center  p-2">
        <BreadcrumbList className="container">
          {breadcrumbs.value.length > 0 &&
            breadcrumbs.value.map((link, index) => {
              return (
                <React.Fragment key={link.key}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className={`text-primary ${
                        index === breadcrumbs.value.length - 1
                          ? "font-bold"
                          : ""
                      }`}
                      href={`/${language}/${link.href}`}
                    >
                      <span>{link.name}</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < breadcrumbs.value.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              );
            })}
        </BreadcrumbList>
      </BreadcrumbComponent>
    );
};

export default Breadcrumb;
