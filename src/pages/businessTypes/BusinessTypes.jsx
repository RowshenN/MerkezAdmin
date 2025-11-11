import React, { useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown, Add } from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import { message } from "antd";

import {
  useGetBusinessTypesQuery,
  useDeleteBusinessTypeMutation,
} from "../../services/businessTypes";

const BusinessTypes = () => {
  const path = useLocation();
  const history = useHistory();

  const [filter, setFilter] = useState({
    name: "",
    order: "default",
    isActive: "",
  });

  const [isDelete, setISDelete] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const {
    data: businessTypes = [],
    isLoading,
    refetch,
  } = useGetBusinessTypesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteBusinessType] = useDeleteBusinessTypeMutation();

  const handleDestroy = async () => {
    try {
      await deleteBusinessType(selectedType.id).unwrap();
      message.success("Business type deleted successfully");
      setISDelete(false);
      refetch();
    } catch (err) {
      console.error(err);
      message.error("Business type deletion failed");
    }
  };

  if (isLoading) return <PageLoading />;

  // Filter business types locally (since backend GET returns all active)
  const filteredList = businessTypes.filter((t) => {
    const matchesName = t.name
      .toLowerCase()
      .includes(filter.name.toLowerCase());
    const matchesStatus =
      filter.isActive === ""
        ? true
        : filter.isActive === "true"
        ? t.isActive
        : !t.isActive;
    return matchesName && matchesStatus;
  });

  // Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    if (filter.order === "asc") return a.name.localeCompare(b.name);
    if (filter.order === "desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Biznes görnüşleri</h1>
        <div className="w-fit flex gap-5">
          <Select
            placeholder="Sort"
            onChange={(e, value) => setFilter({ ...filter, order: value })}
            value={filter.order}
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
            <Option value="default">Default</Option>
            <Option value="asc">A-Z</Option>
            <Option value="desc">Z-A</Option>
          </Select>

          <Select
            placeholder="Status"
            onChange={(e, value) => setFilter({ ...filter, isActive: value })}
            value={filter.isActive}
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
            <Option value="">All</Option>
            <Option value="true">Active</Option>
            <Option value="false">Inactive</Option>
          </Select>

          <Button
            onClick={() => history.push("/business-type/create")}
            className="!h-[40px] !bg-blue !rounded-[8px] !px-[17px] !w-fit !text-[14px] !text-white"
            startDecorator={<Add />}
          >
            Goş
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full p-5 bg-white rounded-[8px]">
        {/* Search */}
        <div className="w-full mb-4 flex items-center px-4 h-[40px] rounded-[6px] border-[1px] border-[#E9EBF0]">
          <input
            type="text"
            placeholder="Search"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="w-full border-none outline-none h-[38px] pl-4 text-[14px] font-[600] text-black"
          />
        </div>

        {/* Table Header */}
        <div className="w-full gap-[20px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[10%] uppercase">
            ID
          </h1>
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[30%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] w-[40%] text-[#98A2B2] uppercase">
            Beýany
          </h1>
          <h1 className="text-[14px] flex items-center justify-center text-[#98A2B2] uppercase font-[500] w-[20%]">
            Status
          </h1>
          <h1 className="text-[14px] font-[500] whitespace-nowrap text-[#98A2B2] w-[15%] text-center uppercase">
            Hereketler
          </h1>
        </div>

        {/* Table Body */}
        {sortedList.map((type, i) => (
          <div
            key={i}
            className="w-full gap-[20px] flex px-4 py-3 rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
          >
            <h1 className="text-[14px] font-[500] text-black w-[10%]">
              {type.id}
            </h1>
            <h1 className="text-[14px] line-clamp-1 font-[500] text-black w-[30%]">
              {type.name}
            </h1>
            <h1 className="text-[14px] line-clamp-1 font-[400] text-black w-[40%]">
              {type.description || "-"}
            </h1>
            <h1 className="text-[14px] flex items-center justify-center font-[500] w-[20%]">
              <span
                className={`px-4 py-2 rounded-[12px] text-[13px] font-[600] ${
                  type.isActive
                    ? "bg-[#44CE62] text-white"
                    : "bg-[#E91F00] text-white"
                }`}
              >
                {type.isActive ? "Active" : "Disabled"}
              </span>
            </h1>
            <div className="text-[14px] flex items-center justify-center gap-2 w-[15%]">
              <Button
                onClick={() => history.push(`${path.pathname}/${type.id}`)}
                className="!text-black !hover:bg-[#F7F8FA] !bg-white !rounded-[6px] !px-2 !py-1"
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
              </Button>
              <Button
                onClick={() => {
                  setSelectedType(type);
                  setISDelete(true);
                }}
                className="!bg-white !rounded-[6px] !px-2 !py-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="red"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path d="M9 3V4H4V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6Z" />
                  <path d="M9 8H11V18H9V8ZM13 8H15V18H13V8Z" />
                </svg>
              </Button>
            </div>
          </div>
        ))}

        {/* Delete Modal */}
        <Modal
          open={isDelete}
          onClose={() => setISDelete(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <div className="flex w-[350px] border-b-[1px] border-[#E9EBF0] pb-5 justify-between items-center">
              <h1 className="text-[20px] font-[500]">Delete Business Type</h1>
              <button onClick={() => setISDelete(false)}>✕</button>
            </div>
            <div>
              <h1 className="text-[16px] text-center my-10 font-[400]">
                Are you sure you want to delete this business type?
              </h1>
              <div className="flex gap-[29px] justify-center">
                <button
                  onClick={() => setISDelete(false)}
                  className="text-[14px] bg-blue font-[500] px-6 py-3 text-white rounded-[8px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDestroy}
                  className="text-[14px] font-[500] text-white hover:bg-[#fd6060] bg-[#FF4D4D] rounded-[8px] px-6 py-3"
                >
                  Delete
                </button>
              </div>
            </div>
          </Sheet>
        </Modal>
      </div>
    </div>
  );
};

export default React.memo(BusinessTypes);
