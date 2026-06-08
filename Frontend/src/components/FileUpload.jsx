import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function FileUpload() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );

      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }
  };

  const suspiciousCount = results.filter(
    (item) => item.prediction === 1
  ).length;

  const legitimateCount =
    results.length - suspiciousCount;

  const fraudPercentage =
    results.length > 0
      ? (
          (suspiciousCount /
            results.length) *
          100
        ).toFixed(2)
      : 0;

  const avgRisk =
    results.length > 0
      ? (
          results.reduce(
            (sum, item) =>
              sum + item.risk_score,
            0
          ) / results.length
        ).toFixed(4)
      : 0;

  const chartData = {
    labels: [
      "Legitimate",
      "Suspicious",
    ],
    datasets: [
      {
        data: [
          legitimateCount,
          suspiciousCount,
        ],
        backgroundColor: [
          "#22c55e",
          "#ef4444",
        ],
      },
    ],
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>
          🛡 AI Mule Account Detector
        </h1>

        <p>
          Detect Suspicious Accounts
          Using Machine Learning
        </p>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
        />

        <button
          onClick={handleUpload}
        >
          Detect Fraud
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div className="stats-container">
            <div className="card blue">
              <h3>
                Total Accounts
              </h3>
              <p>
                {results.length}
              </p>
            </div>

            <div className="card red">
              <h3>
                Suspicious
              </h3>
              <p>
                {suspiciousCount}
              </p>
            </div>

            <div className="card green">
              <h3>
                Legitimate
              </h3>
              <p>
                {legitimateCount}
              </p>
            </div>

            <div className="card orange">
              <h3>
                Fraud %
              </h3>
              <p>
                {fraudPercentage}%
              </p>
            </div>

            <div className="card purple">
              <h3>
                Avg Risk
              </h3>
              <p>
                {avgRisk}
              </p>
            </div>
          </div>

          {suspiciousCount > 0 && (
            <div className="alert-box">
              ⚠ Warning:
              {" "}
              {suspiciousCount}
              {" "}
              suspicious accounts detected.
            </div>
          )}

          <div className="chart-container">
            <Pie data={chartData} />
          </div>

          <div className="table-container">
            <h2>
              Prediction Results
            </h2>

            <table>
              <thead>
                <tr>
                  <th>
                    Prediction
                  </th>
                  <th>Status</th>
                  <th>
                    Risk Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={
                        index
                      }
                    >
                      <td>
                        {
                          item.prediction
                        }
                      </td>

                      <td>
                        {item.prediction ===
                        1
                          ? "🔴 Mule Account"
                          : "🟢 Legitimate"}
                      </td>

                      <td>
                        {
                          item.risk_score
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default FileUpload;