import React, { useState } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown, Add } from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import PageLoading from "../../components/PageLoading";

import {
  useGetAllAboutsQuery,
  useDestroyAboutMutation,
} from "../../services/about";

const About = () => {
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
    data: rawAbouts = [],
    isLoading,
    refetch,
  } = useGetAllAboutsQuery(mappedFilter);

  const abouts = Array.isArray(rawAbouts) ? [...rawAbouts].reverse() : [];
  const [destroyAbout] = useDestroyAboutMutation();

  const [isDelete, setIsDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDestroy = async () => {
    if (selectedId) {
      try {
        await destroyAbout(selectedId).unwrap();
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
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Biz barada</h1>
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
            <Option value="desc">-Adyna görä (Z-A)</Option>
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
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[32%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[55%] min-w-[120px] whitespace-nowrap uppercase">
            Text
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            STATUS
          </h1>
        </div>

        {/* Table Body */}
        {abouts.map((item) => (
          <div
            key={item.id}
            className="w-full gap-[30px] flex items-center px-4 h-[70px] rounded-[6px] bg-white border-b-[1px] border-[#E9EBF0]"
          >
            <h1 className="text-[14px] font-[500] line-clamp-3 text-black w-[35%]">
              {item?.name_tm}
            </h1>
            <h1 className="text-[14px] font-[500] line-clamp-3 text-black w-[55%] min-w-[120px]">
              {item?.text_tm}
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
            </h1>
          </div>
        ))}

        {/* Delete Modal */}
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

export default React.memo(About);
