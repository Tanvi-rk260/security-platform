export default function KeywordReport({ data }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Keyword Density Report</h2>
      <p><strong>Total Words:</strong> {data.totalWords}</p>

      <h3 className="font-semibold mt-4">Top Single Keywords</h3>
      <table className="mt-2 w-full border">
        <thead>
          <tr>
            <th className="border px-2">Keyword</th>
            <th className="border px-2">Count</th>
            <th className="border px-2">Density (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.singleWords.map(({ phrase, count, percentage }) => (
            <tr key={phrase}>
              <td className="border px-2">{phrase}</td>
              <td className="border px-2">{count}</td>
              <td className="border px-2">{percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-semibold mt-6">Top Two-word Phrases</h3>
      <table className="mt-2 w-full border">
        <thead>
          <tr>
            <th className="border px-2">Phrase</th>
            <th className="border px-2">Count</th>
            <th className="border px-2">Density (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.phrases.map(({ phrase, count, percentage }) => (
            <tr key={phrase}>
              <td className="border px-2">{phrase}</td>
              <td className="border px-2">{count}</td>
              <td className="border px-2">{percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
