// import React, { useContext, useEffect, useRef, useState } from "react";
// import { useHistory, useLocation } from "react-router-dom";

// import { useGetServiceQuery } from "../../services/service.js";
// import dayjs from "dayjs";
// import CustomerDashboard from "./custumersDashboard";

// const Home = () => {
//   const history = useHistory();
//   const [castumerData, setCastumerData] = useState();
//   const [salesData, setSalesData] = useState();
//   const [daily, setDaily] = useState();
//   const [filter, setFilter] = useState({
//     startDate: dayjs(new Date().setDate(1)).format("YYYY-MM-DD"),
//     endDate: dayjs().format("YYYY-MM-DD"),
//   });
//   const { data: custumersAnalitics } = useGetServiceQuery();
//   const { data: salesSummary } = useGetServiceQuery({
//     startDate: filter.startDate,
//     endDate: filter.endDate,
//   });
//   // const { data: transactionHistorySummary } =
//   //   useGetServiceQuery({
//   //     startDate: filter.startDate,
//   //     endDate: filter.endDate,
//   //   });
//   // const { data: transactionOrderHistory } = useGetServiceQuery({
//   //   startDate: filter.startDate,
//   //   endDate: filter.endDate,
//   // });

//   useEffect(() => {
//     if (custumersAnalitics) {
//       setCastumerData(custumersAnalitics?.data);
//       console.log("custumersAnalitics", custumersAnalitics);
//     }
//   }, [custumersAnalitics]);

//   useEffect(() => {
//     if (salesSummary) {
//       let obj = salesSummary;

//       setDaily(groupedData(salesSummary?.data?.daily_sales));
//       // console.log(groupedData(salesSummary?.data?.daily_sales));
//       setSalesData(obj);
//       console.log("custumersAnalitics", salesSummary);
//     }
//   }, [salesSummary]);

//   console.log(
//     "data",
//     custumersAnalitics,
//     salesSummary
//     // transactionHistorySummary,
//     // transactionOrderHistory
//   );

//   const groupedData = (data) => {
//     // Group daily sales by date
//     const groupedSales = data?.reduce((acc, sale) => {
//       const { date, total } = sale;
//       if (!acc[date]) acc[date] = 0;
//       acc[date] += parseFloat(total);
//       return acc;
//     }, {});
//     return groupedSales;
//   };

//   return (
//     <div>
//       <div className="p-6 bg-gray-100 space-y-8">
//         <h1 className="text-2xl font-bold">Söwda barada</h1>
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-2xl shadow-md">
//             <h2 className="text-gray-600 text-lg">Jemi söwda</h2>
//             <p className="text-2xl font-bold text-blue-600">
//               {salesData?.data?.total_sales.toLocaleString()}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-2xl shadow-md">
//             <h2 className="text-gray-600 text-lg">Jemi sargytlar</h2>
//             <p className="text-2xl font-bold text-green-600">
//               {salesData?.data?.total_transactions}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-2xl shadow-md">
//             <h2 className="text-gray-600 text-lg">Jemi baha</h2>
//             <p className="text-2xl font-bold text-purple-600">
//               {salesData?.data?.average_orderValue.toFixed(2)} TMT
//             </p>
//           </div>
//         </div>
//         {/* Top Products */}
//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Esasy Harytlar
//           </h2>
//           <table className="w-full text-left border-t">
//             <thead>
//               <tr className="text-gray-500 border-b">
//                 <th className="py-2">Ady</th>
//                 <th className="py-2">Jemi satylan</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesData?.data?.top_products.map((product) => (
//                 <tr
//                   key={product.product_id}
//                   className="border-b hover:bg-gray-50"
//                 >
//                   <td className="py-2">{product.title}</td>
//                   <td className="py-2">{product.total_sold}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Günlük söwda
//           </h2>
//           <ul className="divide-y divide-gray-200">
//             <li key={"header"} className="py-2 flex justify-between">
//               <span className=" w-[33%] font-bold">Sene</span>
//               <span className="font-bold text-blue-600 w-[33%]">
//                 Cashbacks TMT
//               </span>
//               <span className="font-bold text-blue-600 w-[33%]">
//                 Jemi söwda TMT
//               </span>
//             </li>
//             {
//               // daily &&
//               //   Object.entries(daily)
//               //     .sort((a, b) => new Date(b[0]) - new Date(a[0]))
//               salesData?.data?.daily_sales.map((item) => (
//                 <li key={item?.date} className="py-2 flex justify-between">
//                   <span className="text-gray-700  w-[33%]">{item?.date}</span>
//                   <span className="font-[700] text-blue-600  w-[33%]">
//                     {item?.total_cashbacks.toFixed(2)} TMT
//                   </span>
//                   <span className="font-[700] text-blue-600  w-[33%]">
//                     {item?.total_sales.toFixed(2)} TMT
//                   </span>
//                 </li>
//               ))
//             }
//           </ul>
//         </div>
//       </div>

//       <div className="p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-6">Müşderiler barada</h1>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//           <div className="bg-white shadow-md rounded-2xl p-4">
//             <h2 className="text-lg font-semibold text-gray-700">
//               Jemi müşderiler
//             </h2>
//             <p className="text-3xl font-bold text-blue-600">
//               {castumerData?.total_customers}
//             </p>
//           </div>
//           <div className="bg-white shadow-md rounded-2xl p-4">
//             <h2 className="text-lg font-semibold text-gray-700">
//               Şul aýdaky täze müşderiler
//             </h2>
//             <p className="text-3xl font-bold text-green-600">
//               {castumerData?.new_customers_this_month}
//             </p>
//           </div>
//         </div>

//         {/* Top Customers */}
//         <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Esasy Müşderiler
//           </h2>
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="py-2 text-gray-500">Ady</th>
//                 <th className="py-2 text-gray-500">Zyýarat</th>
//                 <th className="py-2 text-gray-500">Jemi söwda (TMT)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {castumerData?.top_customers.map((item) => (
//                 <tr
//                   key={item.customer_id + "s"}
//                   className="border-b hover:bg-gray-50"
//                 >
//                   <td className="py-2">{item.name}</td>
//                   <td className="py-2">{item.visits}</td>
//                   <td className="py-2">{item.total_spent} TMT</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Customers by Group */}
//         <div className="bg-white shadow-md rounded-2xl p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Müşderi toparlary
//           </h2>
//           <ul className="space-y-2">
//             {castumerData?.customers_by_group?.map((item, index) => (
//               <li key={index} className="flex justify-between border-b py-2">
//                 <span className="text-gray-700">{item.group}</span>
//                 <span className="text-gray-900 font-bold">{item.count}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from "react";

const Home = () => {
  return <div></div>;
};

export default Home;
