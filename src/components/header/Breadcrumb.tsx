import React from "react";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import iconMap from "@/icons/iconMap";
type Props = {
  language: string;
  breadcrumbs: IBreadcrumbState[];
};

export interface IBreadcrumbState {
  key: string;
  href: string;
  name: string;
  icon: keyof typeof iconMap;
}
const Breadcrumb: React.FC<Props> = (props: Props) => {
  if (props.breadcrumbs.length > 0)
    return (
      props.breadcrumbs.length > 1 && (
        <BreadcrumbComponent className="flex bg-secondary  items-center  p-2">
          <BreadcrumbList className="container">
            {props.breadcrumbs.map((link, index) => {
              return (
                <React.Fragment key={link.key}>
                  <BreadcrumbItem>
                    <Link
                      className={`text-primary ${
                        index === props.breadcrumbs.length - 1
                          ? "font-bold"
                          : ""
                      }`}
                      href={`/${props.language}/${link.href}`}
                      scroll={false}
                    >
                      {link.name}
                    </Link>
                  </BreadcrumbItem>
                  {index < props.breadcrumbs.length - 1 && (
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
