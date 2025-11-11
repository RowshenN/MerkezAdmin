import React, { useState, useMemo } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import {
  KeyboardArrowDown,
  Add,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import { useGetAllCategoriesFlatQuery } from "../../services/category";
import Pagination from "../../components/pagination";

const Categories = () => {
  const path = useLocation();
  const history = useHistory();

  const [filter, setFilter] = useState({
    name: "",
    order: "default",
    status: "all",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [expanded, setExpanded] = useState({});

  const mappedFilter = {
    ...filter,
    order: filter.order === "asc" || filter.order === "default" ? 1 : 0,
    isActive:
      filter.status === "active"
        ? true
        : filter.status === "inactive"
        ? false
        : undefined,
  };

  const { data: rawCategories = [], isLoading } = useGetAllCategoriesFlatQuery({
    ...mappedFilter,
    page,
    limit,
  });

  const categories = Array.isArray(rawCategories?.categories)
    ? rawCategories.categories
    : [];

  // Build tree structure from flat list
  const buildTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach((item) => (map[item.id] = { ...item, children: [] }));

    list.forEach((item) => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };
  const treeCategories = useMemo(() => buildTree(categories), [categories]);

  const meta = rawCategories?.meta || {};

  if (isLoading) return <PageLoading />;

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCategoryRow = (cat, level = 0) => {
    const isOpen = expanded[cat.id];
    const hasChildren = cat.children && cat.children.length > 0;

    return (
      <React.Fragment key={cat.id}>
        <div
          onClick={() => hasChildren && toggleExpand(cat.id)}
          className={`w-full flex items-center gap-[20px] px-4 h-[70px] cursor-pointer border-b border-[#E9EBF0] ${
            level > 0 ? "bg-[#FAFAFA]" : "bg-white"
          } hover:bg-gray-50 transition-all`}
          style={{
            paddingLeft: `${20 + level * 25}px`,
          }}
        >
          {/* Expand/Collapse */}
          <div className="cursor-pointer w-[10%] flex items-center">
            {hasChildren ? (
              isOpen ? (
                <ExpandLess fontSize="small" className="text-gray-700" />
              ) : (
                <ExpandMore fontSize="small" className="text-gray-700" />
              )
            ) : (
              <span className="w-[20px]" />
            )}
            <span className="ml-1 text-[14px] font-[500] text-black">
              {cat.id}
            </span>
          </div>

          <div className="w-[20%]">
            <img
              src={`${process.env.REACT_APP_BASE_URL}./${cat.image}`}
              alt={cat.name}
              className="object-cover w-[40px] h-[40px] rounded-[4px] border border-gray-200"
            />
          </div>

          <p className="text-[14px] font-[500] text-black w-[30%]">
            {cat.name}
          </p>

          <p className="text-[14px] font-[500] text-black w-[10%]">
            {cat.level}
          </p>

          <p className="text-[14px] font-[500] text-black w-[10%]">
            {cat.parentId || "0"}
          </p>

          <div className="flex justify-end items-center gap-3 w-[20%]">
            <span
              className={`px-4 py-2 rounded-[12px] text-[13px] font-[600] ${
                cat.isActive
                  ? "bg-[#44CE62] text-white"
                  : "bg-[#E91F00] text-white"
              }`}
            >
              {cat.isActive ? "Active" : "Disabled"}
            </span>

            <div
              onClick={() =>
                history.push({ pathname: `${path.pathname}/${cat.id}` })
              }
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-[6px]"
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
          </div>
        </div>

        {/* Children */}
        {isOpen &&
          hasChildren &&
          cat.children.map((child) => renderCategoryRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Kategoriýalar</h1>

        <div className="flex gap-5 items-center">
          {/* Order select */}
          <Select
            placeholder="Tertiple"
            onChange={(e, value) => setFilter({ ...filter, order: value })}
            value={filter.order}
            className="!border-[#E9EBF0] !border-[1px] !h-[40px] !bg-white !rounded-[8px] !px-[17px] !min-w-[180px] !text-[14px] !text-black"
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

          {/* Status filter */}
          <Select
            placeholder="Status"
            onChange={(e, value) => setFilter({ ...filter, status: value })}
            value={filter.status}
            className="!border-[#E9EBF0] !border-[1px] !h-[40px] !bg-white !rounded-[8px] !px-[17px] !min-w-[180px] !text-[14px] !text-black"
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
            <Option value="all">Hemmesini görkez</Option>
            <Option value="active">Aktiw</Option>
            <Option value="inactive">Aktiw däl</Option>
          </Select>

          <Button
            onClick={() => history.push({ pathname: "/categories/create" })}
            className="!h-[40px] !bg-blue !rounded-[8px] !px-[17px] !w-fit !text-[14px] !text-white"
            startDecorator={<Add />}
          >
            Goş
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full p-5 bg-white rounded-[8px] shadow-sm">
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
        <div className="w-full flex gap-[20px] items-center px-4 h-[40px] rounded-[6px] bg-[#F7F8FA]">
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            ID
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] uppercase">
            Surat
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[30%] uppercase">
            Ady
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            Level
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[10%] uppercase">
            Parent
          </h1>
          <h1 className="text-[14px] font-[500] text-[#98A2B2] w-[20%] text-right pr-6 uppercase">
            Status
          </h1>
        </div>

        {treeCategories.length > 0 ? (
          treeCategories.map((cat) => renderCategoryRow(cat))
        ) : (
          <div className="text-center text-gray-500 py-6">Maglumat ýok</div>
        )}

        <div className="mt-4 ">
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
      </div>
    </div>
  );
};

export default React.memo(Categories);
