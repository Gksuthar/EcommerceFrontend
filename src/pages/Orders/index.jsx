import { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { IoMdClose } from "react-icons/io";
// import axios from "axios"; // not used here
import { MyContext } from "../../App";
import { GoDownload } from "react-icons/go";
import useFetch from "../../DataFetch/getDataContext.jsx";
import { InfinitySpin } from "react-loader-spinner";
import Pagination from "@mui/material/Pagination";
import AccountLayout from "../../layouts/AccountLayout.jsx";

const Orders = () => {
  const [isOpenProductDetails, setIsOpenProductDetails] = useState(false);
  const context = useContext(MyContext);
  const url = context.AppUrl;

  const [orders, setOrders] = useState([]);
  const [perticulerOrder, setPerticulerOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 4;
  const TotalItem = Math.ceil(orders.length / itemPerPage);

  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);
  const handleOpenProductDetails = (id) => {
    const order = orders.find((item) => item._id === id);
    console.log(order);

    setPerticulerOrder(order);
    setIsOpenProductDetails(true);
  };

  const ChangeValue = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseProductDetails = () => {
    setIsOpenProductDetails(false);
    setPerticulerOrder(null);
  };

  const token = localStorage.getItem("accessToken");
  const {
    data: fetchData,
    loading,
    error,
  } = useFetch(`${url}/api/order/`, token);

  useEffect(() => {
    if (fetchData) {
      console.log(JSON.stringify(fetchData));

      setOrders(fetchData);
    }
  }, [fetchData]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <InfinitySpin
          visible={true}
          width="200"
          color="#4fa94d"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <AccountLayout title="My Orders" subtitle={`There are ${orders.length} Orders`}>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Payment ID</th>
                  <th className="px-6 py-3">Products</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone Number</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Pincode</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Order Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((item, indx) => (
                  <tr key={indx} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{item.orderId}</td>
                    <td className="px-6 py-4">{item.paymentId}</td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => handleOpenProductDetails(item._id)}
                        className="!text-black bg-white rounded-md !px-1"
                      >
                        View Products
                      </Button>
                    </td>
                    <td className="px-6 py-4">{item?.userId?.name ?? '—'}</td>
                    <td className="px-6 py-4">{item?.delivery_address?.mobile ?? '—'}</td>
                    <td className="px-6 py-4">{item?.delivery_address?.address_line ?? '—'}</td>
                    <td className="px-6 py-4">{item?.delivery_address?.pincode ?? '—'}</td>
                    <td className="px-6 py-4">{item?.subTotalAmt ?? '—'}</td>
                    <td className="px-6 py-4">{item?.userId?.email ?? '—'}</td>
                    <td className="px-6 py-4">Delivered</td>
                    <td className="px-6 py-4">{item?.createdAt ?? '—'}</td>
                    <td className="px-6 py-4  !flex justify-center !items-center ">
                      <GoDownload
                        onClick={() => context.downloadPDF(item)}
                        className="cursor-pointer text-[20px] hover:text-blue-600 transition"
                        title="Download Invoice"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

      <Dialog
        open={isOpenProductDetails}
        onClose={handleCloseProductDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <span>Product Details</span>
            <Button onClick={handleCloseProductDetails}>
              <IoMdClose className="text-gray-600" />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          {perticulerOrder ? (
            <>
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Product ID</th>
                    <th className="px-6 py-3">Product Title</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(perticulerOrder.orderItems) && perticulerOrder.orderItems.length > 0 ? (
                    perticulerOrder.orderItems.map((it, idx) => (
                      <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{it?.productId?._id || '—'}</td>
                        <td className="px-6 py-4">{it?.name || it?.productId?.name || '—'}</td>
                        <td className="px-6 py-4">
                          {(it?.image || it?.productId?.images?.[0]) ? (
                            <img src={it?.image || it?.productId?.images?.[0]} alt="Product" className="w-20 h-20" />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">—</div>
                          )}
                        </td>
                        <td className="px-6 py-4">{it?.quantity || 0}</td>
                        <td className="px-6 py-4">{it?.price ?? it?.productId?.price ?? 0}</td>
                        <td className="px-6 py-4">{it?.subtotal ?? ((it?.price ?? 0) * (it?.quantity ?? 0))}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{perticulerOrder?.productId?._id ?? '—'}</td>
                      <td className="px-6 py-4">{perticulerOrder?.productId?.name ? `${perticulerOrder.productId.name.substring(0, 50)}...` : '—'}</td>
                      <td className="px-6 py-4">
                        {perticulerOrder?.productId?.images?.[0] ? (
                          <img src={perticulerOrder.productId.images[0]} alt="Product" className="w-20 h-20" />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">—</div>
                        )}
                      </td>
                      <td className="px-6 py-4">{perticulerOrder.Quantity || 1}</td>
                      <td className="px-6 py-4">{perticulerOrder?.productId?.price ?? '—'}</td>
                      <td className="px-6 py-4">{(perticulerOrder?.productId?.price ?? 0) * (perticulerOrder?.Quantity || 1)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <p>Loading product details...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div className="flex justify-end">
        <Pagination count={TotalItem} onChange={ChangeValue} />
      </div>
    </AccountLayout>
  );
};

export default Orders;
