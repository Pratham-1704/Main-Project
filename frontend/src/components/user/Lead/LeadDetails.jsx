import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Spin, message, Button, Table, Row, Col } from "antd";

function LeadDetails() {
  const { leadno } = useParams(); // Get lead number from URL params
  const navigate = useNavigate();
  const [leadDetails, setLeadDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/lead/${leadno}`);
        setLeadDetails(response.data);
        setLoading(false);
      } catch (err) {
        message.error("Failed to fetch lead details.");
        setLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadno]);

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "categoryid",
      key: "categoryid",
    },
    {
      title: "Product",
      dataIndex: "productid",
      key: "productid",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Req",
      dataIndex: "req",
      key: "req",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Narration",
      dataIndex: "narration",
      key: "narration",
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!leadDetails) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>No details found for this lead.</p>
        <Button type="primary" onClick={() => navigate("/lead/records")}>
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, backgroundColor: "#fff" }}>
      <h2 style={{ textAlign: "center", color: "#fa8c16", fontWeight: "bold" }}>
        PARSHWANATH ISPAT PVT LTD
      </h2>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div>120/1, P.B.Road, N.H.4, SHIROLI(P), KOLHAPUR</div>
        <div>Email - purchase@parshwanathsteel.com</div>
        <div>Tel – (0230) 2461285, 2460009 Mob - 96078 15933</div>
        <div><strong>GSTIN : 27AAFFV2278N1ZW</strong></div>
      </div>

      <Card title="LEAD" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <h3>Bill To -</h3>
            <div style={{ color: "#1890ff" }}>{leadDetails.customerName}</div>
            <div>{leadDetails.billingAddress}</div>
            <div>GST No. : {leadDetails.billingGST}</div>
          </Col>
          <Col span={8}>
            <h3>Ship To -</h3>
            <div style={{ color: "#" }}>{leadDetails.shippingName}</div>
            <div>{leadDetails.shippingAddress}</div>
            <div>GST No. : {leadDetails.shippingGST}</div>
          </Col>
          <Col span={8}>
            <h3>Details -</h3>
            <p><strong>Lead No :</strong> {leadDetails.leadno}</p>
            <p><strong>Lead Date :</strong> {new Date(leadDetails.leaddate).toLocaleDateString()}</p>
            <p><strong>Payment Term :</strong> Against Delivery</p>
            <p><strong>Owner :</strong> {leadDetails.owner}</p>
            <p><strong>CRM :</strong> {leadDetails.crm}</p>
          </Col>
        </Row>

        <Table
          dataSource={leadDetails.items}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => index}
          style={{ marginTop: 30 }}
          bordered
        />

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <strong>Total Weight : </strong> {leadDetails.totalWeight} Kg
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Button type="primary" onClick={() => navigate("/lead/records")} style={{ marginRight: 10 }}>
            Back
          </Button>
          <Button onClick={() => window.print()} style={{ marginRight: 10 }}>
            Print
          </Button>
          <Button type="dashed" style={{ marginRight: 10 }}>
            SBQ
          </Button>
          <Button type="dashed">MBQ</Button>
        </div>
      </Card>
    </div>
  );
}

export default LeadDetails;
