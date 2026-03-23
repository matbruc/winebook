import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import AuthService from "../../services/AuthService";
import ReportsService from "../../services/ReportsService";
import { Chart } from "react-google-charts";

const WinesReport = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  !currentUser && navigate("/login");
  currentUser.role !== "admin" && navigate("/");

  const [wineReports, setWineReports] = useState([]);
  const [winesPerProducerData, setWinesPerProducerData] = useState([]);
  const [topRatedWinesData, setTopRatedWinesData] = useState([]);
  const [winesPerRegionData, setWinesPerRegionData] = useState([]);
  const [winesPerSubRegionData, setWinesPerSubRegionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // Color palette for charts
  const chartColors = [
    "#8b1e20", "#a02527", "#b52b2d", "#c93234", "#dd383a",
    "#e64a50", "#f05d63", "#5a3a2a", "#7b5a4a", "#9c7a6a"
  ];

  useEffect(() => {
    setLoading(true);
    ReportsService.getWineReport()
      .then((response) => {
        setWineReports(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setMessage(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (wineReports.report && wineReports.report.hasOwnProperty("winesPerProducer")) {
      let headerArray = ["Producer", "Total Wines", { role: "style" }];
      let dataArray = [];
      wineReports.report.winesPerProducer.forEach((el, index) => {
        dataArray.push([
          el._id.name,
          el.count,
          "color: " + chartColors[index % chartColors.length],
        ]);
      });
      setWinesPerProducerData([headerArray, ...dataArray]);
    } else {
      setWinesPerProducerData([]);
    }

    if (wineReports.report && wineReports.report.hasOwnProperty("topWines")) {
      let headerArray = ["Wine", "Rating", { role: "style" }];
      let dataArray = [];
      wineReports.report.topWines.forEach((el, index) => {
        dataArray.push([
          el.name,
          el.rating,
          "color: " + chartColors[index % chartColors.length],
        ]);
      });
      setTopRatedWinesData([headerArray, ...dataArray]);
    } else {
      setTopRatedWinesData([]);
    }

    if (wineReports.report && wineReports.report.hasOwnProperty("winesPerRegion")) {
      let dataArray = [];
      wineReports.report.winesPerRegion.forEach((el, index) => {
        dataArray.push([el._id, el.count, {
          p: { fillColor: chartColors[index % chartColors.length] }
        }]);
      });
      setWinesPerRegionData(dataArray);
    } else {
      setWinesPerRegionData([]);
    }

    if (wineReports.report && wineReports.report.hasOwnProperty("winesPerSubregion")) {
      let dataArray = [];
      wineReports.report.winesPerSubregion.forEach((el, index) => {
        dataArray.push([el._id, el.count, {
          p: { fillColor: chartColors[index % chartColors.length] }
        }]);
      });
      setWinesPerSubRegionData(dataArray);
    } else {
      setWinesPerSubRegionData([]);
    }
  }, [wineReports]);

  const winesPerProducerOptions = {
    title: "Wines per Producer",
    titlePosition: "top",
    titleTextStyle: { color: "#333", fontSize: 18, fontWeight: 600 },
    chartArea: { width: "80%", height: "70%" },
    hAxis: {
      title: "Total Wines",
      minValue: 0,
      textStyle: { color: "#666" },
      gridlines: { color: "#eee" },
    },
    vAxis: {
      textStyle: { color: "#666" },
      gridlines: { color: "#eee" },
    },
    bar: { gap: 0.5 },
    legend: { position: "none" },
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  const topWinesOptions = {
    title: "Top Rated Wines",
    titlePosition: "top",
    titleTextStyle: { color: "#333", fontSize: 18, fontWeight: 600 },
    chartArea: { width: "80%", height: "70%" },
    vAxis: {
      format: "#",
      textStyle: { color: "#666" },
      gridlines: { color: "#eee" },
    },
    hAxis: {
      textStyle: { color: "#666" },
      gridlines: { color: "#eee" },
    },
    legend: { position: "none" },
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  const pieRegionOptions = {
    title: "Wines by Region",
    titlePosition: "top",
    titleTextStyle: { color: "#333", fontSize: 18, fontWeight: 600 },
    chartArea: { width: "65%", height: "70%" },
    legend: { position: "right", textStyle: { color: "#333", fontSize: 12 } },
    pieSliceText: "value",
    slices: {
      offset: 0.02,
    },
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  const pieSubRegionOptions = {
    title: "Wines by Subregion",
    titlePosition: "top",
    titleTextStyle: { color: "#333", fontSize: 18, fontWeight: 600 },
    chartArea: { width: "65%", height: "70%" },
    legend: { position: "right", textStyle: { color: "#333", fontSize: 12 } },
    pieSliceText: "value",
    slices: {
      offset: 0.02,
    },
    is3D: true,
    animation: {
      duration: 1000,
      easing: "out",
    },
  };

  return (
    <div className="reports-report-page">
      <div className="page-header">
        <h1>Wine Analysis Report</h1>
        <p className="page-subtitle">Visual insights from your wine collection</p>
      </div>

      {loading && (
        <div className="loading-container">
          <Spinner animation="grow" variant="primary" size="lg" />
          <p className="loading-text">Loading report data...</p>
        </div>
      )}

      {error && (
        <div className="alert-error">
          <h4>Error Loading Report</h4>
          <p>{message}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="charts-grid">
          <Row className="g-4">
            <Col xl={6} lg={12} className="mb-4">
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title className="chart-title">Wines per Producer</Card.Title>
                  {winesPerProducerData.length > 1 ? (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="BarChart"
                      loader={<Spinner animation="grow" variant="primary" />}
                      data={winesPerProducerData}
                      options={winesPerProducerOptions}
                    />
                  ) : (
                    <div className="no-data">
                      <p>No producer data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xl={6} lg={12} className="mb-4">
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title className="chart-title">Top Rated Wines</Card.Title>
                  {topRatedWinesData.length > 1 ? (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="ColumnChart"
                      loader={<Spinner animation="grow" variant="primary" />}
                      data={topRatedWinesData}
                      options={topWinesOptions}
                    />
                  ) : (
                    <div className="no-data">
                      <p>No rating data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xl={6} lg={12} className="mb-4">
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title className="chart-title">Wines by Region</Card.Title>
                  {winesPerRegionData.length > 1 ? (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="PieChart"
                      loader={<Spinner animation="grow" variant="primary" />}
                      data={winesPerRegionData}
                      options={pieRegionOptions}
                    />
                  ) : (
                    <div className="no-data">
                      <p>No regional data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xl={6} lg={12} className="mb-4">
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title className="chart-title">Wines by Subregion</Card.Title>
                  {winesPerSubRegionData.length > 1 ? (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="PieChart"
                      loader={<Spinner animation="grow" variant="primary" />}
                      data={winesPerSubRegionData}
                      options={pieSubRegionOptions}
                    />
                  ) : (
                    <div className="no-data">
                      <p>No subregional data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default WinesReport;
