'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ResultsPage = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    // Wait for the router to be ready and query to be populated
    if (router.isReady && router.query.data) {
      try {
        const parsedData = JSON.parse(router.query.data); // Parse the SSL data
        setData(parsedData);
        setDomain(router.query.domain || "Unknown domain");
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [router.isReady, router.query]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading SSL data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-800">
          SSL Certificate Results for {domain}
        </h1>
        <div className="border rounded-lg p-4">
          <ul>
            <li className="mb-2">
              <strong>Status: </strong>
              <span className={data.valid ? "text-green-600" : "text-red-600"}>
                {data.valid ? "Valid" : "Invalid"}
              </span>
            </li>
            <li className="mb-2">
              <strong>Issuer: </strong>
              {data.issuer || "Unknown"}
            </li>
            <li className="mb-2">
              <strong>Valid From: </strong>
              {data.validFrom || "N/A"}
            </li>
            <li className="mb-2">
              <strong>Valid To: </strong>
              {data.validTo || "N/A"}
            </li>
            <li className="mb-2">
              <strong>Days Remaining: </strong>
              <span
                className={
                  data.daysRemaining > 30
                    ? "text-green-600"
                    : data.daysRemaining > 0
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {data.daysRemaining || "0"}
              </span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full bg-green-800 text-white py-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          Scan Another URL
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;