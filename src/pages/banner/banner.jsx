import React, { useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown, Add } from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import Pagination from "../../components/pagination";
import PageLoading from "../../components/PageLoading";
import {
  useGetAllBannersQuery,
  useDeleteBannerMutation,
} from "../../services/banner";
import { message } from "antd";

const Banner = () => {
  const history = useHistory();
  const path = useLocation();

  const [filter, setFilter] = useState({
    name: "",
    order: "default",
    deleted: "false",
  });

  const mappedFilter = {
    ...filter,
    order: filter.order === "asc" || filter.order === "default" ? 1 : 0,
    deleted:
      filter.deleted === "true"
        ? true
        : filter.deleted === "false"
        ? false
        : "",
  };

  const {
    data: rawBanners = [],
    isLoading,
    refetch,
  } = useGetAllBannersQuery(mappedFilter);

  const banners = Array.isArray(rawBanners) ? [...rawBanners].reverse() : [];

  const [destroyBanner] = useDeleteBannerMutation();
  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await destroyBanner(selectedId).unwrap();
        message.success("Banner üstünlikli pozuldy!");
        refetch();
      } catch (err) {
        console.error(err);
        message.error("Pozmak başartmady!");
      } finally {
        setIsDelete(false);
        setSelectedId(null);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Banner</h1>
        <div className="w-fit flex gap-5">
          <Select
            placeholder="Hemmesini görkez"
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
            <Option value="default">Hemmesini görkez</Option>
            <Option value="asc">Adyna görä (A-Z)</Option>
            <Option value="desc">Adyna görä (Z-A)</Option>
          </Select>

          <Button
            onClick={() => history.push("/banner/create")}
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
            placeholder="Gözleg"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="w-full border-none outline-none h-[38px] pl-4 text-[14px] font-[600] text-black"
          />
        </div>

        {/* Table Header */}
        <div className="w-full gap-[10px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%]">
            Surat
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[25%]">Ady</h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[30%]">
            Text
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%]">
            Link
          </h1>
          <h1 className="text-[14px] flex items-center justify-center text-[#98A2B2] uppercase font-[500] w-[20%]">
            Status
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] text-center">
            Action
          </h1>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <PageLoading />
        ) : (
          banners.map((item, i) => (
            <div
              key={i}
              className="w-full gap-[10px] flex items-center px-4 h-[70px] border-b-[1px] border-[#E9EBF0]"
            >
              <div className="w-[10%] flex justify-start">
                <img
                  src={`${process.env.REACT_APP_BASE_URL}${item?.image}`}
                  alt="banner"
                  className="object-cover w-[40px] h-[40px] rounded-[4px]"
                />
              </div>

              <h1 className="text-[14px] font-[500] text-black w-[25%]">
                {item?.title}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[30%] line-clamp-2">
                {item?.description}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[20%] line-clamp-2">
                {item?.link}
              </h1>
              <h1 className="text-[14px] flex items-center justify-center font-[500] w-[20%]">
                <span
                  className={`px-4 py-2 rounded-[12px] text-[13px] font-[600] ${
                    item.isActive
                      ? "bg-[#44CE62] text-white"
                      : "bg-[#E91F00] text-white"
                  }`}
                >
                  {item.isActive ? "Active" : "Disabled"}
                </span>
              </h1>

              <div className="flex gap-3 items-center w-[20%] justify-center">
                <div
                  onClick={() => history.push(`/banner/${item?.id}`)}
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
                <Button
                  onClick={() => {
                    setSelectedId(item.id);
                    setIsDelete(true);
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
          ))
        )}
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        open={isDelete}
        onClose={() => setIsDelete(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <div className="flex w-[350px] border-b-[1px] border-[#E9EBF0] pb-5 justify-between items-center">
            <h1 className="text-[20px] font-[500]">Banner aýyrmak</h1>
            <button onClick={() => setIsDelete(false)}>X</button>
          </div>

          <div>
            <h1 className="text-[16px] text-center my-10 font-[400]">
              Banner aýyrmak isleýärsiňizmi?
            </h1>

            <div className="flex gap-[29px] justify-center">
              <button
                onClick={() => setIsDelete(false)}
                className="text-[14px] font-[500] px-6 py-3 text-[#98A2B2] rounded-[8px] hover:bg-blue hover:text-white"
              >
                Goýbolsun et
              </button>
              <button
                onClick={handleConfirmDelete}
                className="text-[14px] font-[500] text-white hover:bg-[#fd6060] bg-[#FF4D4D] rounded-[8px] px-6 py-3"
              >
                Aýyr
              </button>
            </div>
          </div>
        </Sheet>
      </Modal>
    </div>
  );
};

export default React.memo(Banner);
