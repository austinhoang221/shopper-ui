import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Footer = () => {
  return (
    <footer className="text-primary">
      <div className="container mx-auto flex h-auto justify-between items-start gap-3">
        <div className="flex flex-col items-start gap-2">
          <span>About Us</span>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="pr-2" />
            <span>abc@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} className="pr-2" />
            <span>0123456789</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="pr-2" />
            <span>123 Main St, City</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span>© 2024 Shopper. All Rights Reserved</span>
          <div>
            <span>Language:&nbsp;</span>
            <span>French</span>
            &nbsp;|&nbsp;
            <span>English</span>
            &nbsp;|&nbsp;
            <span>Vietnamese</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
