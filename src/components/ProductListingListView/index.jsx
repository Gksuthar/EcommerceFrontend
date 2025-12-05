import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { FaRegHeart } from "react-icons/fa6";
import { GoGitCompare } from "react-icons/go";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { CiShoppingCart, CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { MyContext } from "../../App";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";

const ProductItemListView = ({
  category,
  sortBy,
  priceRange,
  setPriceRange,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingStates, setLoadingStates] = useState({}); 
  const [isCartLoading, setCartLoading] = useState(false);
  const [cartData, setCartData] = useState([]);

  const context = useContext(MyContext);

  const url = context.AppUrl;
  const productsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
  const token = localStorage.getItem("accessToken");

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (context.allProduct && category) {
      let result = context.allProduct.filter((pro) =>
        Array.isArray(category)
          ? category.includes(pro.catName)
          : pro.catName === category
      );
      result = getSortedProduct(result, sortBy);
      result = getShortbyPriceRange(result, priceRange);
      setFilteredProducts(result);
    } else {
      setFilteredProducts([]);
    }
  }, [category, context.allProduct, sortBy, priceRange]);

  const getShortbyPriceRange = (products, priceRange) => {
    return products.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );
  };

  useEffect(() => {
    const getCartData = async () => {
      if (!token) {
        setCartLoading(false);
        return;
      }
      setCartLoading(true);
      try {
        const response = await axios.get(`${url}/api/cart/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setCartData(response.data.data);
        }
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          // Empty cart or unauthorized: treat as empty, don't spam console
          setCartData([]);
        } else {
          console.error("Error fetching cart data: " + error.message);
        }
      } finally {
        setCartLoading(false);
      }
    };
    getCartData();
  }, [url, token]);

  const getSortedProduct = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case "Relevance":
        return sorted;
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
        return sorted;
    }
  };

  const addProductInWichList = async (
    id,
    rating,
    price,
    oldPrice,
    brand,
    discount
  ) => {
    try {
      const response = await axios.post(
        `${url}/api/mylist/addToMyList`,
        { productId: id, rating, price, oldPrice, brand, discount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        toast.success("The product is added to wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to wishlist");
    }
  };

  const addToCart = async (id, quantity = 1) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], add: true },
    }));
    try {
      const response = await axios.post(
        `${url}/api/cart/create`,
        { productId: id, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        const updatedCart = await axios.get(`${url}/api/cart/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartData(updatedCart.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], add: false },
      }));
    }
  };

  const updateQty = async (id, qty, actionType) => {
    if (qty < 0) return; // Prevent negative quantity
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], [actionType]: true },
    }));
    try {
      const response = await axios.put(
        `${url}/api/cart/update-cart`,
        { productId: id, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setCartData((prevCart) =>
          prevCart.map((cartItem) =>
            cartItem.productId._id === id
              ? { ...cartItem, quantity: qty }
              : cartItem
          )
        );
        toast.success("Quantity updated successfully");
      }
    } catch (error) {
      console.error("Error updating quantity: ", error);
      toast.error("Failed to update quantity");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], [actionType]: false },
      }));
    }
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
          {Array(8)
            .fill()
            .map((_, index) => (
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
      <Toaster />
      {paginatedProducts.length > 0 ? (
        paginatedProducts.map((item, indx) => {
          const isProductInCart = cartData.some(
            (cartItem) => cartItem?.productId?._id === item._id
          );
          const productQuantityInCart = cartData.find(
            (cartItem) => cartItem?.productId?._id === item._id
          )?.quantity || 0;
          const isAddLoading = loadingStates[item._id]?.add || false;
          const isPlusLoading = loadingStates[item._id]?.plus || false;
          const isMinusLoading = loadingStates[item._id]?.minus || false;

          return (
            <div
              key={indx}
              className="productItem rounded-sm border border-[rgba(0,0,0,0.1)] shadow-md flex flex-col md:flex-row h-auto w-full mb-4"
            >
              <div className="group imgWrapper w-full md:w-[18%] h-[200px] md:h-auto rounded-md relative overflow-hidden">
                <Link to={`/productDetails/${item._id}`}>
                  <div className="h-full md:h-[200px] w-full relative">
                    <img
                      src={item.images[0]}
                      className="h-full w-full object-contain"
                      alt={item.name}
                    />
                    <img
                      src={item.images[1]}
                      className="h-full w-full object-contain transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                      alt={item.name}
                    />
                  </div>
                </Link>
                <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-[500]">
                  -${item.discount}
                </span>

                {/* 3 icon js image card pr ho h vo  */}
                <div className="actions absolute top-[-20px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[10px] opacity-0 group-hover:opacity-100">
                  <Button
                    onClick={() => context.getProductById(item._id)}
                    className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary !text-black"
                  >
                    <MdOutlineZoomOutMap className="text-[18px]" />
                  </Button>
                  <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary !text-black">
                    <GoGitCompare className="text-[18px]" />
                  </Button>
                  <Button
                    onClick={() =>
                      addProductInWichList(
                        item?._id,
                        item?.rating,
                        item?.price,
                        item?.oldPrice,
                        item?.brand,
                        item?.discount
                      )
                    }
                    className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary !text-black"
                  >
                    <FaRegHeart className="text-[18px]" />
                  </Button>
                </div>

              </div>

              <div className="info w-full md:w-[82%] p-3 bg-[#ecebeb] flex flex-col">
                <h6 className="link transction-all text-[15px] md:text-[15px] text-left">
                  <Link to={`/productDetails/${item._id}`}>
                    {item.name.substring(0, 100)}...
                  </Link>
                </h6>
                
                <Rating
                  name="size-small"
                  defaultValue={item.rating}
                  size="small"
                  className="mt-2"
                  readOnly
                />
                <div className="mt-2 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 !bg-[#ecebeb]">
                  <span className="price line-through text-gray-500 text-[15px] font-[600]">
                    ₹ {item.oldPrice}
                  </span>
                  <span className="newPrice text-primary font-bold">
                    ₹ {item.price}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 mb-3 hidden md:block">
                  {item.description.substring(0, 250)}...
                </p>
                <div className="mt-3 !bg-[#ecebeb]">
                  {isProductInCart && productQuantityInCart > 0 ? (
                    <div className="flex items-center mt-2 w-full border border-gray-300 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          updateQty(item._id, productQuantityInCart - 1, "minus")
                        }
                        className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                        disabled={isMinusLoading || productQuantityInCart <= 0}
                      >
                        {isMinusLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CiCircleMinus className="text-xl" />
                        )}
                      </button>
                      <span className="flex-1 text-center text-lg">
                        {productQuantityInCart}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item._id, productQuantityInCart + 1, "plus")
                        }
                        className="bg-gray-900 text-white w-10 h-10 flex items-center justify-center hover:bg-gray-800 disabled:opacity-50"
                        disabled={isPlusLoading}
                      >
                        {isPlusLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CiCirclePlus className="text-xl" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(item._id)}
                      className="btn-org hover:!bg-black transition-all duration-300 flex gap-1 w-full md:w-auto justify-center"
                      disabled={isAddLoading}
                    >
                      {isAddLoading ? (
                        <CircularProgress size={20} color="inherit" />
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
            </div>
          );
        })
      ) : (
        <p>No products found</p>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-10">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default ProductItemListView;