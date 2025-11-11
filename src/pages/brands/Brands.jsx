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
  useGetBrandsQuery,
  useDeleteBrandMutation,
} from "../../services/brand";
import Pagination from "../../components/pagination";

const Brands = () => {
  const path = useLocation();
  const history = useHistory();

  const [filter, setFilter] = useState({
    name: "",
    order: "default",
    isActive: "",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  const [isDelete, setISDelete] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const mappedFilter = {
    ...filter,
    order:
      filter.order === "asc" || filter.order === "default" ? "asc" : "desc",
    isActive: filter.isActive === "" ? undefined : filter.isActive,
    page,
    limit,
  };

  const { data, isLoading, refetch } = useGetBrandsQuery(mappedFilter, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteBrand] = useDeleteBrandMutation();

  const handleDestroy = async () => {
    try {
      await deleteBrand(selectedBrand.id).unwrap();
      message.success("Brand deleted successfully");
      setISDelete(false);
      refetch();
    } catch (err) {
      console.error(err);
      message.error("Brand deletion failed");
    }
  };

  if (isLoading) return <PageLoading />;

  const brands = data?.brands || [];
  const meta = data?.meta || {};

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Markalar</h1>
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
            onClick={() => history.push({ pathname: "/brands/create" })}
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
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[8%] min-w-[45px] uppercase">
            Logo
          </h1>
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[25%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] w-[37%] whitespace-nowrap text-[#98A2B2] uppercase">
            Beýany
          </h1>
          <h1 className="text-[14px] text-[#98A2B2] uppercase text-center font-[500] w-[20%]">
            Kategoriya
          </h1>
          <h1 className="text-[14px] flex items-center justify-center text-[#98A2B2] uppercase font-[500] w-[20%]">
            <span className="px-4 py-2 rounded-[12px] text-[13px] font-[600]">
              Status
            </span>
          </h1>
          <h1 className="text-[14px] font-[500] whitespace-nowrap text-[#98A2B2] w-[15%] text-center uppercase">
            Hereketler
          </h1>
        </div>

        {/* Table Body */}
        {brands.map((brand, i) => (
          <div
            key={i}
            className="w-full gap-[20px] flex flex-col px-4 py-3 rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
          >
            <div className="flex items-center gap-[20px]">
              <div className="w-[8%] min-w-[45px] flex gap-1">
                <div className="relative w-[40px] h-[40px]">
                  <img
                    src={
                      brand.logo
                        ? `${
                            process.env.REACT_APP_BASE_URL
                          }${brand.logo.replace("\\", "/")}`
                        : "/placeholder.png"
                    }
                    alt={brand.name}
                    className="object-cover w-[40px] h-[40px] rounded-[4px]"
                  />
                </div>
              </div>
              <h1 className="text-[14px] line-clamp-1 font-[500] text-black w-[25%]">
                {brand.name}
              </h1>
              <h1 className="text-[14px] line-clamp-1 font-[500] text-black w-[37%]">
                {brand.description}
              </h1>
              <h1 className="text-[14px] text-center font-[500] text-black w-[20%]">
                {brand?.category?.name || "-"}
              </h1>
              <h1 className="text-[14px] flex items-center justify-center font-[500] w-[20%]">
                <span
                  className={`px-4 py-2 rounded-[12px] text-[13px] font-[600] ${
                    brand.isActive
                      ? "bg-[#44CE62] text-white"
                      : "bg-[#E91F00] text-white"
                  }`}
                >
                  {brand.isActive ? "Active" : "Disabled"}
                </span>
              </h1>
              <div className="text-[14px] flex items-center justify-center gap-2 w-[15%]">
                <Button
                  onClick={() => history.push(path.pathname + "/" + brand.id)}
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
                    setSelectedBrand(brand);
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

            {/* Shops list */}
            {/* {brand.shops?.length > 0 && (
              <div className="ml-[8%] mt-2 text-[13px] text-gray-700">
                Shops: {brand.shops.map((s) => s.name).join(", ")}
              </div>
            )} */}
          </div>
        ))}

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
              <h1 className="text-[20px] font-[500]">Delete Brand</h1>
              <button onClick={() => setISDelete(false)}>✕</button>
            </div>
            <div>
              <h1 className="text-[16px] text-center my-10 font-[400]">
                Are you sure?
              </h1>
              <div className="flex gap-[29px] justify-center">
                <button
                  onClick={() => setISDelete(false)}
                  className="text-[14px] font-[500] px-6 py-3 text-[#98A2B2] rounded-[8px]"
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

export default React.memo(Brands);
