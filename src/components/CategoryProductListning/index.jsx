import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { FaRegHeart } from "react-icons/fa6";
import { GoGitCompare } from "react-icons/go";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { MyContext } from "../../App";
import axios from "axios";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import { CiShoppingCart } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import CircularProgress from "@mui/material/CircularProgress";

const CategoryProductListning = ({ category, sortBy, priceRange, setPriceRange, selectedSubCategory, selectedThirdCategory }) => {
 

const [filteredProducts, setFilteredProducts] = useState([]);   // products after filter/sort
const [cartData, setCartData] = useState([]);                   // user cart
const [currentPage, setCurrentPage] = useState(1);              // pagination page
const [loadingStates, setLoadingStates] = useState({});         // loading per product (add to cart)
const [isCartLoading, setCartLoading] = useState(false);        // cart loading

// Context + API URL
const context = useContext(MyContext);
const url = context.AppUrl;
const token = localStorage.getItem("accessToken");

// Pagination values
const productsPerPage = 8;
const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
const startIndex = (currentPage - 1) * productsPerPage;
const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);


// -------------------------
// HELPER: normalize string
// -------------------------
const normalize = (value) => {
  if (!value) return "";
  return decodeURIComponent(String(value)).toLowerCase().trim();
};


// -------------------------
// FILTER PRODUCTS WHEN category/sub-category/priceRange CHANGE
// -------------------------
useEffect(() => {
  if (!context.allProduct?.length || !category) return;

  // Normalize category values
  const mainCategory = normalize(category);
  const subCategory = normalize(selectedSubCategory);
  const thirdCategory = normalize(selectedThirdCategory);

  // 1️⃣ Filter main category
  let result = context.allProduct.filter(
    (p) => normalize(p.catName) === mainCategory
  );

  // 2️⃣ Filter sub category (if selected)
  if (subCategory) {
    result = result.filter((p) => normalize(p.subCat) === subCategory);
  }

  // 3️⃣ Filter third category (if selected)
  if (thirdCategory) {
    result = result.filter((p) => normalize(p.thirdSubCat) === thirdCategory);
  }

  // 4️⃣ Apply sorting
  result = getSortedProduct(result, sortBy);

  // 5️⃣ Apply price range filter
  result = filterByPriceRange(result, priceRange);

  // update filtered state
  setFilteredProducts(result);
  setCurrentPage(1);
}, [
  context.allProduct,
  category,
  selectedSubCategory,
  selectedThirdCategory,
  sortBy,
  priceRange
]);


// FILTER BY PRICE RANGE
const filterByPriceRange = (products, priceRange) => {
  const [min, max] = priceRange;
  return products.filter((p) => p.price >= min && p.price <= max);
};


// SORT PRODUCTS
const getSortedProduct = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case "Sales, highest to lowest":
      return sorted.sort((a, b) => (b.sales || 0) - (a.sales || 0));

    case "Price, high to low":
      return sorted.sort((a, b) => b.price - a.price);

    case "Price, low to high":
      return sorted.sort((a, b) => a.price - b.price);

    case "Name, A to Z":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "Name, Z to A":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    default:
      return sorted; // relevance
  }
};


// GET CART DATA (IF LOGGED IN)
useEffect(() => {
  if (!token) return; // user not logged in => skip

  const fetchCart = async () => {
    setCartLoading(true);

    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartData(res.data.data || []);

    } catch (error) {
      // ignore 401/404 (normal)
    } finally {
      setCartLoading(false);
    }
  };

  fetchCart();
}, [url, token]);


