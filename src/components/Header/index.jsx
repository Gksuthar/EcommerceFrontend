import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";
import Search from "../Search";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { IoGitCompareOutline } from "react-icons/io5";
import Badge from "@mui/material/Badge";
import { IoIosHeartEmpty } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import Tooltip from "@mui/material/Tooltip";
import Navigation from "../Navigation/index";
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import { FaRegUserCircle } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { AiOutlineMenu } from "react-icons/ai";

const Header = ({setSearch,search}) => {
  const context = useContext(MyContext);
  const url = context.AppUrl;
  const navigate = useNavigate();
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="bg-white">
      <div className="hidden sm:block  top-strip py-2 border-t-[1px] border-gray-250 border-b-[1px]">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="col1 w-[50%]">
              <p className="text-[12px] font-[500]">
                Get up to 50% of new styles ,limited time only
              </p>
            </div>
            <div className="col2 items-center justify-end">
              <ul className="flex items-center gap-3">
                <li className="list-none flex gap-4 ">
                  <Link
                    className="link transition text-[13px]  font-[500]"
                    to="/help-center"
                  >
                    Help-center{" "}
                  </Link>
                  <Link
                    className="link transition text-[13px]  font-[500]"
                    to="/order-tracking"
                  >
                    order-tracking{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="header py-2  border-b-[1px]">
        <div className="container flex items-center justify-between">
          <div
            onClick={context.openSidebarFunction}
            className="sm:hidden flex items-center justify-start w-[33%]"
          >
            <AiOutlineMenu className="text-2xl" />
          </div>

          <div className="w-[33%] sm:w-[25%]">
            <Link to="/">
              <img src="logo-ecomm.jpg" />
            </Link>
          </div>



          <div className="hidden sm:block col2 w-[33%] sm:w-[43%] ">
            <Search setSearch={setSearch} search={search}/>
          </div>


          <div className="col3 sm:w-[32%]  w-[33%]  flex  items-center pl-5 ">
            <ul className="w-full flex items-center  justify-end gap-1 sm:gap-3 ">
              {!context.isLogin ? (
                <>
                  <li className="list-none">
                    <Link
                      to="/login"
                      className="link transition text-[15px] font-[500]"
                    >
                      Login
                    </Link>{" "}
                    | &nbsp;
                    <Link
                      to="/register"
                      className="link transition text-[15px] font-[500] "
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <div className="hidden sm:flex items-center space-x-2 cursor-pointer classMyAccountwrapper">
                    <Button
                      onClick={handleClick}
                      className="!w-[50px] !h-[50px] !min-w-[50px] !rounded-full"
                    >
                      <FaRegUserCircle className="text-[20px] text-[rgba(0,0,0,0.7)]" />
                    </Button>
                    <div className="hidden sm:flex flex-col justify-end">
                      <h4 className="text-[14px] !mb-0 font-[500]">
                        {context?.userProfile?.name}
                      </h4>
                      <span className="text-[13px] font-[500] text-gray-400">
                        {context?.userProfile?.email}
                      </span>
                    </div>
                  </div>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Link to="/my-account">
                      <MenuItem
                        className="flex gap-2 !text-[14px] !py-2"
                        onClick={handleClose}
                      >
                        <FaRegUserCircle className="!text-[18px]" /> My Account
                      </MenuItem>
                    </Link>
                    <Link to="/orders">
                      <MenuItem
                        className="flex gap-2 !text-[14px] !py-2"
                        onClick={handleClose}
                      >
                        <IoBagCheckOutline className="!text-[18px]" /> Orders
                      </MenuItem>
                    </Link>
                    <Link to="/myList">
                      <MenuItem
                        className="flex gap-2 !text-[14px] !py-2"
                        onClick={handleClose}
                      >
                        <IoIosHeartEmpty className="!text-[18px]" /> List
                      </MenuItem>
                    </Link>
                    <MenuItem
                      className="flex gap-2 !text-[14px] !py-2"
                      onClick={context.logout}
                    >
                      <RiLogoutBoxRFill className="!text-[18px]" /> Logout
                    </MenuItem>
                    <Divider />
                  </Menu>

                </>
              )}

              <li className="hidden sm:block ">
                <Link to="/compare">
                  <Tooltip title="Compare">
                    <IconButton aria-label="cart">
                      <StyledBadge badgeContent={context.compareLen} color="secondary">
                        <IoGitCompareOutline />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </Link>
              </li>
              <li className="list-none hidden sm:block ">
                <Link to="/myList">
                  <Tooltip title="Wishlist">
                    <IconButton aria-label="cart">
                      <StyledBadge badgeContent={context.wishlistLen} color="secondary">
                        <IoIosHeartEmpty />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </Link>
              </li>
              <li className="list-none">
                <Link>
                  <Tooltip title="Cart">
                    <IconButton
                      aria-label="cart"
                      onClick={() => context.setOpenCartPanel(true)}
                    >
                      <StyledBadge
                        badgeContent={context.cartLen}
                        color="secondary"
                      >
                        <LuShoppingCart />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </Link>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;
