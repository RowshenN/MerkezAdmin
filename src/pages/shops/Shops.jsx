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
  useGetAllShopsQuery,
  useDeleteMyShopMutation,
} from "../../services/shop";

const Shops = () => {
  const history = useHistory();
  const path = useLocation();
  const { RangePicker } = DatePicker;

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: "",
    startDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    type: "",
  });

  const [search, setSearch] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pages, setPages] = useState([]);

  // ✅ RTK Query hook for shops
  const {
    data: rawShopsData,
    isLoading,
    refetch,
  } = useGetAllShopsQuery({
    page: filter.page,
    limit: filter.limit,
    name: filter.search,
  });

  const [deleteShop] = useDeleteMyShopMutation();

  // ✅ Extract list safely
  const shopsData = Array.isArray(rawShopsData)
    ? rawShopsData
    : rawShopsData?.shops || [];

  // ✅ Handle search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // ✅ Handle pagination pages
  useEffect(() => {
    if (rawShopsData?.totalPages) {
      const totalPages = rawShopsData.totalPages;
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [rawShopsData]);

  // ✅ Handle delete
  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteShop(selectedId).unwrap();
        setIsDelete(false);
        setSelectedId(null);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  console.log("shop adminpnel:  ", shopsData);
  

  if (isLoading) return <PageLoading />;

  return (
    <div className="w-full">
      {/* header */}
      <div className="w-full pb-[15px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Dükanlar</h1>
        <div className="w-fit flex gap-5">
          <Select
            onChange={(e, value) => setFilter({ ...filter, type: value })}
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
            <Option value="payment">Töleg görä</Option>
            <Option value="cashback">cashback görä</Option>
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
          <Button
            onClick={() => history.push({ pathname: "/shops/create" })}
            className="!h-[40px] !bg-blue !rounded-[8px] !px-[17px] !w-fit !text-[14px] !text-white"
            startDecorator={<Add />}
          >
            Goş
          </Button>
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
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[3%] min-w-[45px] uppercase">
            ShopID
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] min-w-[45px] uppercase">
            Owner ID
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[8%] min-w-[45px] uppercase">
            Logo
          </h1>
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[25%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px]  font-[500] text-[#98A2B2] w-[27%] whitespace-nowrap uppercase">
            Salgysy
          </h1>
          <h1 className="text-[14px]  font-[500] text-left  text-[#98A2B2] w-[20%] whitespace-nowrap uppercase">
            Telefon belgisi
          </h1>
          <h1 className="text-[14px] font-[500] whitespace-nowrap text-[#98A2B2] w-[8%] text-center uppercase">
            Senesi
          </h1>
          <h1 className="text-[14px]  font-[500] whitespace-nowrap text-[#98A2B2] w-[15%] text-center uppercase">
            Status
          </h1>
        </div>

        {/* Table body */}
        {Array.isArray(shopsData) && shopsData.length > 0 ? (
          shopsData.map((shop, i) => (
            <div
              key={"shop" + i}
              className="w-full gap-[20px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <h1 className="text-[14px]  font-[500] text-black w-[3%]">
                {shop?.id}
              </h1>
              <h1 className="text-[14px] text-center font-[500] text-black w-[10%]">
                {shop?.ownerId}
              </h1>
              <div className="w-[8%] flex gap-1">
                <div className="relative w-[40px] h-[40px]">
                  {shop?.logo ? (
                    <img
                      src={`${process.env.REACT_APP_BASE_URL}${shop.logo}`}
                      alt={shop.name}
                      className="object-cover w-[40px] h-[40px] rounded-[4px]"
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="placeholder"
                      className="object-cover w-[40px] h-[40px] rounded-[4px]"
                    />
                  )}
                </div>
              </div>

              <h1 className="text-[14px]  font-[500] text-black w-[25%]">
                {shop?.name}
              </h1>
              <h1 className="text-[14px]  font-[500] text-black w-[27%]">
                {shop?.address || "-"}
              </h1>
              <h1 className="text-[14px]  font-[500] text-black w-[17%]">
                {shop?.phoneNumber || "-"}
              </h1>
              <h1 className="text-[14px]  font-[500] text-black w-[8%] text-center">
                {shop?.createdAt
                  ? new Date(shop.createdAt).toLocaleDateString("en-GB")
                  : "-"}
              </h1>
              <h1 className="text-[14px]  flex items-center justify-end gap-2 font-[500] text-[#98A2B2] w-[15%] uppercase">
                <div
                  className={`bg-opacity-15 px-4 py-2 w-fit rounded-[12px] ${
                    shop?.isActive
                      ? "text-[#44CE62] bg-[#44CE62]"
                      : "text-[#E9B500] bg-[#E9B500]"
                  }`}
                >
                  {shop?.isActive ? "Aktiw" : "Aktiw däl"}
                </div>

                <div
                  onClick={() =>
                    history.push({ pathname: path?.pathname + "/" + shop?.id })
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
          <div className="text-center py-4">Dükan tapylmady</div>
        )}

        {/* pagination */}
        <div className="w-full bg-white p-4 rounded-[8px] flex mt-5 justify-between items-center">
          <h1 className="text-[14px] font-[400]">
            {shopsData?.length || 0} Dükan
          </h1>
          <Pagination
            meta={{
              page: filter.page,
              totalPages: rawShopsData?.totalPages || 1,
            }}
            pages={pages}
            length={shopsData?.length}
            pageNo={filter.page}
            next={() =>
              setFilter({
                ...filter,
                page:
                  filter.page < rawShopsData?.totalPages
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

        {/* delete modal */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={isDelete}
          onClose={() => setIsDelete(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <div className="flex w-[350px] border-b-[1px] border-[#E9EBF0] pb-5 justify-between items-center">
              <h1 className="text-[20px] font-[500]">Dükan aýyrmak</h1>
              <button onClick={() => setIsDelete(false)}>
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
                Dükan aýyrmak isleýärsiňizmi?
              </h1>

              <div className="flex gap-[29px] justify-center">
                <button
                  onClick={() => setIsDelete(false)}
                  className="text-[14px] font-[500] px-6 py-3 text-[#98A2B2] rounded-[8px] hover:bg-blue hover:text-white"
                >
                  Goýbolsun et
                </button>
                <button
                  onClick={handleDelete}
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

export default React.memo(Shops);
