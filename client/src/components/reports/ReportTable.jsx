import useTheme from '../../hooks/useTheme';

const ReportTable = ({ title, headers, rows, emptyMessage }) => {
  const { isDark } = useTheme();

  const th = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider`;
  const td = `px-4 py-3 text-sm`;

  return (
    <div>
      <h3 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-700'}`}>
        {title}
      </h3>
      {!rows || rows.length === 0 ? (
        <div className={`text-center py-6 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          {emptyMessage || 'No data available.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={isDark ? 'bg-slate-700' : 'bg-blue-800'}>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className={`${th} ${isDark ? 'text-slate-300' : 'text-white'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`transition duration-150 ${
                    isDark
                      ? rowIndex % 2 === 0 ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-900 hover:bg-slate-700'
                      : rowIndex % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`${td} ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportTable;