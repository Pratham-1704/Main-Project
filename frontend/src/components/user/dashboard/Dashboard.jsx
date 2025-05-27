import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Badge, Statistic, Avatar, Tooltip, Table } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { ShopOutlined, AppstoreOutlined, ShoppingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
// import logo from "../../../assets/logo.png"; // Place your logo in src/assets/logo.png

function Dashboard() {
  const [brands, setBrands] = useState([]);
  const [leadRecords, setLeadRecords] = useState([]);
  const [parityData, setParityData] = useState([]);
  const [leadStats, setLeadStats] = useState([]);
  const [parityStats, setParityStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentDOOrders, setRecentDOOrders] = useState([]);
  const [customers, setCustomers] = useState([]); // New state for customers

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchProducts();
    fetchLeadRecords();
    fetchParityRecords();
    fetchRecentDOOrders();
    fetchCustomers(); // Fetch customers on mount
  }, []);

  // Fetch Brands
  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brand");
      setBrands(res.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8081/category");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/product");
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch Lead Data
  const fetchLeadRecords = async () => {
    try {
      const res = await axios.get("http://localhost:8081/lead");
      const leads = res.data.data || [];
      setLeadRecords(leads);
      processLeadData(leads);
    } catch (error) {
      console.error("Error fetching lead records:", error);
    }
  };

  // Fetch Parity-Based Product Data
  const fetchParityRecords = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brandproduct");
      const data = res.data.data || [];
      setParityData(data);
      processParityData(data);
    } catch (error) {
      console.error("Error fetching parity data:", error);
    }
  };

  // Fetch Recent DO Orders
  const fetchRecentDOOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8081/quotation");
      // Filter for DO prepared quotations
      const filtered = (res.data.data || [])
        .filter(qt => String(qt.do_prepared).toLowerCase() === "yes")
        .sort((a, b) => new Date(b.quotationdate) - new Date(a.quotationdate))
        .slice(0, 5); // Show only 5 most recent
      setRecentDOOrders(filtered);
    } catch (err) {
      // Optionally show error
    }
  };

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/customer");
      setCustomers(res.data.data || []);
    } catch (err) {}
  };

  // Process Lead Data
  const processLeadData = (leads) => {
    const stats = {};
    leads.forEach((lead) => {
      const date = dayjs(lead.leaddate).format("YYYY-MM-DD");
      stats[date] = (stats[date] || 0) + 1;
    });
    setLeadStats(Object.entries(stats).map(([date, count]) => ({ date, count })));
  };

  // Process Parity Data
  const processParityData = (data) => {
    const stats = {};
    data.forEach((item) => {
      const month = dayjs(item.createdAt).format("YYYY-MM");
      if (item.parityid && !item.productid) {
        stats[month] = (stats[month] || 0) + 1;
      }
    });
    setParityStats(Object.entries(stats).map(([month, count]) => ({ month, count })));
  };

  return (
    <>
      <main id="main" className="main" style={{ background: "#f4f6fa", minHeight: "100vh" }}>
        <div className="pagetitle" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* <img src={''} alt="Logo" style={{ height: 48, marginRight: 16 }} /> */}
          <h1 style={{ margin: 0, fontWeight: 700, letterSpacing: 1 }}>Dashboard</h1>
        </div>

        {/* Stylish Summary Row */}
        <Row gutter={24} style={{ marginBottom: 32, marginTop: 16 }} justify="center">
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{ borderRadius: 16, boxShadow: "0 2px 8px #e0e0e0" }}
              bodyStyle={{ padding: 24, textAlign: "center" }}
            >
              <Tooltip title="Total Brands">
                <Avatar size={48} style={{ background: "#2E86C1" }} icon={<ShopOutlined />} />
              </Tooltip>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Brands</span>}
                value={brands.length}
                valueStyle={{ fontSize: 32, color: "#2E86C1" }}
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{ borderRadius: 16, boxShadow: "0 2px 8px #e0e0e0" }}
              bodyStyle={{ padding: 24, textAlign: "center" }}
            >
              <Tooltip title="Total Categories">
                <Avatar size={48} style={{ background: "#52c41a" }} icon={<AppstoreOutlined />} />
              </Tooltip>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Categories</span>}
                value={categories.length}
                valueStyle={{ fontSize: 32, color: "#52c41a" }}
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{ borderRadius: 16, boxShadow: "0 2px 8px #e0e0e0" }}
              bodyStyle={{ padding: 24, textAlign: "center" }}
            >
              <Tooltip title="Total Products">
                <Avatar size={48} style={{ background: "#faad14" }} icon={<ShoppingOutlined />} />
              </Tooltip>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Products</span>}
                value={products.length}
                valueStyle={{ fontSize: 32, color: "#faad14" }}
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
        </Row>

        <section className="section dashboard">
          <div className="row">
            {/* Business Summary */}
            {/* <div className="col-lg-4">
              <div className="card p-3">
                <h5>Business Summary</h5>
                <p><strong>Total Brands:</strong> {brands.length}</p>
                <p><strong>Today's Leads:</strong> {leadStats.find(l => l.date === dayjs().format("YYYY-MM-DD"))?.count || 0}</p>
                <p><strong>Parity Issues:</strong> {parityStats.find(p => p.month === dayjs().format("YYYY-MM"))?.count || 0}</p>
              </div>
            </div> */}

            {/* Recent DO Prepared Orders */}
            <div className="col-lg-6">
              <Card
                title="Recent DO Prepared Orders"
                style={{ marginTop: 24, borderRadius: 12 }}
                bodyStyle={{ padding: 8 }}
              >
                <Table
                  dataSource={recentDOOrders}
                  rowKey="_id"
                  size="small"
                  pagination={false}
                  columns={[
                    {
                      title: "Quotation No",
                      dataIndex: "quotationno",
                      key: "quotationno",
                      render: (text, record) => (
                        <Link to={`/quotation/quotation-details/${record._id}`}>{text}</Link>
                      ),
                    },
                    {
                      title: "Date",
                      dataIndex: "quotationdate",
                      key: "quotationdate",
                      render: (text) => dayjs(text).format("DD-MM-YYYY"),
                    },
                    {
                      title: "Customer",
                      dataIndex: "customerid",
                      key: "customerid",
                      render: (id) => {
                        const customer = customers.find((c) => c._id === id);
                        return customer ? customer.name : "N/A";
                      },
                    },
                  ]}
                  locale={{ emptyText: "No DO prepared quotations found" }}
                />
              </Card>
            </div>

            {/* Lead Trends */}
            <div className="col-lg-4">
              <div className="card p-3">
                <h5>Lead Trends</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={leadStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="count" fill="#2E86C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

         

          {/* Notifications Section */}
          <div className="card p-3 mt-4">
            <h5>Notifications</h5>
            <Badge count={leadRecords.length} style={{ backgroundColor: "#52c41a" }}>
              <p>New Leads Received</p>
            </Badge>
            <Badge count={parityData.length} style={{ backgroundColor: "#faad14" }}>
              <p>Parity Issues Found</p>
            </Badge>
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
