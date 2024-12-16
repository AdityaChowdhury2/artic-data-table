import { useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomHeader = ({
  handleSubmit,
}: {
  handleSubmit: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const op = useRef<OverlayPanel>(null);
  return (
    <div className="flex items-center justify-between">
      <button
        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={(e) => {
          console.log("Header button clicked");
          op.current?.toggle(e);
        }}
      >
        <FaChevronDown />
      </button>
      <OverlayPanel ref={op}>
        <div className="flex flex-col gap-2">
          <InputText
            value={value}
            className="p-inputtext-sm"
            onChange={(e) => {
              console.log(e.target.value);
              if (Number(e.target.value)) {
                setIsValid(true);
                setValue(e.target.value);
              } else {
                setValue("");
                setIsValid(false);
              }
            }}
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            label="Submit"
            size="small"
            className="py-1.5 px-4"
            disabled={!isValid}
            onClick={() => {
              handleSubmit(value);
              setValue("");
              op.current?.hide();
            }}
          />
        </div>
      </OverlayPanel>
    </div>
  );
};

export default CustomHeader;
