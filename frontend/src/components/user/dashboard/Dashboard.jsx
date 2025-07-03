import dayjs from "dayjs";
import { PieChart, Pie, Cell, Legend } from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Badge, Statistic, Avatar, Tooltip, Table, Alert, Button, message } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { ShopOutlined, AppstoreOutlined, ShoppingOutlined, DownloadOutlined } from "@ant-design/icons";

import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);
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
  const [orders, setOrders] = useState([]); // <-- Add this line
  const [allQuotations, setAllQuotations] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBrands();
    fetchCategories();
    fetchProducts();
    fetchLeadRecords();
    fetchParityRecords();
    fetchRecentDOOrders();
    fetchCustomers(); // Fetch customers on mount
    fetchOrders(); // <-- Add this line
    fetchAllQuotations();
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

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8081/order"); // Adjust endpoint if needed
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAllQuotations = async () => {
    try {
      const res = await axios.get("http://localhost:8081/quotation");
      setAllQuotations(res.data.data || []);
      console.log("All Quotations:", res.data.data);  
    } catch (err) {
      // Optionally show error
    }
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

  // Prepare data for Product Category Distribution Pie Chart
  const categoryDistribution = categories.map(cat => ({
    name: cat.name,
    value: products.filter(prod => prod.categoryid === cat._id).length,
  })).filter(item => item.value > 0);

  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6699", "#33CC99"];

  // Example: Low stock products (threshold: 5)
  const lowStockProducts = products?.filter(p => p.stock <= 5);

  // Example: Overdue orders (assuming 'dueDate' and 'status' fields)
  const overdueOrders = orders?.filter(
    o => new Date(o.dueDate) < new Date() && o.status !== 'Completed'
  );

  const revenueStats = React.useMemo(() => {
    const weekly = {};
    const monthly = {};
    let total = 0;

    (allQuotations || []).forEach(q => {
      if (String(q.do_prepared).toLowerCase() === "yes") {

        const amount = Number(q.total) || 0; // <-- use 'total' not 'totalamount'
        total += amount;
        // Group by week
        const week = dayjs(q.quotationdate).week();
        const weekLabel = `${dayjs(q.quotationdate).year()}-W${String(week).padStart(2, '0')}`;
        weekly[weekLabel] = (weekly[weekLabel] || 0) + amount;
        // Group by month
        const month = dayjs(q.quotationdate).format('YYYY-MM');
        monthly[month] = (monthly[month] || 0) + amount;
      }
    });

    return {
      total,
      weekly: Object.entries(weekly).map(([week, value]) => ({ week, value })),
      monthly: Object.entries(monthly).map(([month, value]) => ({ month, value })),
    };
  }, [allQuotations]);

  // For monthly revenue
  const lastMonth = [...revenueStats.monthly].sort((a, b) => a.month.localeCompare(b.month)).slice(-1)[0]?.value || 0;

  // For weekly revenue
  const lastWeek = [...revenueStats.weekly].sort((a, b) => a.week.localeCompare(b.week)).slice(-1)[0]?.value || 0;

  // Export handler for table data
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      message.warning('No data to export!');
      return;
    }

    // Exclude unwanted fields
    const excludeFields = ['_id', '__v'];

    // Map IDs to names for orders
    let exportData = data;
    if (filename === 'orders.csv') {
      exportData = data.map(order => {
        // Replace customerid with customer name
        const customer = customers.find(c => c._id === order.customerid);
        return {
          ...order,
          customer: customer ? customer.name : order.customerid,
          // Add more mappings here if needed (e.g., product, category)
        };
      });
      // Optionally remove the original customerid field
      excludeFields.push('customerid');
    }

    const headers = Object.keys(exportData[0]).filter(
      key => !excludeFields.includes(key)
    );
    const csvRows = [];
    csvRows.push(headers.join(','));
    for (const row of exportData) {
      const values = headers.map(header => `"${row[header] ?? ''}"`);
      csvRows.push(values.join(','));
    }
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    message.success('Exported successfully!');
  };

  const currentMonth = dayjs().format('YYYY-MM');
const currentWeek = `${dayjs().year()}-W${String(dayjs().week()).padStart(2, '0')}`;

const thisMonthRevenue =
  revenueStats.monthly.find(m => m.month === currentMonth)?.value || 0;

const thisWeekRevenue =
  revenueStats.weekly.find(w => w.week === currentWeek)?.value || 0;

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

        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <div style={{ background: "#f6ffed", padding: 16, borderRadius: 8, minWidth: 180 }}>
            <h4>Total Revenue</h4>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>₹{revenueStats.total.toLocaleString()}</div>
          </div>
          <div style={{ background: "#e6f7ff", padding: 16, borderRadius: 8, minWidth: 180 }}>
            <h4>This Month</h4>
            <div style={{ fontSize: 20 }}>
              ₹{thisMonthRevenue.toLocaleString()}
            </div>
          </div>
          <div style={{ background: "#fffbe6", padding: 16, borderRadius: 8, minWidth: 180 }}>
            <h4>This Week</h4>
            <div style={{ fontSize: 20 }}>
              ₹{thisWeekRevenue.toLocaleString()}
            </div>
          </div>
        </div>

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
                title="Recent DO Prepared Quotations"
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

            
          </div>

        <div className="container">
  <div className="row">
    {/* Product Category Distribution Pie Chart */}
    <div className="col-lg-8 col-md-12 mb-3">
      <Card
        title="Product Category Distribution"
        style={{ marginTop: 24, borderRadius: 12 }}
        bodyStyle={{ padding: 8 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {categoryDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Lead Trends */}
    <div className="col-lg-4 col-md-12 mb-3">
      <Card
        title="Lead Trends"
        style={{ marginTop: 24, borderRadius: 12 }}
        bodyStyle={{ padding: 16 }}
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={leadStats}>
            <CartesianGrid strokeDasharray="3 5" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <ReTooltip />
            <Bar dataKey="count" fill="#2E86C1" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
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

          {/* Notifications/Alerts Section */}
          <div style={{ marginBottom: 24 }}>
            {lowStockProducts?.length > 0 && (
              <Alert
                message={`Low Stock Alert: ${lowStockProducts.length} product(s)`}
                description={
                  <ul>
                    {lowStockProducts.map(p => (
                      <li key={p.id}>{p.name} (Stock: {p.stock})</li>
                    ))}
                  </ul>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 12 }}
              />
            )}
            {overdueOrders?.length > 0 && (
              <Alert
                message={`Overdue Orders: ${overdueOrders.length}`}
                description={
                  <ul>
                    {overdueOrders.map(o => (
                      <li key={o.id}>{o.orderNumber} (Due: {o.dueDate})</li>
                    ))}
                  </ul>
                }
                type="error"
                showIcon
              />
            )}
          </div>

          {/* Export Data Section */}
          {/* <div style={{ marginBottom: 24 }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => exportToCSV(products, 'products.csv')}
              style={{ marginRight: 8 }}
            >
              Export Products
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => exportToCSV(orders, 'orders.csv')}
            >
              Export Orders
            </Button>
          </div> */}
        </section>
      </main>
    </>
  );
}

export default Dashboard;
