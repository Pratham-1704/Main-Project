import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Spin, message, Button } from "antd";

function LeadDetails() {
  const { leadno } = useParams(); // Get the lead number from the URL
  const navigate = useNavigate(); // For navigation
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
    <div style={{ padding: "20px" }}>
      <Card
        title={`Lead Details - ${leadno}`}
        bordered={true}
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <p>
          <strong>Lead Date:</strong> {new Date(leadDetails.leaddate).toLocaleDateString()}
        </p>
        <p>
          <strong>Customer:</strong> {leadDetails.customerid || "N/A"}
        </p>
        <p>
          <strong>Source:</strong> {leadDetails.sourceid || "N/A"}
        </p>
        <p>
          <strong>Items:</strong>
        </p>
        <ul>
          {leadDetails.items.map((item, index) => (
            <li key={index}>
              <strong>Category:</strong> {item.categoryid || "N/A"}, <strong>Product:</strong>{" "}
              {item.productid || "N/A"}, <strong>Quantity:</strong> {item.quantity || "N/A"},{" "}
              <strong>Estimation In:</strong> {item.estimationin || "N/A"}, <strong>Narration:</strong>{" "}
              {item.narration || "N/A"}
            </li>
          ))}
        </ul>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" onClick={() => navigate("/lead/records")}>
            Back to Leads
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default LeadDetails;