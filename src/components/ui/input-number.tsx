"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./input-number.css";
type Props = {
  initialValue: number;
  min: number;
};
export default function InputNumber(props: Props) {
  const [value, setValue] = useState(props.initialValue);
  const handleIncrement = () => {
    setValue(value + 1);
  };
  const handleDecrement = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value) || 0)}
        min={props.min}
        className="w-28 text-center"
        startContent={
          <Button variant="ghost" size="icon" onClick={handleDecrement}>
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        }
        endContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={handleIncrement}
            className=""
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        }
      />
    </div>
  );
}
