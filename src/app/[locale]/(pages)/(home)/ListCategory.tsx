import { ListProductCategoryResponse } from "@/app/api/services/api";
import { service } from "@/app/api/services/service";
import { Icon } from "@/components/ui/icon";
import { convertStringToHandle } from "@/utils/utils";
import Link from "next/link";
import React from "react";
type Props = {
  language: string;
};
export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await service.client.productCategoriesAll();

  return categories.map((category) => ({
    id: String(category.id),
  }));
}

export const ListCategory: React.FC<Props> = async ({ language }) => {
  const categories = await service.client.productCategoriesAll();
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-4 mt-6">
      {categories?.map((category: ListProductCategoryResponse) => {
        return (
          <div className="text-center" key={category.id?.toString()}>
            <Link
              className="mx-auto w-20 h-20 mb-2 rounded-full border-2 flex p-3 justify-center items-center bg-white border-primary"
              href={`${language}/category/${convertStringToHandle(
                category.name
              )}-cat.${category?.id?.toString()}`}
              scroll={false}
            >
              <Icon className="text-primary" iconName={category.icon!} />
            </Link>
            <span className="text-primary font-bold">{category.name}</span>
          </div>
        );
      })}
    </div>
  );
};
