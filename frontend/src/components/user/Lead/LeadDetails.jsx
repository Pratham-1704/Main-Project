import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const storedId = id || localStorage.getItem("selectedLeadId");
        if (!storedId) return messageApi.error("No lead ID provided");

        const [leadRes, catRes, prodRes] = await Promise.all([
          axios.get(`http://localhost:8081/lead/${storedId}`),
          axios.get("http://localhost:8081/category"),
          axios.get("http://localhost:8081/product"),
        ]);

        const leadData = leadRes.data.data;
        setLead(leadData);
        setCategories(catRes.data.data);
        setProducts(prodRes.data.data);

        if (leadData.customerid) {
          const customerRes = await axios.get(
            `http://localhost:8081/customer/${leadData.customerid}`
          );
          setCustomer(customerRes.data.data);
        }
      } catch (err) {
        messageApi.error("Failed to fetch lead or supporting data");
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
    lead?.items?.map((item, index) => {
      const product = products.find((p) => p._id === item.productid);
      const productWeight = Number(product?.weight) || 0; // Adjust 'weight' if your field name is different
      const req = Number(item.quantity || item.req || 0); // Use the correct field for requested quantity
      return {
        key: index,
        no: index + 1,
        category: getCategoryName(item.categoryid),
        product: getProductName(item.productid),
        estimationin: item.estimationin,
        brand: item.brand,
        req: req,
        // unit: item.unit,
         unit: item.estimationin,
        weight: (req * productWeight).toFixed(2), // This is the calculated weight
        narration: item.narration,
      };
    }) || [];

  const totalWeight = tableData.reduce(
    (acc, item) => acc + parseFloat(item.weight || 0),
    0
  );

  const columns = [
    { title: "No", dataIndex: "no" },
    { title: "Category", dataIndex: "category" },
    { title: "Product", dataIndex: "product" },
    // { title: "Brand", dataIndex: "brand" },
    { title: "Req", dataIndex: "req" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Weight", dataIndex: "weight" }, // Now shows req * product weight
    { title: "Narration", dataIndex: "narration" },
  ];


  const generatePDF = async () => {
    const input = document.getElementById("lead-print-area");
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

      // window.open(pdfUrl); // ⬅️ This opens the preview in a new tab
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



  // const generatePDF = () => {
  //   const input = document.getElementById("lead-print-area");
  //   const buttons = document.getElementById("pdf-buttons");

  //   if (!input) return;

  //   if (buttons) buttons.style.display = "none";

  //   html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgWidth = 210;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //     pdf.save(`Lead_${lead.leadno}.pdf`);

  //     if (buttons) buttons.style.display = "flex";
  //   });
  // };

  if (loading) return <Spin fullscreen tip="Loading..." />;
  if (!lead) return <div>No lead found.</div>;

  return (
    <div className="container" style={{ padding: 0, marginLeft: 180 }}>

      <>
        {contextHolder}
        <div style={{ paddingTop: "60px", maxWidth: 850, margin: "auto", background: "#fff" }}>
          <div
            id="lead-print-area"
            style={{
              padding: 20,
              background: "#fff",
              maxWidth: 1000,
              margin: "auto",
            }}
          >
            <Row>
              <Col span={6}>
                <img src="/assets/img/Companylogo.png" alt="Logo" style={{ height: 80 }} />
              </Col>
              <Col style={{ textAlign: "center", marginRight: "100px" }} span={15}>
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

            <Divider style={{ margin: "10px 0" }} />
            <Title level={5} style={{ textAlign: "center" }}>LEAD</Title>

            <Row gutter={16}>
              {["Bill To", "Ship To", "Details"].map((title, idx) => (
                <Col span={8} key={title}>
                  <Card title={title} size="small">
                    {idx < 2 ? (
                      <>
                        <Text strong>{customer?.name}</Text><br />
                        <Text>{customer?.mobileno1}</Text><br />
                        <Text>{customer?.address}</Text><br />
                        <Text><b>GST No:</b> {customer?.gst}</Text>
                      </>
                    ) : (
                      <>
                        <Text><b>Lead No:</b> {lead.leadno}</Text><br />
                        <Text><b>Lead Date:</b> {dayjs(lead.leaddate).format("DD/MM/YYYY")}</Text><br />
                        <Text><b>Payment Term:</b> Against Delivery</Text><br />
                        <Text><b>Owner:</b> Deepak_Shinde</Text><br />
                        <Text><b>CRM:</b> Deepak_Shinde</Text>
                      </>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>

            <Table
              style={{ marginTop: 20 }}
              columns={columns}
              dataSource={tableData}
              pagination={false}
              bordered
              size="small"
            />

            <div style={{ textAlign: "right", marginTop: 10 }}>
              <Text strong>Total Weight: {totalWeight.toFixed(1)} Kg</Text>
            </div>

            {/* Footer Branding */}
            <div style={{ textAlign: "center", marginTop:"50px" }}>
              <Text type="secondary">One Stop Solution for Variety of Branded Steel</Text>
              <br />
              <img
                src="/assets/img/Companylist.png"
                alt="Steel Logos"
                style={{ maxHeight: 120, marginTop:"10px"}}
              />
            </div>
          </div>

          {/* Buttons */}
          <Row id="pdf-buttons" justify="end" gutter={8} style={{ marginTop: 20 }}>
            <Col><Button onClick={() => navigate(-1)}>Back</Button></Col>
            {/* <Col><Button type="primary" onClick={() => window.print()}>Print</Button></Col> */}
            <Col><Link to="/lead/sbq"><Button type="dashed">SBQ</Button></Link></Col>
            {/* <Col><Link to="/lead/mbq"><Button type="dashed">MBQ</Button></Link></Col> */}
            <Col><Button onClick={generatePDF}>Generate PDF</Button></Col>
          </Row>
        </div>

      </>
    </div>
  );

};

export default LeadDetails;
