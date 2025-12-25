import React, { useEffect, useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown, Add } from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import Pagination from "../../components/pagination";
import PageLoading from "../../components/PageLoading";
import dayjs from "dayjs";
import { DatePicker } from "antd";

import {
  useGetAllRequestsQuery,
  useDeleteRequestMutation,
} from "../../services/request";

const Requests = () => {
  const history = useHistory();
  const path = useLocation();
  const { RangePicker } = DatePicker;

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: "",
    startDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    status: "",
  });

  const [search, setSearch] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pages, setPages] = useState([]);

  // ✅ RTK Query for requests
  const {
    data: rawRequestsData,
    isLoading,
    refetch,
  } = useGetAllRequestsQuery({
    page: filter.page,
    limit: filter.limit,
    search: filter.search,
    status: filter.status,
  });

  const [deleteRequest] = useDeleteRequestMutation();

  const requestsData = Array.isArray(rawRequestsData)
    ? rawRequestsData
    : rawRequestsData?.requests || [];

  // ✅ Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // ✅ Pagination pages
  useEffect(() => {
    if (rawRequestsData?.totalPages) {
      const totalPages = rawRequestsData.totalPages;
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [rawRequestsData]);

  // ✅ Handle delete
  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteRequest(selectedId).unwrap();
        setIsDelete(false);
        setSelectedId(null);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) return <PageLoading />;

  return (
    <div className="w-full">
      {/* header */}
      <div className="w-full pb-[15px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Requestler</h1>
        <div className="w-fit flex gap-5">
          <Select
            onChange={(e, value) => setFilter({ ...filter, status: value })}
            placeholder="Hemmesini görkez"
            className="!border-[#E9EBF0] !border-[1px] !h-[40px] !bg-white !rounded-[8px] !px-[17px] !w-fit !min-w-[200px] !text-[14px] !text-black"
            indicator={<KeyboardArrowDown className="!text-[16px]" />}
            sx={{
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          >
            <Option value="">Hemmesini görkez</Option>
            <Option value="pending">Pending</Option>
            <Option value="accepted">Accepted</Option>
            <Option value="rejected">Rejected</Option>
          </Select>

          <RangePicker
            value={[
              dayjs(filter.startDate, "YYYY-MM-DD"),
              dayjs(filter.endDate, "YYYY-MM-DD"),
            ]}
            onChange={(a, b) => {
              b[0] &&
                b[1] &&
                setFilter({
                  ...filter,
                  startDate: dayjs(b[0]).format("YYYY-MM-DD"),
                  endDate: dayjs(b[1]).format("YYYY-MM-DD"),
                });
            }}
            format="DD-MM-YYYY"
          />
        </div>
      </div>

      {/* table */}
      <div className="w-full p-5 bg-white rounded-[8px]">
        {/* search */}
        <div className="w-full mb-4 flex items-center px-4 h-[40px] rounded-[6px] border-[1px] border-[#E9EBF0]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full border-none outline-none h-[38px] pl-4 text-[14px] font-[600] text-black"
            placeholder="Gözleg"
          />
        </div>

        {/* Table header */}
        <div className="w-full gap-[20px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[3%] uppercase">
            ID
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[5%] uppercase">
            UserId
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[25%] uppercase">
            Familvasy
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] uppercase">
            Telefon
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[15%] uppercase">
            Business Type
          </h1>
          <h1 className="text-[14px] font-[500] text-left text-[#98A2B2] w-[27%] uppercase">
            Address
          </h1>
          <h1 className="text-[14px] font-[500] whitespace-nowrap text-[#98A2B2] w-[13%] text-center uppercase">
            Status
          </h1>
        </div>

        {/* Table body */}
        {Array.isArray(requestsData) && requestsData.length > 0 ? (
          requestsData.map((req, i) => (
            <div
              onDoubleClick={() =>
                history.push({ pathname: path?.pathname + "/" + req?.id })
              }
              key={"req" + i}
              className="w-full cursor-pointer gap-[20px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <h1 className="text-[14px] font-[500] text-black w-[3%]">
                {req?.id}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[5%]">
                {req?.userId}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[10%]">
                {req?.user?.name || "-"}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[25%]">
                {req?.surname}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[20%]">
                {req?.phoneNumber || "-"}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[15%]">
                {req?.businessType?.name || "-"}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[27%]">
                {req?.address || "-"}
              </h1>
              <h1 className="text-[14px] uppercase flex items-center gap-2 justify-center font-[500] text-[#98A2B2] w-[10%]">
                <div
                  className={`rounded-lg py-2 text-white text-[14px] font-medium px-3 ${
                    req?.status == "pending"
                      ? "bg-yellow"
                      : req?.status == "accepted"
                      ? "bg-green"
                      : "bg-red"
                  }`}
                >
                  {req?.status}
                </div>
                <div
                  onClick={() =>
                    history.push({ pathname: path?.pathname + "/" + req?.id })
                  }
                  className="cursor-pointer p-2"
                >
                  <svg
                    width="3"
                    height="15"
                    viewBox="0 0 3 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="1.5" cy="1.5" r="1.5" fill="black" />
                    <circle cx="1.5" cy="7.5" r="1.5" fill="black" />
                    <circle cx="1.5" cy="13.5" r="1.5" fill="black" />
                  </svg>
                </div>
              </h1>
            </div>
          ))
        ) : (
          <div className="text-center py-4">Request tapylmady</div>
        )}

        {/* pagination */}
        <div className="w-full bg-white p-4 rounded-[8px] flex mt-5 justify-between items-center">
          <h1 className="text-[14px] font-[400]">
            {requestsData?.length || 0} Request
          </h1>
          <Pagination
            meta={{
              page: filter.page,
              totalPages: rawRequestsData?.totalPages || 1,
            }}
            pages={pages}
            length={requestsData?.length}
            pageNo={filter.page}
            next={() =>
              setFilter({
                ...filter,
                page:
                  filter.page < rawRequestsData?.totalPages
                    ? filter.page + 1
                    : filter.page,
              })
            }
            prev={() =>
              setFilter({
                ...filter,
                page: filter.page > 1 ? filter.page - 1 : 1,
              })
            }
            goTo={(item) => setFilter({ ...filter, page: item })}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Requests);
