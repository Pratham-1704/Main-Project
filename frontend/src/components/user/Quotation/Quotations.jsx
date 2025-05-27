import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const Quotations = () => {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sources, setSources] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchQuotations();
    fetchCustomers();
    fetchSources();
  }, []);

  // Fetch quotations data
  const fetchQuotations = async () => {
    try {
      const res = await axios.get("http://localhost:8081/quotation");
      setData(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      messageApi.error("Failed to fetch quotations.");
    }
  };

  // Fetch customers data
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/customer");
      setCustomers(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      messageApi.error("Failed to fetch customers.");
    }
  };

  // Fetch sources data
  const fetchSources = async () => {
    try {
      const res = await axios.get("http://localhost:8081/source");
      setSources(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      messageApi.error("Failed to fetch sources.");
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/quotation/${id}`);
      messageApi.success("Quotation deleted successfully!");
      fetchQuotations();
    } catch (error) {
      console.error("Error deleting quotation:", error);
      messageApi.error("Failed to delete quotation!");
    }
  };

  // Handle update action
  const handleUpdate = (record) => {
    navigate(`/quotation/modifyQtation/${record._id}`);
  };

  // Table columns
  const columns = [
    {
      title: "Sr No",
      key: "srno",
      render: (_, __, index) => index + 1, // Render row index
    },
    {
      title: "Quotation No",
      dataIndex: "quotationno",
      key: "quotationno",
      render: (_, record) => (
        <Link
          to={`/quotation/quotation-details/${record._id}`}
          onClick={() => localStorage.setItem("selectedQuotationId", record._id)}
          style={{
            color: "blue",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          {record.quotationno}
        </Link>
      ),
    },
    {
      title: "Quotation Date",
      dataIndex: "quotationdate",
      key: "quotationdate",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Customer",
      dataIndex: "customerid",
      key: "customerid",
      render: (id) => customers.find((c) => c._id === id)?.name || "N/A",
    },
    {
      title: "Source",
      dataIndex: "sourceid",
      key: "sourceid",
      render: (id) => sources.find((s) => s._id === id)?.name || "N/A",
    },
    // {
    //   title: "DO Prepared",
    //   dataIndex: "do_prepared",
    //   key: "do_prepared",
    // },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleUpdate(record)}
            className="action-button edit-button"
          />
          <Popconfirm
            title="Are you sure you want to delete this quotation?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              className="action-button delete-button" />
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
          <h1>Quotations</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Quotations</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="card p-3 custom-table">
            <Table
              columns={columns}
              dataSource={data}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
              rowClassName={(record) =>
                record.do_prepared === "yes" ? "do-prepared-row" : ""
              }
            />
            <style>
              {`
                .do-prepared-row {
                  background-color:rgb(5, 12, 5) !important;
                }
              `}
            </style>
          </div>
        </section>
      </main>
    </>
  );
};

export default Quotations;