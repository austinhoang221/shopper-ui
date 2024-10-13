import { ListProductCategoryResponse } from "@/api/services/client";
import { service } from "@/api/services/service";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import React from "react";

type Props = {};

export default async function ListCategory(props: Props) {
  const categories = await service.client.productCategoriesAll();

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-4 mt-6">
      {categories.map((category: ListProductCategoryResponse) => {
        return (
          <div className="text-center" key={category.id?.toString()}>
            <Link
              className="mx-auto w-20 h-20 mb-2 rounded-full border-2 flex p-3 justify-center items-center bg-secondary border-primary"
              href={category.name!}
            >
              <Icon iconName={category.icon!} />
            </Link>
            <span className="text-primary font-bold">{category.name}</span>
          </div>
        );
      })}
    </div>
  );
}
