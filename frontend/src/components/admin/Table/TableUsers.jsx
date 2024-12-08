// import React from "react";
// import Card from "../card/index";

// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// function Table(props) {
//   const { tableData } = props;
//   const [sorting, setSorting] = React.useState([]);
//   // let defaultData = tableData;
//   const columns = [
//     columnHelper.accessor("fullName", {
//       id: "fullName",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">Full Name</p>
//       ),
//       cell: (info) => (
//         <p className="text-sm font-bold text-navy-700 dark:text-white">
//           {info.getValue()}
//         </p>
//       ),
//     }),
//     columnHelper.accessor("phone", {
//       id: "phone",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">
//           Phone
//         </p>
//       ),
//       cell: (info) => (
//         <p className="text-sm font-bold text-navy-700 dark:text-white">
//           {info.getValue()}
//         </p>
//       ),
//     }),
//     columnHelper.accessor("email", {
//       id: "email",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">
//           Email
//         </p>
//       ),
//       cell: (info) => (
//         <p className="text-sm font-bold text-navy-700 dark:text-white">
//           {info.getValue()}
//         </p>
//       ),
//     }),
//     columnHelper.accessor("address", {
//       id: "address",
//       header: () => (
//         <p className="text-sm font-bold text-gray-600 dark:text-white">Address</p>
//       ),
//       cell: (info) => (
//         <p className="text-sm font-bold text-navy-700 dark:text-white">
//           {info.getValue()}
//         </p>
//       ),
//     }),
//   ]; // eslint-disable-next-line
//   const [data, setData] = React.useState(() => []);
//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//     },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     debugTable: true,
//   });
//   return (
//     <Card extra={"w-full pb-10 p-4 h-full"}>

//       <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
//         <table className="w-full">
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id} className="!border-px !border-gray-400">
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <th
//                       key={header.id}
//                       colSpan={header.colSpan}
//                       onClick={header.column.getToggleSortingHandler()}
//                       className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
//                     >
//                       <div className="items-center justify-between text-xs text-gray-200">
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                         {{
//                           asc: "",
//                           desc: "",
//                         }[header.column.getIsSorted()] ?? null}
//                       </div>
//                     </th>
//                   );
//                 })}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table
//               .getRowModel()
//               .rows.slice(0, 5)
//               .map((row) => {
//                 return (
//                   <tr key={row.id}>
//                     {row.getVisibleCells().map((cell) => {
//                       return (
//                         <td
//                           key={cell.id}
//                           className="min-w-[150px] border-white/0 py-3  pr-4"
//                         >
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// }

// export default Table;
// const columnHelper = createColumnHelper();


import React from "react";
import Card from "../card/index";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Khởi tạo columnHelper
const columnHelper = createColumnHelper();

function TableUsers(props) {
  const { tableData, onEdit, onDelete } = props; // Nhận dữ liệu từ props
  const [sorting, setSorting] = React.useState([]);
  
  // Gán dữ liệu từ props vào state "data"
  const [data, setData] = React.useState(tableData);

  // Định nghĩa các cột của bảng
  const columns = [
    columnHelper.accessor("fullName", {
      id: "fullName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Full Name</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("phone", {
      id: "phone",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Phone</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Email</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("address", {
      id: "address",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Address</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Actions</p>,
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(info.row.original)} // Gọi hàm onEdit khi nhấn nút Sửa
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(info.row.original.id)} // Gọi hàm onDelete khi nhấn nút Xóa
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  // Cấu hình cho bảng sử dụng react-table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card extra={"w-full pb-10 p-4 h-full mt-4"}>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 5) // Hiển thị tối đa 5 hàng
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[150px] border-white/0 py-3  pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default TableUsers;
