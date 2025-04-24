import React, { useState, useEffect } from "react";
import { Button, Table, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Parities() {
  const [data, setData] = useState([]); // State to hold table data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Hook for navigation

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/brandproduct"); // Replace with your API endpoint
        const fetchedData = response.data.status === "success" ? response.data.data : [];
        const formattedData = fetchedData.map((item, index) => ({
          key: item._id,
          srno: index + 1,
          brand: item.brandid?.name || "N/A", // Assuming `brandid` contains the brand object with a `name` field
          product: item.productid?.name || "N/A", // Assuming `productid` contains the product object with a `name` field
        }));
        setData(formattedData);
      } catch (error) {
        message.error("Failed to fetch data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Manage Products button click
  const handleManageProducts = (record) => {
    // Navigate to the ManageParity page with brand and product details
    navigate("/master/manage-parity", { state: { brand: record.brand, product: record.product } });
  };

  // Table columns
  const columns = [
    { title: "Serial No", dataIndex: "srno", key: "srno", align: "center" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Product", dataIndex: "product", key: "product" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleManageProducts(record)}>
          Manage Parity
        </Button>
      ),
    },
  ];

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Parities</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Parities</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12 p-1">
              <div className="card p-3 custom-table">
                <Table
                  columns={columns}
                  dataSource={data}
                  loading={loading}
                  rowKey="key"
                  pagination={{ pageSize: 10, showSizeChanger: false }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Parities;