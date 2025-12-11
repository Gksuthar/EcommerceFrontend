import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

// Centralized App Context
const MyContext = createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const AppUrl = import.meta.env.VITE_API_URL;

  // Global UI state
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  // Auth/User
  const [isLogin, setIsLogin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Catalog/Product
  const [allProduct, setAllProduct] = useState([]);
  const [allFeatureProduct, setAllFeatureProduct] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Category
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [thirdSubCategory, setThirdSubCategory] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [loadThirdCat, setLoadThirdCat] = useState(false);

  // Misc
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [search, setSearch] = useState("");
  const [cartLen, setCartLen] = useState(0);
  const [wishlistLen, setWishlistLen] = useState(0);
  const [compareLen, setCompareLen] = useState(0);

  // Effects: products + featured
  useEffect(() => {
    const getAllProductCategory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${AppUrl}/api/product?page=1&perPage=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const products = response.data.products || [];
          setAllProduct(products);
          setOriginalProducts(products);
          setAllFeatureProduct(products.filter((item) => item.isFeatured));
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getAllProductCategory();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [AppUrl]);

  // Effects: search filter
  useEffect(() => {
    try {
      const filtered = originalProducts.filter((item) =>
        item.brand?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
      setAllProduct(filtered);
    } catch (error) {
      console.error("Search filter error:", error);
    }
  }, [search, originalProducts]);

  // Effects: third-level category
  useEffect(() => {
    if (activeSubCategory) {
      setThirdSubCategory(activeSubCategory.children || []);
    }
  }, [activeSubCategory]);

  // Effects: wishlist count
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && isLogin) {
      const fetchWishlistCount = async () => {
        try {
          const response = await axios.get(`${AppUrl}/api/myList/getMyList`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setWishlistLen(response.data.data?.length || 0);
          }
        } catch (error) {
          // Handle empty wishlist or errors gracefully
          if (error.response?.status === 404 || error.response?.status === 200) {
            setWishlistLen(0);
          } else {
            console.error("Wishlist fetch error:", error);
          }
        }
      };
      fetchWishlistCount();
    } else {
      setWishlistLen(0);
      setCompareLen(0);
    }
  }, [isLogin, AppUrl]);

  // Effects: user details
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLogin(true);
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`${AppUrl}/api/user/user-details`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (response.status === 200) {
            setUserProfile(response.data.data);
          }
        } catch (error) {
          console.error("User details fetch error:", error);
        }
      };
      fetchUserDetails();
    } else {
      setIsLogin(false);
    }
  }, [isLogin, AppUrl]);

  // Effects: categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${AppUrl}/api/routerCategory/`);
        if (response.status === 200) {
          setCategoryData(response.data.data);
          console.log(
            "[DEBUG] Fetched categories:",
            Array.isArray(response.data.data) ? response.data.data.length : typeof response.data.data,
            response.data.data
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, [AppUrl]);

  // Actions
  const getProductById = useCallback(async (id) => {
    try {
      setOpenProductDetailsModal(true);
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${AppUrl}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setData(response.data.product);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [AppUrl]);

  const handleOpenProductDetailsModal = useCallback(() => setOpenProductDetailsModal(true), []);
  const handleCloseProductDetailsModal = useCallback(() => setOpenProductDetailsModal(false), []);

  const toggleDrawer = useCallback((open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  }, []);

  const openSidebarFunction = useCallback(() => setIsOpenSidebar((prev) => !prev), []);

  const openAlertBox = useCallback((status, msg) => {
    if (status === "success") toast.success(msg);
    if (status === "error") toast.error(msg);
  }, []);

  const toggleCategory = useCallback(async (categoryId) => {
    setOpenCategoryId((prev) => (prev === categoryId ? null : categoryId));
    try {
      const response = await axios.get(`${AppUrl}/api/routerCategory/`);
      if (response.status === 200) {
        const selectedCategory = response.data.data.find((item) => item._id === categoryId);
        setSubCategory(selectedCategory?.children || []);
      }
    } catch (error) {
      console.error("Category toggle error:", error);
    }
  }, [AppUrl]);

  const downloadPDF = useCallback((orderData) => {
    if (!orderData) {
      toast.error("Order data not available!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("GANESH STORE", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your Trusted E-Commerce Partner", pageWidth / 2, 27, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(10, 32, pageWidth - 10, 32);

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, 42, { align: "center" });

    // Order Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const leftCol = 15;
    const rightCol = 110;
    let yPos = 55;

    doc.setFont("helvetica", "bold");
    doc.text("Order ID:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(orderData.orderId || "N/A", leftCol + 25, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Payment ID:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(orderData.paymentId || "N/A", leftCol + 25, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Date:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    const orderDate = orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : "N/A";
    doc.text(orderDate, leftCol + 25, yPos);

    // Right column - customer
    yPos = 55;
    doc.setFont("helvetica", "bold");
    doc.text("Customer Name:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(orderData.userId?.name || "N/A", rightCol + 35, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(orderData.userId?.email || "N/A", rightCol + 35, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(orderData.delivery_address?.mobile || "N/A", rightCol + 35, yPos);

    // Shipping address
    yPos = 85;
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address:", leftCol, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    const address = orderData.delivery_address?.address_line || "N/A";
    const addressLines = doc.splitTextToSize(address, 80);
    doc.text(addressLines, leftCol, yPos);
    yPos += addressLines.length * 5;
    doc.text(`Pincode: ${orderData.delivery_address?.pincode || "N/A"}`, leftCol, yPos);

    // Table header
    yPos += 15;
    doc.setLineWidth(0.3);
    doc.line(10, yPos, pageWidth - 10, yPos);
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Product", leftCol, yPos);
    doc.text("Quantity", 120, yPos);
    doc.text("Price", 150, yPos);
    doc.text("Total", 175, yPos);
    yPos += 2;
    doc.line(10, yPos, pageWidth - 10, yPos);

    // Items
    yPos += 7;
    doc.setFont("helvetica", "normal");
    const items = Array.isArray(orderData.orderItems) && orderData.orderItems.length > 0
      ? orderData.orderItems
      : [{
          name: orderData.productId?.name || "Product",
          quantity: orderData.Quantity || orderData.quantity || 1,
          price: orderData.productId?.price || 0,
          subtotal: (orderData.productId?.price || 0) * (orderData.Quantity || orderData.quantity || 1),
        }];
    let subtotal = 0;
    items.forEach((it) => {
      const name = it.name || it.productId?.name || "Product";
      const qty = it.quantity || 0;
      const price = it.price ?? it.productId?.price ?? 0;
      const lineTotal = it.subtotal ?? price * qty;
      subtotal += lineTotal;

      const nameLines = doc.splitTextToSize(String(name).substring(0, 50), 90);
      doc.text(nameLines, leftCol, yPos);
      doc.text(String(qty), 120, yPos);
      doc.text(`₹${price}`, 150, yPos);
      doc.text(`₹${lineTotal}`, 175, yPos);
      yPos += nameLines.length * 5 + 4;
    });

    // Totals
    yPos += 15;
    doc.line(10, yPos, pageWidth - 10, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 140, yPos);
    doc.text(`₹${subtotal}`, 175, yPos);

    yPos += 6;
    doc.text("Platform Fee:", 140, yPos);
    doc.text("₹50", 175, yPos);

    yPos += 6;
    doc.text("Shipping:", 140, yPos);
    doc.text("₹100", 175, yPos);

    yPos += 2;
    doc.setLineWidth(0.5);
    doc.line(135, yPos, pageWidth - 10, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Grand Total:", 140, yPos);
    const grandTotal = (orderData.subTotalAmt || subtotal) + 50 + 100;
    doc.text(`₹${grandTotal}`, 175, yPos);

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.text("Thank you for shopping with us!", pageWidth / 2, footerY, { align: "center" });
    doc.text("For any queries, contact: support@ganeshstore.com", pageWidth / 2, footerY + 5, { align: "center" });

    const fileName = `Invoice_${orderData.orderId || "Order"}.pdf`;
    doc.save(fileName);
    toast.success("Invoice downloaded successfully!");
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await axios.post(
        `${AppUrl}/api/user/Logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLogin(false);
        setUserProfile(null);
        openAlertBox("success", response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  }, [AppUrl, navigate, openAlertBox]);

  const value = useMemo(() => ({
    // exposed actions/state
    handleOpenProductDetailsModal,
    openCartPanel,
    setOpenCartPanel,
    setCartLen,
    openAlertBox,
    isLogin,
    setIsLogin,
    AppUrl,

    userProfile,
    allProduct,
    getProductById,
    openCategoryId,
    setOpenCategoryId,
    toggleCategory,
    categoryData,
    setCategoryData,
    subCategory,
    setSubCategory,
    thirdSubCategory,
    setLoadThirdCat,
    setActiveSubCategory,
    loadThirdCat,
    allFeatureProduct,
    windowWidth,
    downloadPDF,
    search,
    setSearch,
    openSidebarFunction,
    isOpenSidebar,
    logout,
    loading,
    toggleDrawer,
    drawerOpen,
    cartLen,
    wishlistLen,
    compareLen,
    setWishlistLen,
    setCompareLen,
    // modal state/data also provided for App.jsx modal
    openProductDetailsModal,
    handleCloseProductDetailsModal,
    data,
  }), [
    openCartPanel,
    isLogin,
    userProfile,
    allProduct,
    openCategoryId,
    categoryData,
    subCategory,
    thirdSubCategory,
    loadThirdCat,
    allFeatureProduct,
    windowWidth,
    search,
    isOpenSidebar,
    loading,
    drawerOpen,
    cartLen,
    wishlistLen,
    compareLen,
    openProductDetailsModal,
    data,
    // include local fns and values referenced in value
    AppUrl,
    getProductById,
    logout,
    toggleCategory,
    downloadPDF,
    openSidebarFunction,
    toggleDrawer,
    handleOpenProductDetailsModal,
    handleCloseProductDetailsModal,
    openAlertBox,
  ]);

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};


export { MyContext, AppProvider };
export default MyContext;
