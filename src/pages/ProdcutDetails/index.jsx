import React, { useContext, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import ProductZoom from "../../components/productZoom";
import { useEffect } from "react";
import { Button } from "@mui/material";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import ProductsSlider from "../../components/ProductsSlider";
import ProductDetailsComponents from "../../components/ProductsDetails";
import axios from "axios";
import { MyContext } from "../../App";
import toast, { Toaster } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
const ProductDetails = () => {
  const context = useContext(MyContext);
  const url = context.AppUrl;
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");
  
  const [allReview, setAllReview] = useState([]);
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [totalReview, setTotalReview] = useState(0);
  const [loading, setLoading] = useState(false);
  const [productActionIndex, setProActionIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  const setProductActionIndex = (index) => {
    setProActionIndex(index);
    console.log(productActionIndex);
  };

  // First useEffect - fetch product
  useEffect(() => {
    window.scrollTo(0, 0);
    const getProductById = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${url}/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setData(response.data.product);
        }
      } catch (error) {
        setError(error);
        console.log(error);
        if (error.response) {
          console.error("Response error:", error.response);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getProductById();
  }, [id, url, token]);

  // Second useEffect - fetch reviews
  useEffect(() => {
    const getAllReviewFromDb = async () => {
      try {
        const response = await axios.get(
          `${url}/api/review/product-reviews/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setAllReview(response.data);
          setTotalReview(response.data.length);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAllReviewFromDb();
  }, [id, url, token]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      alert("Please write a review before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/review/create-review`,
        { productId: id, comment: review, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Your review has been saved successfully!");
        setReview("");
        setRating(4);
        setAllReview((prevReviews) => [
          ...prevReviews,
          {
            productId: id,
            comment: review,
            rating,
            createdAt: new Date().toISOString(),
          },
        ]);
        setTotalReview((prev) => prev + 1);
      } else {
        alert("Failed to submit the review. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        alert(
          `Error: ${error.response.data.message || "Something went wrong."}`
        );
      } else if (error.request) {
        alert("Network error. Please check your internet connection.");
      } else {
        console.error("Error:", error.message);
        alert("An unexpected error occurred.");
      }
    }
  };

  // Conditional rendering AFTER all hooks
  if (error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error.response?.data?.message || error.message || "This product does not exist or has been removed."}</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Go to Home
        </Link>
      </div>
    );
  }

  if (!loading && !data) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you are looking for is not available.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      <div className="py-2 sm:py-5">
        <div className="sm:container ">
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
              Fashion
            </Link>
          </Breadcrumbs>
        </div>
      </div>
      <section className="bg-white py-2 sm:pl-10">
        <div className="block sm:hidden">
          <div className="container flex flex-col gap-4">
            <div className="productZoomContainer w-full h-[350px] overflow-hidden">
              {data && <ProductZoom data={data} />}
            </div>
            <div className="productContent w-full">
              {data && <ProductDetailsComponents data={data} />}
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <div className=" container flex gap-8">
            <div className="productZoomContainer sm:w-[40%] sm:h-[70vh] overflow-hidden">
              {data && <ProductZoom data={data} />}
            </div>
            <div className="productContent  sm:w-[60%]">
              {data && (
                <ProductDetailsComponents data={data} length={totalReview} />
              )}
            </div>
          </div>
        </div>

        <div className="container pt-3 sm:pt-10">
          <div className="flex items-center justify-between sm:justify-start mt-6 sm:mt-2 gap-8 mb-5 ">
            <span
              onClick={() => setActiveTab(0)}
              className={`link text-[18px] cursor-pointer font-[500] transition ${
                activeTab === 0 ? "text-primary" : ""
              }`}
            >
              Description
            </span>
            <span
              onClick={() => setActiveTab(1)}
              className={`link text-[18px] cursor-pointer font-[500] transition ${
                activeTab === 1 ? "text-primary" : ""
              }`}
            >
              Product
            </span>
            <span
              onClick={() => setActiveTab(2)}
              className={`link text-[18px] cursor-pointer font-[500] transition ${
                activeTab === 2 ? "text-primary" : ""
              }`}
            >
              Review (5)
            </span>
          </div>

          {activeTab === 0 && (
            <div className="shadow-md w-full p-5 rounded-md">
              <p>
                Studio Design' PolyFaune collection features classic products
                with colorful patterns, inspired by the traditional japanese
                origamis. To wear with a chino or jeans. The sublimation textile
                printing process provides an exceptional color rendering and a
                color, guaranteed overtime.
              </p>
              <h4 className="font-[600] py-2 text-[14px]">
                Packaging & Delivery
              </h4>
              <p>
                Less lion goodness that euphemistically robin expeditiously
                bluebird smugly scratched far while thus cackled sheepishly
                rigid after due one assenting regarding censorious while
                occasional or this more crane went more as this less much amid
                overhung anathematic because much held one exuberantly sheep
                goodness so where rat wry well concomitantly.
              </p>
              <h4 className="font-[600] py-2 text-[14px]">Suggested Use</h4>
              <p>
                Scallop or far crud plain remarkably far by thus far iguana lewd
                precociously and and less rattlesnake contrary caustic wow this
                near alas and next and pled the yikes articulate about as less
                cackled dalmatian in much less well jeering for the thanks
                blindly sentimental whimpered less across objectively fanciful
                grimaced wildly some wow and rose jeepers outgrew lugubrious
                luridly irrationally attractively dachshund.
              </p>
            </div>
          )}
          {activeTab === 1 && (
            <div className="shadow-md w-full p-5 rounded-md">
              <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
                  <thead class="text-xs uppercase bg-gray-100 text-gray-700">
                    <tr>
                      <th scope="col" class="px-6 py-3 border-b">
                        Stand Up
                      </th>
                      <th scope="col" class="px-6 py-3 border-b">
                        Folded (w/o wheels)
                      </th>
                      <th scope="col" class="px-6 py-3 border-b">
                        Folded (w/ wheels)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white border-b border-gray-200">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        35″L x 24″W x 37-45″H(front to back wheel)
                      </th>
                      <td class="px-6 py-4">32.5″L x 18.5″W x 16.5″H</td>
                      <td class="px-6 py-4">32.5″L x 24″W x 18.5″H</td>
                    </tr>
                    <tr class="bg-gray-50 border-b border-gray-200">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Microsoft Surface Pro
                      </th>
                      <td class="px-6 py-4">White</td>
                      <td class="px-6 py-4">Laptop PC</td>
                    </tr>
                    <tr class="bg-white">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Magic Mouse 2
                      </th>
                      <td class="px-6 py-4">Black</td>
                      <td class="px-6 py-4">Accessories</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className="shadow-md sm:w-[80%] w-[100%] p-5 rounded-md">
              <div className="productReviewContainer w-full">
                <h2 className="text-[16px] font-[600] mb-2">
                  Customer questions & answers
                </h2>

                <div className="w-full max-h-[350px] overflow-y-auto">
                  {allReview.map((item, indx) => (
                    <div
                      key={indx}
                      className="review w-full flex items-center justify-between mb-3 border-b border-gray-300 "
                    >
                      <div className="w-[60%] flex items-center gap-2">
                        <div className="img h-[60px] w-[60px] mt-2 overflow-hidden rounded-full">
                          <img
                            src="https://www.shutterstock.com/image-photo/paris-france-june-3-2017-260nw-657978760.jpg"
                            className="w-full"
                            alt="User"
                          />
                        </div>
                        <div className="w-[80%]">
                          <h4 className="text-[16px] font-[500] mt-3">
                            {item.userId?.name}
                          </h4>
                          <h5 className="text-[12px] text-gray-400 font-[500]">
                            2025-09-29
                          </h5>
                          <p className="text-[12px] font-[400] mt-2 mb-4">
                            {item.comment}
                          </p>
                        </div>
                      </div>
                      <Rating name="size-small" value={item.rating} readOnly />
                    </div>
                  ))}

                  <br />
                </div>
                <div className="reviewForm bg-[#fafafa] p-4 mt-1 ">
                  <h2 className="text-[18px] font-[600] mb-3 ">Add a review</h2>
                  <form onSubmit={handleSubmitReview}>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Write a Review"
                      className="w-full mb-5 "
                      multiline
                      rows={5}
                      variant="filled"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <br />
                    <br />
                    <Rating
                      name="size-small"
                      value={rating}
                      onChange={(event, newValue) => setRating(newValue)}
                    />
                    <div className="flex items-center justify-center ">
                      <Button
                        type="submit"
                        className="btn-org transition-all duration-300 ease-in-out  "
                      >
                        Submit Review
                      </Button>{" "}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="container ">
          <h2 className="text-[20px] font-[600] pb-1 mt-8">Related Product</h2>
        </div>
        <ProductsSlider items={6} selectedTab={data?.catName} />
        {/* <div className="container">

        </div> */}
      </section>
    </>
  );
};

export default ProductDetails;
