import React, { useContext, useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./style.css";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { MyContext } from "../../App";
import axios from "axios";
const SidebarListning = ({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  setSelectedSubCategory,
  selectedSubCategory,
  selectedThirdCategory,
  setSelectedThirdCategory,
}) => {
  const context = useContext(MyContext);
  const url = context.AppUrl;
  const [categoryData, setCategoryData] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdCategories, setThirdCategories] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${url}/api/routerCategory/`);
        if (response.status === 200) {
          const categories = response.data.data || [];
          setCategoryData(categories);
          const selectedCat = categories.find(
            (item) => item.name === selectedCategory && item.children
          );
          const filteredSubCategories= selectedCat?.children || [];
          setSubCategories(filteredSubCategories);
          // if a subcategory is selected, attempt to set third level options
          if (selectedSubCategory) {
            const selectedSub = filteredSubCategories.find((s) => s.name === selectedSubCategory);
            setThirdCategories(selectedSub?.children || []);
          } else {
            setThirdCategories([]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, [setSelectedCategory, selectedCategory, selectedSubCategory, url]);

  useEffect(() => {
    // update thirdCategories when selectedSubCategory changes
    if (!selectedSubCategory) {
      setThirdCategories([]);
      return;
    }
    const parent = categoryData.find((item) => item.name === selectedCategory);
    const subs = parent?.children || [];
    const selectedSub = subs.find((s) => s.name === selectedSubCategory);
    setThirdCategories(selectedSub?.children || []);
    
  }, [selectedSubCategory, categoryData, selectedCategory]);

  const handleSubCategoryChange = (subCategoryName, isChecked) => {
    setSelectedSubCategory(isChecked ? subCategoryName : "");
  };
  return (
    <aside className="sidebar-listning py-6 px-4 rounded-lg shadow-lg bg-white">
      <h1 className="border-b pb-2 text-[18px] font-[600] mb-1">Filter By</h1>

      <div className="box mb-4">
        <h3 className="mb-1 text-sm font-semibold text-black ml-2 mt-4 pb-2">
          Availability
        </h3>
        <div className="scroll px-2">
          <FormGroup>
            {["Available", "In stock", "Not available"].map(
              (category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between group transition-all"
                >
                  <FormControlLabel
                    className="checkbox-label link"
                    control={<Checkbox size="small" />}
                    label={category}
                  />
                  <span className="text-gray-600 text-[14px] group-hover:text-red-600 font-medium transition-colors">
                    (1)
                  </span>
                </div>
              )
            )}
          </FormGroup>
        </div>
      </div>

      <div className="box mt-4">
        <h3 className="mb-1 text-sm font-semibold text-black ml-2 mt-4 pb-2">
          Filter By Price
        </h3>
        <RangeSlider
          min={0}
          value={priceRange}
          max={200000}
          onInput={(value) => setPriceRange(value)}
          step={1000}
        />

        <div className="flex justify-between items-center pt-2 pb-2 priceRange px-4">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
            From:{" "}
            <strong className="text-[11px] text-black font-semibold">
              Rs: {priceRange[0]}
            </strong>
          </span>
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
            To:{" "}
            <strong className="text-[11px] text-black font-semibold">
              Rs: {priceRange[1]}
            </strong>
          </span>
        </div>
      </div>

      <div className="box mb-4 mt-4">
        <h3 className="mb-1 text-sm font-semibold text-black ml-2 pb-2">
          Categories
        </h3>
        <div className="scroll px-2">
          <FormGroup>
            {context.categoryData?.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between group transition-all"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedCategory === category.name}
                      onChange={(e) =>
                        setSelectedCategory(
                          e.target.checked ? category.name : ""
                        )
                      }
                    />
                  }
                  label={category.name}
                />
                <span className="text-gray-600 text-[14px] group-hover:text-red-600 font-medium transition-colors">
                  (1)
                </span>
              </div>
            ))}
          </FormGroup>
        </div>
      </div>

      <div className="box mb-4">
        <h3 className="mb-1 text-sm font-semibold text-black ml-2 pb-2">
          Sub Categories
        </h3>
        <div className="scroll px-2">
          <FormGroup>
            {subCategories ? (
              subCategories?.length > 0 ? (
                subCategories.map((subCategory, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group transition-all"
                  >
                    <FormControlLabel
                      className="checkbox-label link"
                      control={
                        <Checkbox 
                          size="small"
                          checked={selectedSubCategory === subCategory.name}
                          onChange={(e) =>
                            handleSubCategoryChange(subCategory.name, e.target.checked)
                          }                      />}
                      label={subCategory.name}
                    />
                    <span className="text-gray-600 text-[14px] group-hover:text-red-600 font-medium transition-colors">
                      (1)
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No subcategories available for this category.
                </p>
              )
            ) : (
              <p className="text-gray-500 text-sm">
                Please select a category to view subcategories.
              </p>
            )}
          </FormGroup>
        </div>
      </div>

      <div className="box mb-4">
        <h3 className="mb-1 text-sm font-semibold text-black ml-2 pb-2">
          Third-level Categories
        </h3>
        <div className="scroll px-2">
          <FormGroup>
            {thirdCategories ? (
              thirdCategories.length > 0 ? (
                thirdCategories.map((thirdCat, index) => (
                  <div key={index} className="flex items-center justify-between group transition-all">
                    <FormControlLabel
                      className="checkbox-label link"
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedThirdCategory === thirdCat.name}
                          onChange={(e) => setSelectedThirdCategory(e.target.checked ? thirdCat.name : "")}
                        />
                      }
                      label={thirdCat.name}
                    />
                    <span className="text-gray-600 text-[14px] group-hover:text-red-600 font-medium transition-colors">(1)</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No third-level categories available for this subcategory.</p>
              )
            ) : (
              <p className="text-gray-500 text-sm">Please select a subcategory to view third-level categories.</p>
            )}
          </FormGroup>
        </div>
      </div>
    </aside>
  );
};

export default SidebarListning;
