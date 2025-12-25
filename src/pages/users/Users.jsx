import React, { useEffect, useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown } from "@mui/icons-material";
import Pagination from "../../components/pagination";
import PageLoading from "../../components/PageLoading";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { useHistory } from "react-router-dom";

import { useGetUsersQuery, useDeleteUserMutation } from "../../services/user";

import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../../services/blockedUser";

const Users = () => {
  const history = useHistory();
  const { RangePicker } = DatePicker;

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const [search, setSearch] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pages, setPages] = useState([]);

  const { data: rawUsers, isLoading, refetch } = useGetUsersQuery(filter);

  const [deleteUser] = useDeleteUserMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();

  const users = Array.isArray(rawUsers?.users)
    ? rawUsers.users
    : rawUsers || [];

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Pagination pages
  useEffect(() => {
    if (users?.length) {
      const totalPages = Math.ceil(users.length / filter.limit);
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [users, filter.limit]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteUser(selectedId).unwrap();
        setIsDelete(false);
        setSelectedId(null);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user.phoneNumber).unwrap();
      } else {
        await blockUser({
          phoneNumber: user.phoneNumber,
          reason: "Blocked by admin",
        }).unwrap();
      }
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <PageLoading />;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[15px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Ulanyjylar</h1>
        <div className="w-fit flex gap-5">
          <RangePicker
            value={[dayjs().subtract(1, "day"), dayjs()]}
            format="DD-MM-YYYY"
          />
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

        {/* Table Header */}
        <div className="w-full gap-[20px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
        <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[5%] uppercase">
            Id
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[25%] uppercase">
            Familyasy
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] uppercase">
            Telefon
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[15%] uppercase">
            Role
          </h1>
          <h1 className="text-[14px]  text-center font-[500] text-[#98A2B2] w-[20%] uppercase">
            Hereketler
          </h1>
        </div>

        {/* Table Body */}
        <div className="w-full flex flex-wrap">
          {users.map((user) => (
            <div
              key={user.id}
              className="w-full gap-[20px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <h1 className="text-[14px] font-[500] text-black w-[5%]">
                {user.id}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[20%]">
                {user.name}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[25%]">
                {user.surname || "-"}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[20%]">
                {user.phoneNumber}
              </h1>
              <h1 className="text-[14px] font-[500] text-black w-[15%]">
                {user.role}
              </h1>
              <div className="flex items-center justify-center gap-3 w-[20%]">
                <Button
                  size="sm"
                  color={user.isBlocked ? "success" : "danger"}
                  onClick={() => handleBlockToggle(user)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsDelete(true);
                    setSelectedId(user.id);
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
        </div>

        {/* Pagination */}
        <div className="w-full bg-white p-4 rounded-[8px] flex mt-5 justify-between items-center">
          <h1 className="text-[14px] font-[400]">{users.length} Ulanyjylar</h1>
          <Pagination
            meta={{
              page: filter.page,
              totalPages: Math.ceil(users.length / filter.limit),
            }}
            pages={pages}
            length={users.length}
            pageNo={filter.page}
            next={() => setFilter({ ...filter, page: filter.page + 1 })}
            prev={() => setFilter({ ...filter, page: filter.page - 1 })}
            goTo={(item) => setFilter({ ...filter, page: item })}
          />
        </div>

        {/* Delete modal */}
        <Modal
          open={isDelete}
          onClose={() => setIsDelete(false)}
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
              <h1 className="text-[20px] font-[500]">Ulanyjyny pozmak</h1>
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
                Ulanyjyny pozmak isleýärsiňizmi?
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

export default React.memo(Users);
