import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Badge } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

function Dashboard() {
  const [brands, setBrands] = useState([]);
  const [leadRecords, setLeadRecords] = useState([]);
  const [parityData, setParityData] = useState([]);
  const [leadStats, setLeadStats] = useState([]);
  const [parityStats, setParityStats] = useState([]);

  useEffect(() => {
    fetchBrands();
    fetchLeadRecords();
    fetchParityRecords();
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
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Dashboard</h1>
        </div>

        <section className="section dashboard">
          <div className="row">
            {/* Analytics Summary */}
            <div className="col-lg-4">
              <div className="card p-3">
                <h5>Business Summary</h5>
                <p><strong>Total Brands:</strong> {brands.length}</p>
                <p><strong>Today's Leads:</strong> {leadStats.find(l => l.date === dayjs().format("YYYY-MM-DD"))?.count || 0}</p>
                <p><strong>Parity Issues:</strong> {parityStats.find(p => p.month === dayjs().format("YYYY-MM"))?.count || 0}</p>
              </div>
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
                    <Tooltip />
                    <Bar dataKey="count" fill="#2E86C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Parity-Based Product Analysis */}
            <div className="col-lg-4">
              <div className="card p-3">
                <h5>Parity-Based Products</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={parityStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#E74C3C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Brand Overview */}
          <div className="card p-3 mt-4">
            <h5>Brand Overview</h5>
            <Row gutter={[16, 16]}>
              {brands.map((brand) => (
                <Col key={brand._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={brand.name}
                    extra={<Link to={`/brands/${brand._id}`}>View</Link>}
                    bordered={false}
                  >
                    <p><strong>Serial No:</strong> {brand.srno}</p>
                  </Card>
                </Col>
              ))}
            </Row>
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
