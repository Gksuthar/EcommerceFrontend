import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { MdOutlineClose } from "react-icons/md";
import { Button } from "@mui/material";
import { FaRegPlusSquare, FaRegMinusSquare } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./style.css";
import axios from "axios";
import { MyContext } from "../../App";

const Sidebar = ({ openSidebarFunction, isOpenSidebar,fetchCategory }) => {
  const  context = useContext(MyContext);
  const url = context.AppUrl
  const token  = localStorage.getItem('accessToken')
  return (
    <Drawer anchor="left" open={isOpenSidebar} onClose={openSidebarFunction}>
      <Box sx={{ width: 250, p: 2 }} className="categoryPanel">
        <h3 className="text-[16px] font-[500] flex items-center justify-between">
          Shop By Category
          <MdOutlineClose
            className="hover:cursor-pointer text-[20px] font-[500] mr-1"
            onClick={openSidebarFunction}
          />
        </h3>
        <div className="scroll">
          <ul className="w-full">
            {Array.isArray(context.categoryData) &&
              context.categoryData
                .filter((item) => item.parentId === null)
                .map((parentItem) => {
                  return (
                    <li key={parentItem._id} className="list-none relative">
                      <Button
                        className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]"
                        onClick={() =>
                          context.toggleCategory(parentItem._id, parentItem.name)
                        }
                      >
                        {parentItem.name}
                      </Button>
                      {context.openCategoryId === parentItem._id ? (
                        <FaRegMinusSquare
                          className="absolute top-[10px] right-[15px] cursor-pointer"
                          onClick={() =>
                            context.toggleCategory(parentItem._id, parentItem.name)
                          }
                        />
                      ) : (
                        <FaRegPlusSquare
                          className="absolute top-[10px] right-[15px] cursor-pointer"
                          onClick={() =>
                            context.toggleCategory(parentItem._id, parentItem.name)
                          }
                        />
                      )}
                      {context.openCategoryId === parentItem._id && (
                        <ul className="submenu w-full pl-4">
                          {context.subCategory &&
                            context.subCategory.map((subItem) => (
                              <li key={subItem._id} className="list-none mb-1">
                                <Link
                                  to={`/category`}
                                  className="link w-full !text-left !justify-start !px-3 text-[14px] font-[500]"
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      )}
                    </li>
                  );
                })}

          </ul>
          {token && 
            <Button onClick={context.logout} className=" !w-full btn-org !mt-5">
              Logout
            </Button>
          }
        </div>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
