import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Table,
  Button,
  Card,
  message,
  Spin,
} from "antd";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedId = id || localStorage.getItem("selectedOrderId");
        if (!storedId) return messageApi.error("No order ID provided");

        const [orderRes, catRes, prodRes] = await Promise.all([
          axios.get(`http://localhost:8081/order/${storedId}`),
          axios.get("http://localhost:8081/category"),
          axios.get("http://localhost:8081/product"),
        ]);

        const orderData = orderRes.data.data;
        setOrder(orderData);
        setCategories(catRes.data.data);
        setProducts(prodRes.data.data);

        if (orderData.customerid) {
          const customerRes = await axios.get(
            `http://localhost:8081/customer/${orderData.customerid}`
          );
          setCustomer(customerRes.data.data);
        }
      } catch (err) {
        messageApi.error("Failed to fetch order or supporting data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getCategoryName = (id) =>
    categories.find((c) => c._id === id)?.name || "Unknown Category";

  const getProductName = (id) =>
    products.find((p) => p._id === id)?.name || "Unknown Product";

  const tableData =
    order?.items?.map((item, index) => ({
      key: index,
      no: index + 1,
      category: getCategoryName(item.categoryid),
      product: getProductName(item.productid),
      size: item.size || "-",
      req: item.quantity || "-",
      unit: item.unit || "-",
      producer: item.brand || "As Per IS2062",
      quantity: item.quantity || 0,
      rate: item.rate || 0,
    })) || [];

  const totalWeight = tableData.reduce(
    (acc, item) => acc + parseFloat(item.quantity || 0),
    0
  );

  const columns = [
    { title: "No", dataIndex: "no", width: 50 },
    { title: "Category", dataIndex: "category", width: 100 },
    { title: "Product", dataIndex: "product", width: 100 },
    { title: "Narration", dataIndex: "size", width: 100 },
    { title: "Req", dataIndex: "req", width: 50 },
    { title: "Unit", dataIndex: "unit", width: 50 },
    { title: "Producer", dataIndex: "producer", width: 120 },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 80,
      render: (text) => `${parseFloat(text || 0).toFixed(1)} Kgs`,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      width: 80,
      render: (text) => `${text || 0}/Kgs`,
    },
  ];

  const generatePDF = async () => {
    const input = document.getElementById("order-print-area");
    const buttons = document.getElementById("pdf-buttons");

    if (!input) return;

    if (buttons) buttons.style.display = "none";

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(
        pdfUrl,
        "_blank",
        "width=900,height=700,left=100,top=100,scrollbars=yes,resizable=yes"
      );
    } catch (error) {
      messageApi.error("Failed to generate PDF preview");
    } finally {
      if (buttons) buttons.style.display = "flex";
    }
  };

  if (loading) return <Spin fullscreen tip="Loading..." />;
  if (!order) return <div>No order found.</div>;

  return (
    <div className="container" style={{ padding: 0, marginLeft: 180 }}>
      {contextHolder}
      <div
        style={{
          paddingTop: "60px",
          maxWidth: 850,
          margin: "auto",
          background: "#fff",
        }}
      >
        <div
          id="order-print-area"
          style={{
            padding: 20,
            background: "#fff",
            maxWidth: 1000,
            margin: "auto",
          }}
        >
          <Row justify="center" gutter={16}>
            <Col span={24}>
              <Title level={4} style={{ textAlign: "center", marginBottom: 0 }}>
                PRITAM STEEL PVT LTD
              </Title>
              <Text style={{ textAlign: "center", display: "block" }}>
                Nagaon, Kolhapur-416122
              </Text>
              <Text style={{ textAlign: "center", display: "block" }}>
                Email - sales@pritamsteel.com / adminparshwa@gmail.com
              </Text>
              <Text style={{ textAlign: "center", display: "block" }}>
                Tel - (0230) 2461285, 2460009 Mob - 96078 15933, 960
                (77/76/75/74) 15933
              </Text>
              <Text strong style={{ textAlign: "center", display: "block" }}>
                GSTIN - 27AALCP18776121
              </Text>
            </Col>
          </Row>

          <Divider
            style={{ margin: "10px 0", borderTop: "2px solid #000" }}
          />
          <Title level={4} style={{ textAlign: "center" }}>
            DELIVERY ORDER
          </Title>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card
                title="Bill To"
                size="small"
                headStyle={{ backgroundColor: "#f0f0f0" }}
              >
                <Text strong>{customer?.name || "N/A"}</Text>
                <br />
                <Text>{customer?.mobileno1 || "N/A"}</Text>
                <br />
                <Text>{customer?.address || "N/A"}</Text>
                <br />
                <Text>
                  {(customer?.city || "N/A") + " - " + (customer?.state || "N/A")}
                </Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="Ship To"
                size="small"
                headStyle={{ backgroundColor: "#f0f0f0" }}
              >
                <Text strong>{customer?.name || "N/A"}</Text>
                <br />
                <Text>{customer?.mobileno1 || "N/A"}</Text>
                <br />
                <Text>{customer?.address || "N/A"}</Text>
                <br />
                <Text>
                  {(customer?.city || "N/A") + " - " + (customer?.state || "N/A")}
                </Text>
              </Card>
            </Col>
          </Row>

          <Card
            title="Order Details"
            size="small"
            headStyle={{ backgroundColor: "#f0f0f0" }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Text>
                  <strong>Order No.:</strong> {order.orderno || "N/A"}
                </Text>
              </Col>
              <Col span={8}>
                <Text>
                  <strong>D. O. Date:</strong>{" "}
                  {order.orderdate
                    ? dayjs(order.orderdate).format("DD-MM-YYYY")
                    : "N/A"}
                </Text>
              </Col>
              <Col span={8}>
                <Text>
                  <strong>Payment Mode:</strong> NEFT / RTGS
                </Text>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 8 }}>
              <Col span={8}>
                <Text>
                  <strong>Payment Term:</strong> 15 Days
                </Text>
              </Col>
              <Col span={8}>
                <Text>
                  <strong>Owner:</strong> SagarKhanvilkar
                </Text>
              </Col>
              <Col span={8}>
                <Text>
                  <strong>CRM:</strong> Sagar Khanvilkar
                </Text>
              </Col>
            </Row>
          </Card>

          <Table
            style={{ marginTop: 20 }}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            size="small"
            scroll={{ x: true }}
          />

          <div style={{ textAlign: "right", marginTop: 10 }}>
            <Text strong>
              Total wt. {isNaN(totalWeight) ? "0.0" : totalWeight.toFixed(1)}
            </Text>
          </div>

          <Divider style={{ margin: "20px 0 10px 0" }} />

          <div style={{ marginTop: 20 }}>
            <Text strong>Term and Conditions:</Text>
            <br />
            <Text>Loading Charges : ( Yes )</Text>
            <br />
            <Text>Freight Charges : ( Ex Kolhapur - Freight Extra )</Text>
            <br />
            <Text>Cutting Charges : ( 0 ¥ )</Text>
            <br />
            <Text>C.D. : 0 ¥</Text>
          </div>

          <div style={{ textAlign: "right", marginTop: 30 }}>
            <Text strong>For PRITAM STEEL PVT LTD</Text>
          </div>

          <Divider style={{ margin: "20px 0 10px 0" }} />

          <div style={{ textAlign: "center" }}>
            <Text>One Stop Solution for Variety of Branded Steel</Text>
          </div>
        </div>

        {/* Buttons */}
        <Row
          id="pdf-buttons"
          justify="end"
          gutter={8}
          style={{ marginTop: 20 }}
        >
          <Col>
            <Button onClick={() => navigate(-1)}>Back</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => window.print()}>
              Print
            </Button>
          </Col>
          <Col>
            <Button onClick={generatePDF}>Generate PDF</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderDetails;
