import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import AuthService from "../../services/AuthService";
import ReportsService from "../../services/ReportsService";
import { Chart } from "react-google-charts";

const winesPerProducerOptions = {
  title: "Wines per Producer",
  chartArea: { width: "50%" },
  hAxis: {
    title: "Total Wines",
    minValue: 0,
  },
  vAxis: {
    title: "Producer",
  },
};

const WinesReport = () => {
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  !currentUser && navigate('/login');
  currentUser.role !== 'admin' && navigate('/');

  const [wineReports, setWineReports] = useState([]);
  const [winesPerProducerData, setWinesPerProducerData] = useState([]);
  const [topRatedWinesData, setTopRatedWinesData] = useState([]);
  const [winesPerRegionData, setWinesPerRegionData] = useState([]);
  const [winesPerSubRegionData, setWinesPerSubRegionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      ReportsService.getWineReport()
        .then(
          (response) => {
            setWineReports(response);
            setLoading(false);
          }, (error) => {
            setError(true);
            setMessage(error.message);
            setLoading(false);
          });
      setLoading(false);
    } catch (error) {
      setError(true);
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {

    if (wineReports.report && wineReports.report.hasOwnProperty('winesPerProducer')) {

      let headerArray = ["Producer", "Total Wines", { role: "style" }];
      let dataArray = [];
      wineReports.report.winesPerProducer.forEach(el => {
        dataArray.push([el._id.name, el.count, "color: #" + Math.floor(Math.random() * 16777215).toString(16)]);
      })
      setWinesPerProducerData([headerArray, ...dataArray]);
    } else {
      setWinesPerProducerData([]);
    }

    if (wineReports.report && wineReports.report.hasOwnProperty('topWines')) {
      let headerArray = ["Wine", "Rating", {role: "style"}];
      let dataArray = [];
      wineReports.report.topWines.forEach(el => {
        dataArray.push([el.name, el.rating, "color: #" + Math.floor(Math.random() * 16777215).toString(16)]);
      })
      setTopRatedWinesData([headerArray, ...dataArray]);
    } else {
      setTopRatedWinesData([]);
    }

    if (wineReports.report && wineReports.report.hasOwnProperty('winesPerRegion')) {
      let headerArray = ["Region", "Total Wines"];
      let dataArray = [];
      wineReports.report.winesPerRegion.forEach(el => {
        console.log(el);
        dataArray.push([el._id, el.count]);
      })
      setWinesPerRegionData([headerArray, ...dataArray]);
    } else {
      setWinesPerRegionData([]);
    }

    if (wineReports.report && wineReports.report.hasOwnProperty('winesPerSubregion')) {
      let headerArray = ["Subregion", "Total Wines"];
      let dataArray = [];
      wineReports.report.winesPerSubregion.forEach(el => {
        dataArray.push([el._id, el.count]);
      })
      setWinesPerSubRegionData([headerArray, ...dataArray]);
    } else {
      setWinesPerSubRegionData([]);
    }

  }, [wineReports]);


  return (
    <Container>

      <Card>
        <Card.Body>
          <Card.Title><h1>Wines Report</h1></Card.Title>
          {loading &&
            <Spinner animation="border" variant="primary"/>
          }
          {winesPerProducerData &&
            <Chart
              width={'100%'}
              height={'400px'}
              chartType="BarChart"
              loader={<Spinner animation="grow"/>}
              data={winesPerProducerData}
              options={winesPerProducerOptions}
            />
          }
          {topRatedWinesData &&
            <Chart
              width={'100%'}
              height={'400px'}
              chartType="ColumnChart"
              loader={<Spinner animation="grow"/>}
              data={topRatedWinesData}
              options={{title: "Top Rated Wines"}}
            />
          }
          {winesPerRegionData &&
            <Chart
              width={'100%'}
              height={'400px'}
              chartType="PieChart"
              loader={<Spinner animation="grow"/>}
              data={winesPerRegionData}
              options={{title: "Wines Per Region"}}
            />
          }
          {winesPerSubRegionData &&
            <Chart
              width={'100%'}
              height={'400px'}
              chartType="PieChart"
              loader={<Spinner animation="grow"/>}
              data={winesPerSubRegionData}
              options={{title: "Wines Per Subregion", is3D: true}}
            />
          }
          {error &&
            <span>
                <h5>{message}</h5>
              </span>
          }
        </Card.Body>
      </Card>
    </Container>
  );
}

export default WinesReport;
