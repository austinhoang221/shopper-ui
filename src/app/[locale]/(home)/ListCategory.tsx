import { library } from "@fortawesome/fontawesome-svg-core";
import { faCableCar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

type Props = {};

const ListCategory = (props: Props) => {
  const categories = [
    {
      id: 1,
      name: "Fashion",
      icon: "",
    },
    {
      id: 2,
      name: "Electronic",
      icon: "",
    },
    {
      id: 3,
      name: "Kitchen",
      icon: "",
    },
    {
      id: 4,
      name: "Pet Suppliers",
      icon: "",
    },
    {
      id: 5,
      name: "Medical Suppliers",
      icon: "",
    },
    {
      id: 6,
      name: "Art and Craft",
      icon: "",
    },
    {
      id: 7,
      name: "Technology",
      icon: "",
    },
    {
      id: 8,
      name: "Food",
      icon: "",
    },
    {
      id: 9,
      name: "Fashion",
      icon: "",
    },
    {
      id: 10,
      name: "Cosmetic",
      icon: "",
    },
    {
      id: 11,
      name: "Temp",
      icon: "",
    },
    {
      id: 12,
      name: "Lorem",
      icon: "",
    },
  ];
  library.add(faUser);

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-4 mt-6">
      {categories.map((category) => {
        return (
          <div className="text-center" key={category.id}>
            <Link
              className="mx-auto w-20 h-20 mb-2 rounded-full border-2 flex p-3 justify-center items-center bg-secondary border-primary"
              href={category.name}
            >
              <FontAwesomeIcon icon="user" className="text-primary" size="xl" />
            </Link>
            <span className="text-primary font-bold">{category.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ListCategory;
