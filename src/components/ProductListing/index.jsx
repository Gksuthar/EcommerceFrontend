import React, { useState } from "react";
import SidebarListning from "../SidebarListning";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Button, Menu, MenuItem, Drawer } from "@mui/material";
import { IoGrid } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io"; // Changed to IoMdMenu as per your example
import ProductItemListView from "../ProductListingListView";
import CategoryProductListning from "../CategoryProductListning";
import { useParams } from "react-router-dom";
import MobileNav from "../Navigation/MobileNav";
import { useContext } from "react";
import { MyContext } from "../../App";

const ProductListing = () => {
  const { category } = useParams();
  const context = useContext(MyContext);
  const [selectedCategory, setSelectedCategory] = useState(category || []);
  const [selectedSubCategory, setSelectedSubCategory] = useState();
  const [itmView, setItmView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("Relevance");
  const [priceRange, setPriceRange] = useState([100, 200000]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    setAnchorEl(null);
  };

  return (
    <section className="py-4 bg-gray-100 min-h-screen pb-0">
      <div className="container mx-auto px-4">
        <Breadcrumbs aria-label="breadcrumb" className="mb-4">
          <Link
            underline="hover"
            color="inherit"
            href="/"
            className="text-blue-600 hover:underline"
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            className="text-blue-600 hover:underline"
          >
            {selectedCategory}
          </Link>
        </Breadcrumbs>

        <div className="bg-white p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4">
          <div className="hidden sm:block w-full md:w-[20%] bg-white border-r border-gray-300 min-h-[80vh] p-3">
            <SidebarListning
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedSubCategory={selectedSubCategory}
            />
          </div>

          <div className="w-full md:w-[80%] py-3">

            <div className="bg-[#f1f1f1] p-3 mb-4 rounded-md flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 itemViewAction">
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-md bg-gray-200 hover:bg-gray-300 ${
                    itmView === "grid" && "active"
                  }`}
                  onClick={() => setItmView("grid")}
                >
                  <IoGrid className="text-gray-600 text-[18px]" />
                </Button>
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-md bg-gray-200 hover:bg-gray-300 ${
                    itmView === "list" && "active"
                  }`}
                  onClick={() => setItmView("list")}
                >
                  <IoMdMenu className="text-gray-600 text-[20px]" />
                </Button>
                <span className="text-[14px] font-medium text-gray-700 pl-3">
                  There are {context.allProduct?.length || 0} Products
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <span className="text-[14px] font-medium text-gray-700">
                  Sort By:
                </span>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!border !border-gray-400 !text-[12px] !text-[#000] !bg-white !px-4 !py-1 !rounded-md !hover:bg-gray-100"
                >
                  {sortBy} ▼
                </Button>
                
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    className="!text-[12px] !capitalize"
                    onClick={() => handleSortSelect("Relevance")}
                  >
                    Relevance
                  </MenuItem>
                  <MenuItem
                    className="!text-[12px] !capitalize"
                    onClick={() => handleSortSelect("Sales, highest to lowest")}
                  >
                    Sales, highest to lowest
                  </MenuItem>
                  <MenuItem
                    className="!text-[12px] !capitalize"
                    onClick={() => handleSortSelect("Name, A to Z")}
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    className="!text-[12px] !capitalize"
                    onClick={() => handleSortSelect("Name, Z to A")}
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    className="!text-[12px] !capitalize"
                    onClick={() => handleSortSelect("Price, low to high")}
                  >
                    Price, low to high
                  </MenuItem>
                  <MenuItem
                    className="!text-[12px] !capitalize"
                    onClick={() => handleSortSelect("Price, high to low")}
                  >
                    Price, high to low
                  </MenuItem>
                </Menu>
              </div>

            </div>
            

            <div
              className={`grid ${
                itmView === "grid"
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-1"
              } gap-4`}
            >
              {itmView === "grid" ? (
                <CategoryProductListning
                  category={selectedCategory}
                  sortBy={sortBy}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedSubCategory={selectedSubCategory}
                />
              ) : (
                <ProductItemListView
                  category={selectedCategory}
                  sortBy={sortBy}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedSubCategory={selectedSubCategory}
                />
              )}
            </div>
          </div>
        </div>


        <Drawer
          anchor="bottom"
          open={context.drawerOpen}
          onClose={context.toggleDrawer(false)}
          sx={{ "& .MuiDrawer-paper": { height: "70vh", padding: "10px" } }}
          >
          <SidebarListning
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            setSelectedSubCategory={setSelectedSubCategory}
            selectedSubCategory={selectedSubCategory}
            />
        </Drawer>

      </div>
    </section>
  );
};

export default ProductListing;