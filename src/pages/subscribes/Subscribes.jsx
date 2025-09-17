import React, { useEffect, useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown, Add } from "@mui/icons-material";
import Pagination from "../../components/pagination";
import PageLoading from "../../components/PageLoading";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import { DatePicker } from "antd";

import {
  useGetAllSubscribesQuery,
  useDestroySubscribeMutation,
  useSendToPersonMutation,
  useSendToPeopleMutation,
} from "../../services/subscribes";

const Contact = () => {
  const history = useHistory();
  const { RangePicker } = DatePicker;

  const [pages, setPages] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    name: "",
    search: "",
    startDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    type: "",
  });

  const [search, setSearch] = useState("");
  const [isDelete, setISDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [isSendPersonModal, setIsSendPersonModal] = useState(false);
  const [isSendAllModal, setIsSendAllModal] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailText, setEmailText] = useState("");

  const [emailRecipient, setEmailRecipient] = useState("");

  const {
    data: rawContactsData,
    isLoading,
    refetch,
  } = useGetAllSubscribesQuery(filter.search);

  const contactsData = Array.isArray(rawContactsData)
    ? [...rawContactsData].reverse()
    : [];

  const [destroySubscribe] = useDestroySubscribeMutation();
  const [sendToPerson] = useSendToPersonMutation();
  const [sendToPeople] = useSendToPeopleMutation();

  useEffect(() => {
    const time = setTimeout(() => {
      setFilter({ ...filter, search: search });
    }, 500);
    return () => clearTimeout(time);
  }, [search]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await destroySubscribe(selectedId).unwrap();
        setISDelete(false);
        setSelectedId(null);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendPerson = async () => {
    try {
      await sendToPerson({
        email: emailRecipient,
        subject: emailSubject,
        text: emailText,
      }).unwrap();
      setIsSendPersonModal(false);
      setEmailSubject("");
      setEmailText("");
      setEmailRecipient("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAll = async () => {
    try {
      await sendToPeople({
        subject: emailSubject,
        text: emailText,
      }).unwrap();
      setIsSendAllModal(false);
      setEmailSubject("");
      setEmailText("");
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   if (contactsData?.length) {
  //     const totalPages = Math.ceil(contactsData.length / filter.limit);
  //     setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  //   }
  // }, [contactsData, filter.limit]);

  if (isLoading) return <PageLoading />;

  return (
    <div className="w-full">
      {/* header section */}
      <div className="w-full pb-[15px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Yzarlaýanlar</h1>
        <div className="w-fit flex gap-5">
          {/* <Select
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
            format={"DD-MM-YYYY"}
          /> */}

          {/* Send to All Button */}
          <Button
            onClick={() => setIsSendAllModal(true)}
            className="!h-[40px] !bg-green-600 !rounded-[8px] !px-[17px] !w-fit !text-[14px] !text-white"
          >
            Ählisine ugrat
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full p-5 bg-white rounded-[8px]">
        {/* Table search */}
        <div className="w-full mb-4 flex items-center px-4 h-[40px] rounded-[6px] border-[1px] border-[#E9EBF0]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full border-none outline-none h-[38px] pl-4 text-[14px] font-[600] text-black "
            placeholder="Gözleg"
          />
        </div>

        {/* Table header */}
        <div className="w-full gap-[20px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[25%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[60%] uppercase">
            E-mail
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[15%] uppercase">
            Hereketler
          </h1>
        </div>

        {/* Table body */}
        <div className="w-full flex flex-wrap">
          {contactsData?.map((item, i) => (
            <div
              key={"subscribe" + i}
              className="w-full gap-[20px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <h1 className="text-[14px] font-[500] text-black w-[25%] ">
                {item?.name}
              </h1>

              <h1 className="text-[14px] font-[500] text-black w-[55%] ">
                {item?.email}
              </h1>

              <h1 className="text-[14px] flex items-center justify-center gap-5 font-[500] text-[#98A2B2] w-[25%] ">
                {/* <div
                  // onClick={() =>
                  //   history.push({ pathname: "/contact/" + item?.id })
                  // }
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
                </div> */}

                {/* Send to person */}
                <div
                  onClick={() => {
                    setSelectedId(item.id);
                    setEmailRecipient(item.email);
                    setIsSendPersonModal(true);
                  }}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="blue"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </div>

                {/* Trash */}
                <div
                  onClick={() => {
                    setISDelete(true);
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
              </h1>
            </div>
          ))}
        </div>

        {/* Table footer */}
        <div className="w-full bg-white p-4 rounded-[8px] flex mt-5 justify-between items-center">
          <h1 className="text-[14px] font-[400]">
            {contactsData?.length} Yzarlaýanlar
          </h1>
          <Pagination
            meta={contactsData}
            pages={pages}
            length={contactsData?.length}
            pageNo={filter.page}
            next={() => setFilter({ ...filter, page: filter.page + 1 })}
            prev={() => setFilter({ ...filter, page: filter.page - 1 })}
            goTo={(item) => setFilter({ ...filter, page: item })}
          />
        </div>

        {/* Delete Modal */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={isDelete}
          onClose={() => setISDelete(false)}
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
              <h1 className="text-[20px] font-[500]">Yzarlaýany aýyrmak</h1>
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
                Yzarlaýany aýyrmak isleýärsiňizmi?
              </h1>

              <div className="flex gap-[29px] justify-center">
                <button
                  onClick={() => setISDelete(false)}
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

        {/* Send to Person Modal */}
        <Modal
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={isSendPersonModal}
          onClose={() => setIsSendPersonModal(false)}
        >
          <Sheet
            variant="outlined"
            sx={{ maxWidth: 700, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <h1 className="text-[20px] font-[500] mb-4">Yzarlaýana ugratmak</h1>

            {/* Autofilled Email Field */}
            <input
              type="text"
              value={emailRecipient}
              readOnly
              className="w-full outline-none mb-2 p-2 border rounded bg-gray-100"
            />

            <input
              type="text"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full outline-none mb-2 p-2 border rounded"
            />
            <textarea
              placeholder="Text"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="w-full outline-none mb-2 p-2 border rounded"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsSendPersonModal(false)}
                className="px-6 py-2 rounded border"
              >
                Goýbolsun et
              </button>
              <button
                onClick={handleSendPerson}
                className="px-6 py-2 rounded bg-blue text-white"
              >
                Ugrat
              </button>
            </div>
          </Sheet>
        </Modal>

        {/* Send to All Modal */}
        <Modal
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={isSendAllModal}
          onClose={() => setIsSendAllModal(false)}
        >
          <Sheet
            variant="outlined"
            sx={{ maxWidth: 700, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <h1 className="text-[20px] font-[500] mb-4">Ählisine ugrat</h1>
            <input
              type="text"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full outline-none mb-2 p-2 border rounded"
            />
            <textarea
              placeholder="Text"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="w-full outline-none mb-2 p-2 border rounded"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsSendAllModal(false)}
                className="px-6 py-2 rounded border"
              >
                Goýbolsun et
              </button>
              <button
                onClick={handleSendAll}
                className="px-6 py-2 rounded bg-blue text-white"
              >
                Ugrat
              </button>
            </div>
          </Sheet>
        </Modal>
      </div>
    </div>
  );
};

export default React.memo(Contact);
