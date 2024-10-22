import React from "react";

const Footer = () => {
  return (
    <footer className="text-primary">
      Copyright <span className="px-4 text-center">Shopper</span>{" "}
      {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
