import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Descriptions,
  Spin,
  message,
  Table,
  Row,
  Col,
  Typography,
  Divider,
  Button,
} from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();




  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedId = id || localStorage.getItem("selectedLeadId");
        if (!storedId) {
          messageApi.error("No lead ID provided");
          return;
        }

        const [leadRes, catRes, prodRes] = await Promise.all([
          axios.get(`http://localhost:8081/lead/${storedId}`),
          axios.get("http://localhost:8081/category"),
          axios.get("http://localhost:8081/product"),
        ]);

        setLead(leadRes.data.data);
        setCategories(catRes.data.data);
        setProducts(prodRes.data.data);
      } catch (err) {
        messageApi.error("Failed to fetch lead or supporting data");
      } finally {
        setLoading(false);
       // localStorage.removeItem("selectedLeadId");
      }
    };

    fetchData();
  }, [id]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : id;
  };

  const getProductName = (id) => {
    const prod = products.find((p) => p._id === id);
    return prod ? prod.name : id;
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Req", dataIndex: "quantity", key: "quantity" },
    { title: "Unit", dataIndex: "estimationin", key: "estimationin" },
    { title: "Weight", dataIndex: "quantity", key: "quantity" },
    { title: "Narration", dataIndex: "narration", key: "narration" },
  ];

  const tableData =
    lead?.items?.map((item, index) => ({
      key: index,
      no: index + 1,
      category: getCategoryName(item.categoryid),
      product: getProductName(item.productid),
      estimationin: item.estimationin,
      brand: item.brand,
      req: item.req,
      unit: item.unit,
      quantity: item.quantity,
      narration: item.narration,
    })) || [];

  const totalWeight = tableData.reduce(
    (acc, item) => acc + parseFloat(item.quantity || 0),
    0
  );

  if (loading) return <Spin tip="Loading..." fullscreen />;
  if (!lead) return <div>No lead found.</div>;

  return (
    <>
      {/* Print Styles */}
      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
          }
          .hide-on-print {
            display: none !important;
          }
          .ant-card {
            page-break-inside: avoid;
          }
        }
      `}
      </style>

      <section style={{ background: "#f0f2f5", padding: "10px", marginTop: "80px", marginLeft: "300px" }}>
        <div
          className="printable-area"
          style={{
            padding: "10px 20px",
            background: "#fff",
            maxWidth: "1000px",
            margin: "0 auto"
          }}
        >
          {contextHolder}

          {/* Header */}
          <Row justify="center" align="middle" gutter={16}>
            <Col span={6}>
              <img
                src="https://th.bing.com/th/id/OIP.nOL8HH_1fafIVupyd9raegAAAA?rs=1&pid=ImgDetMain"
                alt="Logo"
                style={{ maxHeight: "120px", width: "auto" }}
              />
            </Col>
            <Col span={18}>
              <Title level={4} style={{ marginBottom: 4, color: "orange" }}>
                PARSHWANATH ISPAT PVT LTD
              </Title>
              <Text style={{ fontSize: "12px" }}>120/1, P.B.Road, N.H.4, SHIROLI(P), KOLHAPUR</Text>
              <br />
              <Text style={{ fontSize: "12px" }}>Email - purchase@parshwanathsteel.com</Text>
              <br />
              <Text style={{ fontSize: "12px" }}>Tel - (0230) 2461285, 2460009 Mob - 96078 15933</Text>
              <br />
              <Text style={{ fontSize: "12px" }}>
                <b>GSTIN</b>: 27AAFCP4825L1Z2
              </Text>
            </Col>
          </Row>

          <Divider style={{ margin: "10px 0" }} />

          <Title level={5} style={{ textAlign: "center", marginBottom: 10 }}>
            LEAD
          </Title>

          {/* Cards Section */}
          <Row gutter={12} style={{ marginTop: 10, display: "flex", alignItems: "stretch" }}>
            {[...Array(3)].map((_, idx) => (
              <Col span={8} style={{ display: "flex" }} key={idx}>
                <Card
                  title={["Bill To", "Ship To", "Details"][idx]}
                  style={{ width: "100%", fontSize: "12px" }}
                  bodyStyle={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "12px" }}
                >
                  {idx < 2 ? (
                    <>
                      <Text strong>{lead.customername || "V AND G PIPE HOUSE"}</Text>
                      <Text>8805263434</Text>
                      <Text style={{ fontSize: "12px" }}>
                        GROUND, A-9, ZARINA TOWER, TALIGAO ROAD, ST INEZ PANAJI, North Goa, Goa, 403001
                      </Text>
                      <Text>
                        <b>GST No.:</b> 30AAFFV2278N1ZW
                      </Text>
                    </>
                  ) : (
                    <>
                      <p><b>Lead No :</b> {lead.leadno}</p>
                      <p><b>Lead Date :</b> {dayjs(lead.leaddate).format("DD/MM/YYYY")}</p>
                      <p><b>Payment Term :</b> Against Delivery</p>
                      <p><b>Owner :</b> Deepak_Shinde</p>
                      <p><b>CRM :</b> Deepak_Shinde</p>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          {/* Items Table */}
          <div style={{ marginTop: 20 }}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              bordered
              size="small"
              style={{ fontSize: "12px" }}
            />
          </div>

          {/* Total Weight */}
          <div style={{ textAlign: "right", marginTop: 5 }}>
            <Text strong>Total Weight : {totalWeight.toFixed(1)} Kg</Text>
          </div>

          {/* Buttons */}
          <Row
            className="hide-on-print"
            justify="end"
            gutter={8}
            style={{ marginTop: 15 }}
          >
            <Col>
              <Button type="default" onClick={() => window.history.back()}>
                Back
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={() => window.print()}>
                Print
              </Button>
            </Col>
            <Col>
              <Link to="/lead/sbq">
                <Button type="dashed">SBQ</Button>
              </Link>
            </Col>
            <Col>
            <Link to="/lead/mbq">
                <Button type="dashed">MBQ</Button>
              </Link>
            </Col>
          </Row>
        </div>
      </section>

    </>
  );
};

export default LeadDetails;
