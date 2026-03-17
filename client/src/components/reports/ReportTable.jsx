const ReportTable = ({ title, headers, rows, emptyMessage }) => {
  if (!rows || rows.length === 0) {
    return (
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-3">{title}</h3>
        <div className="text-center py-6 text-gray-500 text-sm">
          {emptyMessage || 'No data available.'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-800 text-white">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-gray-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;