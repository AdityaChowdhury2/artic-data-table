import { memo, useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomHeader = memo(
  ({ handleSubmit }: { handleSubmit: (value: string) => void }) => {
    console.log("CustomHeader");
    const [value, setValue] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const overlayRef = useRef<OverlayPanel>(null);
    return (
      <div className="flex items-center justify-between">
        <button
          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={(e) => {
            overlayRef.current?.toggle(e);
          }}
        >
          <FaChevronDown />
        </button>
        <OverlayPanel ref={overlayRef}>
          <div className="flex flex-col gap-2">
            <InputText
              value={value}
              placeholder="Enter number of rows"
              className="p-inputtext-sm"
              onChange={(e) => {
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
              className="p-button p-button-sm"
              disabled={!isValid}
              onClick={() => {
                handleSubmit(value);
                setValue("");
                overlayRef.current?.hide();
              }}
            />
          </div>
        </OverlayPanel>
      </div>
    );
  }
);

export default CustomHeader;
