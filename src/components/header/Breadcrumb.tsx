"use client";
import React from "react";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAppSelector } from "@/hooks/reduxHooks";
import Link from "next/link";
type Props = {
  language: string;
};
const Breadcrumb: React.FC<Props> = ({ language }) => {
  const breadcrumbs = useAppSelector((state) => state.breadcrumb);
  if (breadcrumbs.value.length > 0)
    return (
      breadcrumbs.value.length > 1 && (
        <BreadcrumbComponent className="flex bg-tertiary  items-center  p-2">
          <BreadcrumbList className="container">
            {breadcrumbs.value.map((link, index) => {
              return (
                <React.Fragment key={link.key}>
                  <BreadcrumbItem>
                    <Link
                      className={`text-primary ${
                        index === breadcrumbs.value.length - 1
                          ? "font-bold"
                          : ""
                      }`}
                      href={`/${language}/${link.href}`}
                    >
                      {link.name}
                    </Link>
                  </BreadcrumbItem>
                  {index < breadcrumbs.value.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </BreadcrumbComponent>
      )
    );
};

export default Breadcrumb;
