import { Button } from "@mui/material";
import React from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";

const QtyBox = ({ qtyValue, setQtyValue }) => {
    const plusQty = () => setQtyValue(qtyValue + 1);
    const minusQty = () => setQtyValue(qtyValue > 1 ? qtyValue - 1 : 1);

    return (
        <div className="QtyBox relative w-[70px]">
            <input
                type="number"
                className="w-full h-[40px] p-2 pl-3 text-[15px] focus:outline-none border border-primary rounded-md"
                value={qtyValue}
                readOnly
            />
            <div className="flex items-center flex-col justify-between h-[40px] absolute top-0 right-0 z-50 border-l border-[rgba(0,0,0,0.2)]">
                <Button onClick={plusQty} className="!min-w-[10px] !w-[24px] !h-[20px] rounded-none !text-primary">
                    <FaAngleUp className="text-[12px]" />
                </Button>
                <Button onClick={minusQty} className="!min-w-[10px] !w-[24px] !h-[20px] rounded-none !text-primary">
                    <FaAngleDown className="text-[12px]" />
                </Button>
            </div>
        </div>
    );
};

export default QtyBox;
