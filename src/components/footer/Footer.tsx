import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="text-primary">
      Copyright <span className="px-4 text-center">Shopper</span>{" "}
      {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
