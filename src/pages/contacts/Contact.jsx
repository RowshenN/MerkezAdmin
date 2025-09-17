import React, { useEffect, useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import Pagination from "../../components/pagination";
import PageLoading from "../../components/PageLoading";
import dayjs from "dayjs";
import { DatePicker } from "antd";

import {
  useGetAllContactsQuery,
  useDeleteContactMutation,
} from "../../services/contact";

const Contact = () => {
  const history = useHistory();
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

  // RTK Query hooks
  const {
    data: rawContactsData,
    isLoading,
    refetch,
  } = useGetAllContactsQuery({
    name: filter.search,
    page: filter.page,
    limit: filter.limit,
  });

  const contactsData = Array.isArray(rawContactsData)
    ? [...rawContactsData].reverse()
    : [];

  const [deleteContact] = useDeleteContactMutation();

  // Update search filter with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Update pagination pages
  useEffect(() => {
    if (contactsData?.meta?.last_page) {
      const totalPages = contactsData.meta.last_page;
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [contactsData]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteContact(selectedId).unwrap();
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
        <h1 className="text-[30px] font-[700]">Habarlaşmak</h1>
        {/* <div className="w-fit flex gap-5">
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
            <Option value="cashback">cashback göra</Option>
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
        </div> */}
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

        {/* table header */}
        <div className="w-full gap-[20px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[25%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[30%] uppercase">
            E-mail
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[55%] uppercase">
            Text
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[5%] uppercase">
            Hereket
          </h1>
        </div>

        {/* table body */}
        <div className="w-full flex flex-wrap">
          {contactsData?.map((item) => (
            <div
              key={item.id}
              className="w-full gap-[20px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <h1 className="text-[14px] font-[500] text-black w-[25%]  ">
                {item.name}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[30%]  ">
                {item.email}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[60%]  ">
                {item.text}
              </h1>
              <div
                onClick={() => {
                  setIsDelete(true);
                  setSelectedId(item.id);
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
              </div>
            </div>
          ))}
        </div>

        {/* pagination */}
        <div className="w-full bg-white p-4 rounded-[8px] flex mt-5 justify-between items-center">
          <h1 className="text-[14px] font-[400]">
            {contactsData?.length} Contact
          </h1>
          <Pagination
            meta={contactsData?.meta}
            pages={pages}
            length={contactsData?.data?.length}
            pageNo={filter.page}
            next={() => setFilter({ ...filter, page: filter.page + 1 })}
            prev={() => setFilter({ ...filter, page: filter.page - 1 })}
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
              <h1 className="text-[20px] font-[500]">Contact aýyrmak</h1>
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
                Contact aýyrmak isleýärsiňizmi?
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

export default React.memo(Contact);
