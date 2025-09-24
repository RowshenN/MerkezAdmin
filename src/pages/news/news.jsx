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
  useGetAllNewsQuery,
  useDestroyNewsMutation,
} from "../../services/news";

const News = () => {
  const path = useLocation();
  const history = useHistory();
  const [filter, setFilter] = useState({
    name: "",
    order: "default",
    deleted: "false",
  });
  const [isDelete, setISDelete] = useState(false);
  const [identifier, setIdentifier] = useState(null);

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
    data: rawNews = [],
    isLoading,
    refetch,
  } = useGetAllNewsQuery(mappedFilter);
  const news = Array.isArray(rawNews) ? [...rawNews].reverse() : [];
  const [destroyNews] = useDestroyNewsMutation();

  const handleDestroy = async () => {
    try {
      await destroyNews(identifier).unwrap();
      message.success("Täzelik üstünlikli pozuldy");
      setISDelete(false);
      refetch();
    } catch (error) {
      console.error(error);
      message.error("Täzelik pozulmady");
    }
  };

  if (isLoading) return <PageLoading />;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Täzelikler</h1>
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
            <Option value="asc">Adyna görä (A-Z) </Option>
            <Option value="desc">-Adyna görä (Z-A) </Option>
          </Select>
          <Select
            placeholder="Hemmesini görkez"
            onChange={(e, value) => setFilter({ ...filter, deleted: value })}
            value={filter.deleted}
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
            <Option value="false">Aktiw</Option>
            <Option value="true">Aktiw däl</Option>
          </Select>
          <Button
            onClick={() => history.push({ pathname: "/news/create" })}
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
        {/* Table header */}
        <div className="w-full gap-[20px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[8%] min-w-[45px] uppercase">
            Media
          </h1>
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[25%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[47%] whitespace-nowrap uppercase">
            Text
          </h1>
          <h1 className="text-[14px] font-[500] whitespace-nowrap text-[#98A2B2] w-[8%] text-center uppercase">
            Senesi
          </h1>
          <h1 className="text-[14px] font-[500] whitespace-nowrap text-[#98A2B2] w-[22%] text-center uppercase">
            Status
          </h1>
        </div>

        {/* Table body */}
        {Array.isArray(news) ? (
          news.map((item, i) => (
            <div
              key={"news" + i}
              className="w-full gap-[20px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <div className="w-[8%] min-w-[45px] flex gap-1">
                <div className="relative w-[40px] h-[40px]">
                  {item?.Imgs?.length > 0 ? (
                    <img
                      src={`${
                        process.env.REACT_APP_BASE_URL
                      }./${item.Imgs[0].src.split("\\").pop()}`}
                      alt={item?.Imgs[0]?.name || "news image"}
                      className="object-cover w-[40px] h-[40px] rounded-[4px]"
                    />
                  ) : item?.Videos?.length > 0 ? (
                    <video
                      src={`${
                        process.env.REACT_APP_BASE_URL
                      }uploads/news/${item.Videos[0].src.split("\\").pop()}`}
                      className="object-cover w-[40px] h-[40px] rounded-[4px]"
                      controls={false}
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="placeholder"
                      className="object-cover w-[40px] h-[40px] rounded-[4px]"
                    />
                  )}

                  {/* Badge for video if no image */}
                  {item?.Videos?.length > 0 && item?.Imgs?.length === 0 && (
                    <span className="absolute bottom-0 left-0 text-[10px] px-1 py-[1px] bg-red text-white rounded-tl-[4px]">
                      Video
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-[14px] font-[500] text-black w-[25%]">
                {item?.name_tm}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[45%]">
                {item?.text_tm}
              </h1>

              <h1 className="text-[14px] font-[500] text-black w-[20%] text-center">
                {item?.date
                  ? new Date(item.date).toLocaleDateString("en-GB")
                  : "-"}
              </h1>

              <h1 className="text-[14px] flex items-center justify-between gap-2 font-[500] text-[#98A2B2] w-[15%] uppercase">
                <div
                  className={`bg-opacity-15 px-4 py-2 w-fit rounded-[12px] ${
                    item?.deleted
                      ? "text-[#E9B500] bg-[#E9B500]"
                      : "text-[#44CE62] bg-[#44CE62]"
                  }`}
                >
                  {item?.deleted ? "Aktiw däl" : "Aktiw"}
                </div>

                <div
                  onClick={() =>
                    history.push({ pathname: path?.pathname + "/" + item?.id })
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

                {/* <div
                  onClick={() => {
                    setISDelete(true);
                    setIdentifier(item.id);
                  }}
                  className="cursor-pointer"
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
                </div> */}
              </h1>
            </div>
          ))
        ) : (
          <div>Ýok</div>
        )}

        {/* Delete modal */}
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
              <h1 className="text-[20px] font-[500]">Täzeligi aýyrmak</h1>
              <button onClick={() => setISDelete(false)}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 1L1.00006 14.9999M0.999999 0.999943L14.9999 14.9999"
                    stroke="#B1B1B1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div>
              <h1 className="text-[16px] text-center my-10 font-[400]">
                Täzeligi aýyrmak isleýärsiňizmi?
              </h1>
              <div className="flex gap-[29px] justify-center">
                <button
                  onClick={() => setISDelete(false)}
                  className="text-[14px] font-[500] px-6 py-3 text-[#98A2B2] rounded-[8px] hover:bg-blue hover:text-white"
                >
                  Goýbolsun et
                </button>
                <button
                  onClick={handleDestroy}
                  className="text-[14px] font-[500] text-white hover:bg-[#fd6060] bg-[#FF4D4D] rounded-[8px] px-6 py-3"
                >
                  Aýyr
                </button>
              </div>
            </div>
          </Sheet>
        </Modal>
      </div>
    </div>
  );
};

export default React.memo(News);
