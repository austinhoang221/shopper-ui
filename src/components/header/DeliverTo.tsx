import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "../ui/button";

type Props = {};

const DeliverTo = (props: Props) => {
  return (
    <Button className="items-center gap-1 flex pl-2" variant="ghost">
      <FontAwesomeIcon
        icon={faLocationDot}
        width={18}
        height={18}
        className="text-primary"
      />
      <div className="md:flex-col leading-4 flex">
        <span className="text-xs mr-1 md:mr-0">Deliver to</span>
        <span className="text-primary font-bold">Vietnam</span>
      </div>
    </Button>
  );
};

export default DeliverTo;
