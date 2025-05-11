export default function SpeedReport({ data }) {
  if (!data || !data.url) {
    return <p className="text-red-500 mt-4">Invalid report data.</p>;
  }

  return (
    <div className="mt-6 border p-4 rounded bg-gray-100">
      <h2 className="text-lg font-semibold mb-2">Speed Report</h2>
      <p><strong>URL:</strong> {data.url}</p>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Load Time:</strong> {data.loadTimeMs} ms</p>
      <p><strong>Size:</strong> {data.sizeKb} KB</p>
    </div>
  );
}
