import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { FaRegPlusSquare, FaRegMinusSquare } from "react-icons/fa";
import { useState } from "react";
const CategoryCallabs = () => {
      const [openIndex, setOpenIndex] = useState(null);
      const [subOpenIndex, setSubOpenIndex] = useState(null);
      const toggleCategory = (index) => {
        setOpenIndex(openIndex === index ? null : index);
      };
    
      const toggleSubCategory = (index) => {
        setSubOpenIndex(subOpenIndex === index ? null : index);
      };
  return (
    <div>
      <div className="scroll">
        <ul className="w-full">
          <li className="list-none relative">
            <Button
              className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]"
              onClick={() => toggleCategory(0)}
            >
              Fashion
            </Button>
            {openIndex === 0 ? (
              <FaRegMinusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleCategory(0)}
              />
            ) : (
              <FaRegPlusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleCategory(0)}
              />
            )}
            {openIndex === 0 && (
              <ul className="submenu w-full pl-4">
                <li className="list-none relative">
                  <Button
                    className="w-full !text-left !justify-start !px-3 text-[14px] font-[500] !text-[rgba(0,0,0,0.8)]"
                    onClick={() => toggleSubCategory(0)}
                  >
                    Apparel
                  </Button>
                  {subOpenIndex === 0 ? (
                    <FaRegMinusSquare
                      className="absolute top-[8px] right-[15px] cursor-pointer"
                      onClick={() => toggleSubCategory(0)}
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[8px] right-[15px] cursor-pointer"
                      onClick={() => toggleSubCategory(0)}
                    />
                  )}
                  {subOpenIndex === 0 && (
                    <ul className="inner_submenu w-full pl-5">
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          Smart-Tablets
                        </Link>
                      </li>
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          T-shirts
                        </Link>
                      </li>
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          Leather watch
                        </Link>
                      </li>
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          Rolling Diamond
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
          <li className="list-none relative">
            <Button
              className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]"
              onClick={() => toggleCategory(1)}
            >
              Fashion
            </Button>
            {openIndex === 1 ? (
              <FaRegMinusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleCategory(1)}
              />
            ) : (
              <FaRegPlusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleCategory(1)}
              />
            )}
            {openIndex === 1 && (
              <ul className="submenu w-full pl-4">
                <li className="list-none relative">
                  <Button
                    className="w-full !text-left !justify-start !px-3 text-[14px] font-[500] !text-[rgba(0,0,0,0.8)]"
                    onClick={() => toggleSubCategory(1)}
                  >
                    Apparel
                  </Button>
                  {subOpenIndex === 1 ? (
                    <FaRegMinusSquare
                      className="absolute top-[8px] right-[15px] cursor-pointer"
                      onClick={() => toggleSubCategory(1)}
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[8px] right-[15px] cursor-pointer"
                      onClick={() => toggleSubCategory(1)}
                    />
                  )}
                  {subOpenIndex === 1 && (
                    <ul className="inner_submenu w-full pl-5">
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          Smart-Tablets
                        </Link>
                      </li>
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          T-shirts
                        </Link>
                      </li>
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          Leather watch
                        </Link>
                      </li>
                      <li className="list-none mb-1">
                        <Link
                          to="/"
                          className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                        >
                          Rolling Diamond
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryCallabs;
