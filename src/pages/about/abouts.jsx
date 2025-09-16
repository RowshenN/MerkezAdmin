import React, { useState } from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { Add } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import Pagination from "../../components/pagination";
import {
  useGetAllAboutsQuery,
  useDestroyAboutMutation,
} from "../../services/about";

const About = () => {
  const history = useHistory();
  const [filter, setFilter] = useState({
    name: "",
    order: 1,
    deleted: false,
    page: 1,
    limit: 10,
  });

  const { data: rawAbouts = [], isLoading } = useGetAllAboutsQuery(filter);
  const [destroyAbout] = useDestroyAboutMutation();

  const abouts = Array.isArray(rawAbouts) ? [...rawAbouts].reverse() : [];

  // state for modal
  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirmDelete = async () => {
    if (selectedId) {
      await destroyAbout(selectedId);
      setIsDelete(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="w-full">
      {/* header section */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Biz barada</h1>
        <div className="w-fit flex gap-5">
          <Button
            onClick={() => history.push("/about/create")}
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
        <div className="w-full gap-[30px] flex items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[35%] uppercase">
            Header
          </h1>
          <h1 className="text-[14px] font-[500]  text-[#98A2B2] w-[55%] min-w-[120px] whitespace-nowrap uppercase">
            Text
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            Action
          </h1>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <PageLoading />
        ) : (
          abouts.map((item) => (
            <div
              key={item.id}
              className="w-full gap-[30px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
            >
              <h1 className="text-[14px] font-[500] text-black w-[35%]">
                {item?.name_tm}
              </h1>
              <h1 className="text-[14px]  font-[500] text-black w-[55%] min-w-[120px]">
                {item?.text_tm}
              </h1>
              <div className="flex gap-3 items-center w-[10%]">
                {/* 3 dots */}
                <div
                  onClick={() => history.push("/about/" + item?.id)}
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

                {/* Red Trash */}
                <button
                  onClick={() => {
                    setSelectedId(item.id);
                    setIsDelete(true);
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
                </button>
              </div>
            </div>
          ))
        )}

        {/* Table footer / Pagination */}
        <div className="w-full flex mt-5 justify-between items-center">
          <h1 className="text-[14px] font-[400]">{abouts.length} Biz barada</h1>
          <Pagination
            meta={null}
            pages={[]}
            pageNo={filter.page}
            length={abouts.length}
            next={() => setFilter({ ...filter, page: filter.page + 1 })}
            prev={() => setFilter({ ...filter, page: filter.page - 1 })}
            goTo={(item) => setFilter({ ...filter, page: item })}
          />
        </div>

        {/* Delete Confirm Modal */}
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
            variant="outlined"
            sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <div className="flex w-[350px] border-b-[1px] border-[#E9EBF0] pb-5 justify-between items-center">
              <h1 className="text-[20px] font-[500]">About aýyrmak</h1>
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
                About aýyrmak isleýärsiňizmi?
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
    </div>
  );
};

export default React.memo(About);
