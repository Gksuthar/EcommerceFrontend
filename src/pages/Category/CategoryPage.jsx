import React, { useState, useEffect } from "react";
import SidebarListning from "../../components/SidebarListning";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Button, Menu, MenuItem, Drawer } from "@mui/material";
import { IoGrid } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import ProductItemListView from "../../components/ProductListingListView";
import CategoryProductListning from "../../components/CategoryProductListning";
import { useParams } from "react-router-dom";
import MobileNav from "../../components/Navigation/MobileNav";
import { useContext } from "react";
import { MyContext } from "../../App";

const CategoryPage = () => {
  const params = useParams();
  const { main, sub, third } = params;
  const context = useContext(MyContext);
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

  // Determine category prop for CategoryProductListning
  // category prop expects either string (catName) or array
  const [selectedCategory, setSelectedCategory] = useState(main || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(sub || "");
  const [selectedThirdCategory, setSelectedThirdCategory] = useState(third || "");

  useEffect(() => {
    // decode route params (they may be URI encoded) and wait for them explicitly
    setSelectedCategory(main ? decodeURIComponent(main) : "");
    setSelectedSubCategory(sub ? decodeURIComponent(sub) : "");
    setSelectedThirdCategory(third ? decodeURIComponent(third) : "");
  }, [main, sub, third]);

  return (<></>
  );
};

export default CategoryPage;
