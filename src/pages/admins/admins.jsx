import React, { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { Add } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import Pagination from "../../components/pagination";
import PageLoading from "../../components/PageLoading";
import {
  useGetAllAdminsQuery,
  useDeleteAdminMutation,
  useDestroyAdminMutation,
} from "../../services/admin";

const Admins = () => {
  const history = useHistory();
  const [pages, setPages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDelete, setISDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search_query: "",
  });
  const [search, setSearch] = useState("");

  const {
    data: rawAdmins,
    error,
    isLoading,
  } = useGetAllAdminsQuery({
    active: true,
    name: search,
    deleted: false,
  });

  const admins = Array.isArray(rawAdmins) ? [...rawAdmins].reverse() : [];

  const [deleteAdmin] = useDestroyAdminMutation();

  useEffect(() => {
    if (admins) {
      setUsers(admins);
    }
  }, [admins]);

  useEffect(() => {
    const time = setTimeout(() => {
      setFilter({ ...filter, page: 1, search_query: search });
    }, 500);
    return () => clearTimeout(time);
  }, [search]);

  const selectItem = (id) => {
    let array = selecteds;
    let bar = array.includes(id);
    if (bar) {
      setSelecteds(array.filter((item) => item !== id));
    } else {
      array.push(id);
      setSelecteds([...array]);
    }
  };

  const selectAll = () => {
    setAllSelected(true);
    let array = users?.map((item) => item?.id) || [];
    setSelecteds([...array]);
  };

  const isSelected = (id) => selecteds.includes(id);

  const deletCategories = async () => {
    if (deleteId) {
      try {
        await deleteAdmin(deleteId).unwrap();
        setISDelete(false);

        setDeleteId(null);
      } catch (err) {
        console.error("Failed to delete admin:", err);
      }
    }
  };

  return (
    <div className="w-full">
      {/* header section */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Admins</h1>
        <div className="w-fit flex gap-5">
          <Button
            onClick={() => history.push({ pathname: "/admins/create" })}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full border-none outline-none h-[38px] pl-4 text-[14px] font-[600] text-black"
            placeholder="Gözleg"
          />
        </div>

        {/* Table header */}
        <div className="w-full gap-[20px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] whitespace-nowrap font-[500] text-[#98A2B2] w-[25%] uppercase">
            Admin ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[35%] uppercase">
            Admin Familiýa
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[15%] whitespace-nowrap uppercase">
            Telefon
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[25%] whitespace-nowrap uppercase">
            Status
          </h1>
        </div>

        {/* Table body */}
        {users?.map((item, i) => {
          return loading ? (
            <PageLoading key={i} />
          ) : (
            <div
              key={"adminItem" + i}
              className="w-full gap-[20px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <h1 className="text-[14px] font-[500] text-black w-[25%] ">
                {item?.name}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[35%] ">
                {item?.lastName}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[15%] whitespace-nowrap ">
                {item?.phone}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[25%] flex gap-2 justify-between whitespace-nowrap uppercase">
                <div
                  className={`bg-opacity-15 px-4 py-2 w-fit rounded-[12px] ${
                    item?.active
                      ? "text-[#44CE62] px-[26px] bg-[#44CE62]"
                      : "text-red bg-red"
                  }`}
                >
                  {item?.active ? "Howa" : "Ýok"}
                </div>
                <div className="flex items-center gap-3">
                  {/* 3 dots */}
                  <div
                    onClick={() =>
                      history.push({ pathname: "/admins/" + item?.id })
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

                  {/* Trash icon */}
                  <div
                    onClick={() => {
                      setDeleteId(item?.id);
                      setISDelete(true);
                    }}
                    className="cursor-pointer p-2"
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
              </h1>
            </div>
          );
        })}

        {/* Table footer */}
        {selecteds?.length === 0 ? (
          <div className="w-full flex mt-5 justify-between items-center">
            <h1 className="text-[14px] font-[400]">{users?.length} Admin</h1>
            {users && (
              <Pagination
                pageNo={filter?.page}
                length={users?.length}
                next={() =>
                  users?.length > 0 &&
                  setFilter({ ...filter, page: filter.page + 1 })
                }
                prev={() => setFilter({ ...filter, page: filter.page - 1 })}
                goTo={(item) => setFilter({ ...filter, page: item })}
              />
            )}
          </div>
        ) : (
          <div className="sticky bottom-0 w-full mt-2 flex justify-between items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
            <h1 className="text-[14px] font-[400]">
              {selecteds?.length + " "} sany saýlandy
            </h1>
            <div className="w-fit flex gap-6 items-center ">
              <button
                onClick={() => {
                  setSelecteds([]);
                  setAllSelected(false);
                }}
                className="text-[#98A2B2] text-[14px] font-[500] py-[11px] px-[27px] hover:bg-blue hover:text-white rounded-[8px]"
              >
                Goýbolsun et
              </button>
              <button
                onClick={() => setISDelete(true)}
                className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-[#FF4D4D] rounded-[8px]"
              >
                Aýyr
              </button>
            </div>
          </div>
        )}

        {/* Delete modal */}
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
            sx={{
              maxWidth: 500,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <div className="flex w-[350px] border-b-[1px] border-[#E9EBF0] pb-5 justify-between items-center">
              <h1 className="text-[20px] font-[500]">Admini aýyrmak</h1>
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
                Admini aýyrmak isleýärsiňizmi?
              </h1>

              <div className="flex gap-[29px] justify-center">
                <button
                  onClick={() => setISDelete(false)}
                  className="text-[14px] font-[500] px-6 py-3 text-[#98A2B2] rounded-[8px] hover:bg-blue hover:text-white"
                >
                  Goýbolsun et
                </button>
                <button
                  onClick={deletCategories}
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

export default React.memo(Admins);