// ADD TO CART
const addToCart = async (productId) => {
  setLoadingStates((prev) => ({ ...prev, [productId]: true }));

  try {
    await axios.post(
      `${url}/api/cart/create`,
      { productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // update cart locally
    setCartData((prev) => [
      ...prev,
      { productId: { _id: productId }, quantity: 1 }
    ]);

    toast.success("Added to cart");

  } catch (error) {
    toast.error("Failed to add to cart");

  } finally {
    setLoadingStates((prev) => ({ ...prev, [productId]: false }));
  }
};


// UPDATE CART QUANTITY
const updateQty = async (id, qty) => {
  setLoadingStates((prev) => ({ ...prev, [id]: true }));

  try {
    await axios.put(
      `${url}/api/cart/update-cart`,
      { productId: id, qty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCartData((prevCart) =>
      prevCart.map((item) =>
        item.productId._id === id ? { ...item, quantity: qty } : item
      )
    );

  } catch {
    toast.error("Error updating quantity");

  } finally {
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
  }
};


// WISHLIST
const addProductInWishlist = async (id, rating, price, oldPrice, brand, discount) => {
  try {
    await axios.post(
      `${url}/api/mylist/addToMyList`,
      { productId: id, rating, price, oldPrice, brand, discount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Added to wishlist");

  } catch {
    toast.error("Failed to add to wishlist");
  }
};


// PAGINATION HANDLER
const handlePageChange = (_, pageNum) => {
  setCurrentPage(pageNum);
};


  if (isCartLoading) {
    return (
      <table className="w-full border-collapse animate-pulse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 h-10 bg-gray-300"></th>
            <th className="p-3 h-10 bg-gray-300"></th>
            <th className="p-3 h-10 bg-gray-300"></th>
            <th className="p-3 h-10 bg-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {Array(8).fill().map((_, index) => (
            <tr key={index} className="border-b">
              <td className="p-3 h-12 bg-gray-300"></td>
              <td className="p-3 h-12 bg-gray-300"></td>
              <td className="p-3 h-12 bg-gray-300"></td>
              <td className="p-3 h-12 bg-gray-300"></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500 text-lg">No products found for {category}</p>
          <p className="text-gray-400 text-sm mt-2">Try selecting a different category or adjusting filters</p>
        </div>
      ) : paginatedProducts.length > 0 ? (
        paginatedProducts.map((product) => {
          const isProductInCart = cartData.some(
            (cartItem) => cartItem?.productId?._id === product?._id
          );
          const productQuantityInCart = cartData.find(
            (cartItem) => cartItem?.productId?._id === product._id
          )?.quantity;
          const isLoading = loadingStates[product._id] || false;


          return (
            <div
              key={product._id}
              className="productItem rounded-sm border-1 border-[rgba(0,0,0,0.1)] border border-gray-300 shadow-md"
            >
              <div className="group imgWrapper w-full rounded-md relative shadow-sm">
                <Link to={`/productDetails/${product?._id}`}>
                  <div className="img h-[220px] overflow-hidden relative">
                    <img src={`${product?.images[0]}`} className="w-full h-full object-cover" alt="" />
                    <img
                      src={`${product?.images[1]}`}
                      className="w-full h-full object-cover transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                      alt=""
                    />
                  </div>
                </Link>
                <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-[500]">
                  -{product?.discount}%
                </span>

                {/* Hover pr Jo 3 Icons ke liye */}
                <div className="actions absolute top-[-20px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[10px] opacity-0 group-hover:opacity-100">
                  <Button
                    onClick={() => context.getProductById(product?._id)}
                    className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary !text-black group"
                  >
                    <MdOutlineZoomOutMap className="text-[18px] text-black" />
                  </Button>
                  <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary !text-black group">
                    <GoGitCompare className="text-[18px] text-black" />
                  </Button>
                  <Button
                    onClick={() =>
                      addProductInWishlist(
                        product._id,
                        product.rating,
                        product.price,
                        product.oldPrice,
                        product.brand,
                        product.discount
                      )
                    }

                    className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary !text-black group"
                  >
                    <FaRegHeart className="text-[18px] text-black" />
                  </Button>
                </div>

              </div>
              <div className="info p-3 py-3 bg-[#ecebeb]">
                <h6 className="text-[14px] link transition-all">
                  <Link to={`/productDetails/${product?._id}`}>{product?.brand.substring(0, 8)}</Link>
                </h6>
                <h3 className="text-[13px] title font-[500] text-[#000] link transition-all mb-1">
                  <Link to={`/productDetails/${product?._id}`}>{product?.name.substring(0, 15)}...</Link>
                </h3>
                <Rating
                  name="size-small"
                  defaultValue={product?.rating}
                  size="small"
                  readOnly
                />
                <div className="flex items-center justify-between !bg-[#ecebeb]">
                  <span className="price line-through text-gray-500 text-[15px] font-[600]">
                    ₹{product?.oldPrice}
                  </span>
                  <span className="newPrice text-primary font-bold">₹{product?.price}</span>
                </div>
                {isProductInCart && productQuantityInCart > 0 ? (
                  <div className="flex items-center mt-2 w-full border border-gray-300 rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQty(product?._id, productQuantityInCart - 1)}
                      className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center"
                    >
                      <CiCircleMinus className="text-xl" />
                    </button>
                    <span className="flex-1 text-center text-lg">{productQuantityInCart}</span>
                    <button
                      onClick={() => updateQty(product?._id, productQuantityInCart + 1)}
                      className="bg-gray-900 text-white w-10 h-10 flex items-center justify-center"
                    >
                      <CiCirclePlus className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(product._id)}
                    className="btn-org sm:w-full !mt-2 flex gap-1 sm:gap-3"
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                      </>
                    ) : (
                      <>
                        <CiShoppingCart className="hidden sm:block text-[12px] sm:text-2xl" />
                        Add to Cart
                      </>
                    )}

                  </Button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">Page {currentPage} is empty. Try going to page 1.</p>
        </div>
      )}
      {filteredProducts.length > 0 && totalPages > 1 && (
        <div className="col-span-full flex justify-center mt-6">
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </div>
      )}
    </>
  );
};

export default CategoryProductListning;