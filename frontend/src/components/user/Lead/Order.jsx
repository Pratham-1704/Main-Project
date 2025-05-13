import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

const Order = () => {
  const [customers, setCustomers] = useState([]);
  const [source, setSources] = useState([]);
  const [orderRecords, setOrderRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchInitials();
    fetchOrderRecords();
  }, []);

  const fetchInitials = async () => {
    try {
      const [cust, src] = await Promise.all([
        axios.get("http://localhost:8081/customer"),
        axios.get("http://localhost:8081/source"),
      ]);
      setCustomers(cust.data.data || []);
      setSources(src.data.data || []);
    } catch (err) {
      messageApi.error("Failed to load initial data");
    }
  };

  const fetchOrderRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/order"); // Adjusted endpoint for orders
      setOrderRecords(res.data.data || []);
    } catch (err) {
      messageApi.error("Failed to fetch order records");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (record) => {
    navigate("/order/new-order", { state: { record } }); // Adjusted to "order"
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/order/${id}`); // Adjusted endpoint for orders
      messageApi.success("Order deleted successfully");
      fetchOrderRecords();
    } catch (err) {
      messageApi.error("Failed to delete order");
    }
  };

  const orderColumns = [
    {
      title: "Sr No",
      key: "srno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Order No", // Changed from "Lead No"
      dataIndex: "orderno", // Adjusted field for orders
      key: "orderno",
      render: (_, record) => (
        <Link
          to={`/order/order-details/${record._id}`} // Adjusted routing for orders
          onClick={() => localStorage.setItem("selectedOrderId", record._id)} // Changed to "selectedOrderId"
          style={{
            color: "blue",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          {record.orderno}
        </Link>
      ),
    },
    {
      title: "Order Date", // Changed from "Lead Date"
      dataIndex: "orderdate", // Adjusted field for orders
      key: "orderdate",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Customer",
      dataIndex: "customerid",
      key: "customerid",
      render: (text) => customers.find((c) => c._id === text)?.name || "N/A",
    },
    // {
    //   title: "Source",
    //   dataIndex: "sourceid",
    //   key: "sourceid",
    //   render: (text) => source.find((s) => s._id === text)?.name || "N/A",
    // },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => handleUpdate(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this order?" // Adjusted prompt
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Orders</h1> {/* Changed from "Leads" */}
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Orders</li> {/* Changed from "Leads" */}
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3 mt-3">
            {/* <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <Button
                type="primary"
                style={{ width: "150px" }}
                onClick={() => navigate("/order/new-order")} // Adjusted to "order"
              >
                Add New Order
              </Button>
            </div> */}
            <Table
              dataSource={orderRecords} // Changed from "leadRecords"
              columns={orderColumns} // Changed from "leadColumns"
              rowKey="_id"
              pagination={false}
              loading={loading}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Order;
