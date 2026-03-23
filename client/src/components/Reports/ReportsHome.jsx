import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import AuthService from "../../services/AuthService";

const ReportsHome = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate("/login");
  currentUser.role !== "admin" && navigate("/");

  const reports = [
    {
      title: "Wines Report",
      description:
        "Complete analysis of wines including producer statistics, regional breakdowns, and top-rated wines.",
      icon: "&#128200;",
      link: "/reports/wines",
      color: "#8b1e20",
    },
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports Dashboard</h1>
        <p className="page-subtitle">Analyze your wine collection data</p>
      </div>

      <Row className="reports-grid">
        {reports.map((report, index) => (
          <Col key={index} xl={4} lg={6} className="mb-4">
            <Card className="report-card">
              <Card.Body>
                <div className="report-icon" style={{ backgroundColor: `${report.color}20` }}>
                  {report.icon}
                </div>
                <h3 className="report-title">{report.title}</h3>
                <p className="report-description">{report.description}</p>
                <a href={report.link} className="report-link">
                  View Report <span className="arrow">&#8594;</span>
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ReportsHome;
