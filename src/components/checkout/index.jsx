import { Button, CircularProgress, Typography } from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { MyContext } from "../../App";
import { IoMdClose } from "react-icons/io";
import AddressForm from "../UserAddress";

const Checkout = () => {
  const [cartData, setCartData] = useState([]);
  const [totalMrp, setTotalMrp] = useState(0);
  const [totalSellingPrice, setTotalSellingPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const addressFormRef = useRef(null);

  const PLATFORM_CHARGE = 100;
  const SHIPPING_CHARGE = 100;
  const token = localStorage.getItem("accessToken");
  const context = useContext(MyContext);
  const url = context.AppUrl;

  const finalAmount = Math.round(
    totalSellingPrice + PLATFORM_CHARGE + SHIPPING_CHARGE
  );

  useEffect(() => {
    const getCartData = async () => {
      try {
        if (!token) {
          setCartData([]);
          return;
        }
        const response = await axios.get(`${url}/api/cart/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setCartData(response.data.data);
        }
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          setCartData([]);
          setError(null);
        } else {
          console.error("Error fetching cart data:", error);
          setError("Failed to fetch cart data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    getCartData();
  }, [url, token]);


useEffect(() => {
  if (cartData.length > 0) {
    const mrp = cartData.reduce(
      (acc, item) => acc + (item.productId.oldPrice * item.quantity),
      0
    );

    const selling = cartData.reduce(
      (acc, item) => acc + (item.productId.price * item.quantity),
      0
    );

    setTotalMrp(mrp);
    setTotalSellingPrice(selling);
  }
}, [cartData]);
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaymentLoading(true);

    try {
      if (showAddressForm && addressFormRef.current) {
        const isFormValid = await addressFormRef.current.submitForm();
        if (!isFormValid) {
          alert("Please fill out the address form correctly.");
          setPaymentLoading(false);
          return;
        }
      }

      if (!deliveryAddress) {
        alert("Please add a delivery address before proceeding.");
        setPaymentLoading(false);
        return;
      }

      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setPaymentLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${url}/api/order/makeOrder`,
        {
          amount: totalSellingPrice,
          items: cartData.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            oldPrice: item.productId.oldPrice,
            quantity: item.quantity,
            total: item.productId.price * item.quantity,
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_RmCn1GmKVs0hms",
        amount: data.amount,
        currency: "INR",
        name: "Ganesh Store",

        description: "Thank you for shopping with us",
        order_id: data.id,
        handler: async (response) => {
          try {
            const deliveryId = deliveryAddress?.data?._id || deliveryAddress?._id;
            const cartPayload = cartData.map(item => ({
              productId: item?.productId?._id,
              quantity: item?.quantity || 0,
            })).filter(i => i.productId);
            const totalQty = cartData.reduce((sum, i) => sum + (i?.quantity || 0), 0);

            await axios.post(`${url}/api/order/verify`, {
              amount: totalSellingPrice,
              Quantity: totalQty,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartData: cartPayload,
              delivery_address: deliveryId,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            alert("Payment Successful!");
          } catch (error) {
            console.log(error);
            alert("Payment verification failed!");
          }
        },

        prefill: {
          name: "Ganesh",
          email: `${localStorage.getItem("email")}`,
          contact: "8003779983",
        },
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during payment!");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`${url}/api/cart/daleteCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { _id: id },
      });
      if (response.status === 200) {
        setCartData(cartData.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  const handleAddressSubmit = (address) => {
    setDeliveryAddress(address);
    setShowAddressForm(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items Section */}
          <div className="w-full lg:w-[65%]">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Shopping Cart ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
                </h2>
              </div>

              <div className="max-h-[600px] overflow-y-auto p-4">
                {cartData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col sm:flex-row gap-4 p-4 mb-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={item.productId?.images?.[0] || "/path/to/default-image.jpg"}
                        alt={item.productId?.name || "Product Image"}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="pr-8">
                        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                          {item.productId.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.productId.description}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Sold by: <span className="font-medium">Ganesh Suthar</span>
                        </p>

                        {/* Price and Quantity */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{item.productId.price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.productId.oldPrice}
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {item.productId.discount}% off
                          </span>
                          <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-red-50 text-red-600 rounded font-medium">
                            Not Returnable
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      onClick={() => handleDelete(item._id)}
                      className="!absolute !top-2 !right-2 !min-w-0 !w-8 !h-8 !rounded-full !bg-gray-100 hover:!bg-red-50 !text-gray-600 hover:!text-red-600 !transition-colors"
                    >
                      <IoMdClose className="text-xl" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-4 space-y-4">
              {/* Price Details Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Price Details</h2>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Total MRP</span>
                    <span>₹{totalMrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{(totalMrp - totalSellingPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Platform Fee</span>
                    <span>₹{PLATFORM_CHARGE}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping Charges</span>
                    <span className="text-green-600">₹{SHIPPING_CHARGE}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">₹{finalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    className="!w-full !bg-orange-500 hover:!bg-orange-600 !text-white !font-semibold !py-3 !rounded-lg !mt-4 !transition-colors"
                    onClick={handlePayment}
                    disabled={paymentLoading || !deliveryAddress}
                  >
                    {paymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <CircularProgress size={20} className="!text-white" />
                        Processing...
                      </span>
                    ) : (
                      "PLACE ORDER"
                    )}
                  </Button>

                  {!deliveryAddress && (
                    <p className="text-xs text-red-600 text-center mt-2">
                      Please add delivery address to proceed
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Delivery Address</h2>
                </div>

                <div className="p-4">
                  {!showAddressForm && deliveryAddress && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-semibold text-gray-800 mb-2">Selected Address:</p>
                      <p className="text-sm text-gray-700">
                        {deliveryAddress.data?.address_line || deliveryAddress.address_line}
                      </p>
                      <p className="text-sm text-gray-700">
                        {deliveryAddress.data?.city || deliveryAddress.city}, {deliveryAddress.data?.state || deliveryAddress.state} - {deliveryAddress.data?.pincode || deliveryAddress.pincode}
                      </p>
                    </div>
                  )}

                  <Button
                    className="!w-full !bg-blue-500 hover:!bg-blue-600 !text-white !font-semibold !py-2 !rounded-lg !transition-colors"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                  >
                    {showAddressForm
                      ? "Hide Address Form"
                      : deliveryAddress
                        ? "Change Address"
                        : "Add Delivery Address"}
                  </Button>

                  {showAddressForm && (
                    <div className="mt-4">
                      <AddressForm
                        ref={addressFormRef}
                        onSubmit={handleAddressSubmit}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
