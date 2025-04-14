import React, { forwardRef } from "react";
import dayjs from "dayjs";

const PrintableLeadDetails = forwardRef(({ lead }, ref) => {
  if (!lead) {
    return <div>No lead details available to print.</div>;
  }

  return (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Lead Details</h2>
      <p><strong>Lead No:</strong> {lead.leadno}</p>
      <p><strong>Lead Date:</strong> {dayjs(lead.leaddate).format("DD-MM-YYYY")}</p>
      <p><strong>Customer:</strong> {lead.customerName}</p>
      <p><strong>Source:</strong> {lead.sourceName}</p>

      {lead.items && lead.items.length > 0 ? (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th>Category</th>
              <th>Product</th>
              <th>Estimation Unit</th>
              <th>Quantity</th>
              <th>Narration</th>
            </tr>
          </thead>
          <tbody>
            {lead.items.map((item, index) => (
              <tr key={index}>
                <td>{item.categoryName || "N/A"}</td>
                <td>{item.productName || "N/A"}</td>
                <td>{item.estimationin || "N/A"}</td>
                <td>{item.quantity || "0"}</td>
                <td>{item.narration || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "20px", fontStyle: "italic" }}>
          No items available for this lead.
        </p>
      )}
    </div>
  );
});

export default PrintableLeadDetails;