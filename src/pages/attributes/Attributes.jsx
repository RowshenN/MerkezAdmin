import React, { useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import { KeyboardArrowDown, Add } from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import Pagination from "../../components/pagination";
import { useGetAllAttributesQuery } from "../../services/attribute";

const Attributes = () => {
  const path = useLocation();
  const history = useHistory();

  const [filter, setFilter] = useState({
    name: "",
    type: "all",
    required: "all",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  const { data, isLoading } = useGetAllAttributesQuery({
    page,
    limit,
    ...filter,
  });

  const attributes = Array.isArray(data?.attributes)
    ? data.attributes
    : data || [];

  const meta = data?.meta || {};

  if (isLoading) return <PageLoading />;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Atributlar</h1>

        <div className="flex gap-5 items-center">
          {/* Type filter */}
          <Select
            placeholder="Görnüş"
            onChange={(e, value) => setFilter({ ...filter, type: value })}
            value={filter.type}
            className="!border-[#E9EBF0] !border-[1px] !h-[40px] !bg-white !rounded-[8px] !px-[17px] !min-w-[180px] !text-[14px] !text-black"
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
            <Option value="all">Hemmesi</Option>
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
            <Option value="boolean">Boolean</Option>
            <Option value="select">Select</Option>
          </Select>

          {/* Required filter */}
          <Select
            placeholder="Talap edilýärmi"
            onChange={(e, value) => setFilter({ ...filter, required: value })}
            value={filter.required}
            className="!border-[#E9EBF0] !border-[1px] !h-[40px] !bg-white !rounded-[8px] !px-[17px] !min-w-[180px] !text-[14px] !text-black"
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
            <Option value="all">Hemmesi</Option>
            <Option value="true">Hawa</Option>
            <Option value="false">Ýok</Option>
          </Select>

          <Button
            onClick={() => history.push({ pathname: "/attribute/create" })}
            className="!h-[40px] !bg-blue !rounded-[8px] !px-[17px] !w-fit !text-[14px] !text-white"
            startDecorator={<Add />}
          >
            Goş
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full p-5 bg-white rounded-[8px] shadow-sm">
        {/* Search */}
        <div className="w-full mb-4 flex items-center px-4 h-[40px] rounded-[6px] border-[1px] border-[#E9EBF0]">
          <input
            type="text"
            placeholder="Atribut ady boýunça gözle..."
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="w-full border-none outline-none h-[38px] pl-4 text-[14px] font-[600] text-black"
          />
        </div>

        {/* Table header */}
        <div className="w-full flex gap-[20px] items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            ID
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[25%] uppercase">
            Atributyň ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[15%] uppercase">
            Görnüşi
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] uppercase">
            Kategoriýa
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            Talap edilýär
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] text-right pr-6 uppercase">
            Amal
          </h1>
        </div>

        {/* Table rows */}
        {attributes.length > 0 ? (
          attributes.map((attr) => (
            <div
              key={attr.id}
              className="w-full flex items-center gap-[20px] px-4 h-[70px] border-b border-[#E9EBF0] hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="text-[14px] font-[500] text-black w-[10%]">
                {attr.id}
              </div>
              <div className="text-[14px] font-[500] text-black w-[25%]">
                {attr.name}
              </div>
              <div className="text-[14px] font-[500] text-black w-[15%]">
                {attr.type}
              </div>
              <div className="text-[14px] font-[500] text-black w-[20%]">
                {attr.category?.name || "-"}
              </div>
              <div className="text-[14px] font-[500] text-black w-[10%]">
                <span
                  className={`px-4 py-2 rounded-[12px] text-[13px] font-[600] ${
                    attr.isRequired
                      ? "bg-[#44CE62] text-white"
                      : "bg-[#E91F00] text-white"
                  }`}
                >
                  {attr.isRequired ? "Hawa" : "Ýok"}
                </span>
              </div>

              <div className="flex justify-end items-center gap-3 w-[20%]">
                <div
                  onClick={() =>
                    history.push({ pathname: `${path.pathname}/${attr.id}` })
                  }
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-[6px]"
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
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6">Maglumat ýok</div>
        )}

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            pages={Array.from(
              { length: meta.totalPages || 1 },
              (_, i) => i + 1
            )}
            meta={meta}
            goTo={(p) => setPage(p)}
            prev={() => setPage(page > 1 ? page - 1 : 1)}
            next={() =>
              setPage(page < meta.totalPages ? page + 1 : meta.totalPages)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Attributes);
