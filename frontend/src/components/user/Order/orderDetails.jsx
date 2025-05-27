// ...imports remain the same
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Card,
  Table,
  Button,
  Spin,
  message,
  Modal,
} from "antd";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const { Title, Text } = Typography;


const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const fallbackOrder = {
    orderno: "DO-000000",
    orderdate: "2025-01-01",
    owner: "Admin",
    baddress: "Billing Address not available",
    saddress: "Shipping Address not available",
    subtotal: 0,
    gstamount: 0,
    total: 0,
    products: [],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const orderRes = await axios.get(`http://localhost:8081/order/${id}`);
        setOrder(orderRes.data.data);

        const detailsRes = await axios.get(
          `http://localhost:8081/orderDetail/byorder/${id}`
        );
        setOrderDetails(detailsRes.data.data);

        if (orderRes.data.data?.customerid) {
          const customerRes = await axios.get(
            `http://localhost:8081/customer/${orderRes.data.data.customerid._id}`
          );
          setCustomer(customerRes.data.data);
        }
      } catch (err) {
        messageApi.error("Failed to fetch order. Showing fallback data.");
        setOrder(fallbackOrder);
        setOrderDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      const fileName = `Order-${order.orderno || order._id || "Document"}.pdf`;

      const win = window.open(
        "",
        "_blank",
        "width=900,height=700,left=100,top=100,scrollbars=yes,resizable=yes"
      );

      if (win) {
        win.document.title = fileName;
        win.document.body.innerHTML = `
          <title>${fileName}</title>
          <iframe src="${pdfUrl}" width="100%" height="90%" style="border:none;"></iframe>
          <div style="text-align:center;margin-top:10px;">
            <a href="${pdfUrl}" download="${fileName}">
              <button style="padding:8px 16px;font-size:16px;">Download PDF</button>
            </a>
          </div>
        `;
      }
    } catch (error) {
      messageApi.error("Failed to generate PDF preview");
    } finally {
      if (buttons) buttons.style.display = "flex";
    }
  };

  if (loading) return <Spin fullscreen tip="Loading..." />;
  if (!order) return <div>No order found.</div>;

  return (
    <div style={{ padding: 0, marginLeft: 180, marginTop: 100 }}>
      {contextHolder}
      {modalContextHolder}
      <div style={{ maxWidth: 950, margin: "auto", background: "#fff" }}>
        <div id="order-print-area" style={{ padding: 20 }}>
          {/* Header */}

          <Row style={{ marginLeft: "10px" }}>
            <Col span={4}>
              <img src="/assets/img/Companylogo.png" alt="Logo" style={{ height: 80 }} />
            </Col>
            <Col style={{ textAlign: "center", marginLeft: "80px" }} span={12}>
              <Title level={4} style={{ color: "red", marginBottom: 4, }}>
                PARSHWANATH STEEL Pvt Ltd
              </Title>
              <Text>Shiroli(P), Kolhapur - 416122</Text>
              <br />
              <Text>Email: sales@parshwanathsteel.com / purchase@parshwanathsteel.com</Text>
              <br />
              <Text>Tel: (0230) 2461285, 2460009 Mob: +91 9607815933</Text>
              <br />
              <Text>
                <b>GSTIN:</b> 27AALCP1877G1Z1
              </Text>
            </Col>
          </Row>

          <Divider style={{ margin: "8px 0" }} />

          <Title level={5} style={{ textAlign: "center" }}>
            DELIVERY ORDER
          </Title>

          {/* Bill To / Ship To */}
          <Row gutter={16} style={{ marginBottom: 12 }}>
            <Col span={8}>
              <Card
                size="small"
                title="Bill To"
                style={{ minHeight: 180, height: 180, display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <Text>{customer?.name}</Text>
                <br />
                <Text>{customer?.mobileno1}</Text>
                <br />
                <Text>{customer?.address}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                size="small"
                title="Ship To"
                style={{ minHeight: 180, height: 180, display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <Text>{customer?.name}</Text>
                <br />
                <Text>{customer?.mobileno1}</Text>
                <br />
                <Text>{customer?.address}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                size="small"
                title="Order Info"
                style={{ minHeight: 180, height: 180, display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <Text>
                  <b>Order No:</b> {order.orderno}
                </Text>
                <br />
                <Text>
                  <b>D. O. Date:</b>{" "}
                  {order.orderdate ? dayjs(order.orderdate).format("DD-MM-YYYY") : ""}
                </Text>
                <br />
                <Text>
                  <b>Payment Mode:</b> {orderDetails[0]?.paymentMode || orderDetails[0]?.paymentmode || "N/A"}
                </Text>
                <br />
                <Text>
                  <b>Payment Term:</b> 15 Days
                </Text>
                <br />
                <Text>
                  <b>Owner:</b> {order.owner || "N/A"}
                </Text>
                <br />
                <Text>
                  <b>CRM:</b> Sagar Khanvilkar
                </Text>
              </Card>
            </Col>
          </Row>

          {/* Order Info */}


          <Divider />

          {/* Table */}
          <Table
            dataSource={orderDetails}
            pagination={false}
            size="small"
            bordered
            rowKey="_id"
            columns={[
              { title: "No", render: (_, __, i) => i + 1 },
              {
                title: "Category",
                dataIndex: "categoryid",
                render: (_, r) => r.categoryid?.name || "N/A",
              },
              {
                title: "Product",
                dataIndex: "productid",
                render: (_, r) => r.productid?.name || "N/A",
              },
              { title: "Narration", dataIndex: "narration" },
              { title: "Req", dataIndex: "quantity" },
              { title: "Unit", dataIndex: "estimationin" },
              {
                title: "Producer",
                dataIndex: "brandid",
                render: (_, r) => r.brandid?.name || "N/A",
              },
              // { title: "Quantity", dataIndex: "quantity" },
              { title: "Rate", dataIndex: "rate" },
            ]}
          />

          {/* Total */}
          <Row justify="end" style={{ marginTop: 20 }}>
            <Col span={8}>
              <Row justify="space-between">
                <Col>
                  <Text strong>Total wt:</Text>
                </Col>
                <Col>
                  <Text strong>{order.totalweight} Kgs</Text>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Footer Notes */}
          <Divider />
          <Text>
            <b>Loading Charges:</b> <span style={{ color: "green" }}>Yes</span>
          </Text>
          <br />
          <Text>
            <b>Freight Charges:</b> <span style={{ color: "red" }}>Ex Kolhapur - Freight Extra</span>
          </Text>
          <br />
          <Text>
            <b>Cutting Charges:</b> 0 ₹
          </Text>
          <br />
          <Text>
            <b>C.D.:</b> 0 ₹
          </Text>

          <Divider />

          {/* Footer Branding */}
          <div style={{ textAlign: "center" }}>
            <Text type="secondary">One Stop Solution for Variety of Branded Steel</Text>
            <br />
            <img
              src="/assets/img/Companylist.png"
              alt="Steel Logos"
              style={{ maxHeight: 120 }}
            />
          </div>
        </div>

        <Row
          justify="end"
          id="pdf-buttons"
          style={{ marginTop: 20, display: "flex", gap: 8 }}
        >
          <Button onClick={() => navigate(-1)}>Back</Button>
          {/* <Button type="primary" onClick={() => window.print()}>
            Print
          </Button> */}
          <Button type="primary" onClick={generatePDF}>
            Generate PDF
          </Button>
        </Row>
      </div>
    </div>
  );
};

export default OrderDetails;
