import { useTable, usePagination, useSortBy, useFilters } from "react-table";

function DataTable({ data, columns, handleRowClick }) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0 },
      },
      useFilters,
      useSortBy,
      usePagination
    );

  return (
    <>
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-100 dark:bg-gray-800">
            {headerGroups.map((headerGroup, index) => (
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    key={index}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-sm text-gray-800 dark:text-white font-bold uppercase tracking-wider"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-white dark:bg-slate-600 divide-y divide-gray-200 dark:divide-gray-900"
          >
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  key={index}
                  {...row.getRowProps()}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        key={index}
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis dark:text-white max-w-xs max-h-1"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DataTable;
