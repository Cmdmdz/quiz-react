import React from "react";
import * as dataService from "../apis/DataService";
import ReactApexChart from "react-apexcharts";

export default function Chart(props) {
  const [dataCovid, setdataCovid] = React.useState(null);
  const [date, setDate] = React.useState([]);

  let timeline = [];
  let country = [];
  let cases = [];

  const findAllByLastDay = () => {
    dataService.findAllByLastDay().then((res) => {
      const { data } = res;
      setdataCovid(data);
      Object.keys(data[0].timeline.cases).map((el) => {
        timeline.push(el);
      });
    });
  };

  const showForm = (data) => {
    const sorted = [...data].sort((a, b) => {
      return b.timeline.cases[date] - a.timeline.cases[date];
    });
    for (const dataObj of sorted) {
      if (dataObj.timeline.cases[date] > 1000000) {
        country.push(dataObj.country);
        cases.push(dataObj.timeline.cases[date]);
      }
    }
    const series = [
      {
        name: country,
        data: cases,
      },
    ];
    const options = {
      series: [
        {
          data: cases,
        },
      ],
      chart: {
        type: "bar",
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: "Chart Covid 30 day",
        align: "center",
        floating: true,
      },

      xaxis: {
        categories: country,
      },
      
      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    };

    return (
      <div>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="1000"
        />{" "}
      </div>
    );
  };

  React.useEffect(() => {
    findAllByLastDay();

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDate(timeline[index]);
      if (index > 28) return (index = 0);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return dataCovid ? (
    <div>
      <h2>{date}</h2>
      {showForm(dataCovid)}
    </div>
  ) : null;
}
