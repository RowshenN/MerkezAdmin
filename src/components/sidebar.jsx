import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { closeSidebar } from "./utils";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { logout } from "../utils/index";

import userDefault from "../images/user.png";

function Toggler({ defaultExpanded = false, renderToggle, children }) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const path = useLocation();
  const [openModal, setOpenModal] = React.useState(false);
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("userData"));

  const checkPermission = (name) => {
    const array = user?.admin?.permissions?.filter((item) => {
      return item == name;
    });

    if (array?.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <Sheet
      className="!p-[0px] !bg-[#F7F8FA]"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 100,
        padding: 0,
        height: "100dvh",
        width: "300px",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        // gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <div
        onClick={() => closeSidebar()}
        className="h-[100px] font-[600] text-[22px] border-b-[1px] border-[#E9EBF0] flex items-center justify-start pl-7"
      >
        Açyk Asman Ýyldyzy
      </div>

      <div className="min-h-[70px]   w-[80%] mx-auto border-b-[1px] border-[#E9EBF0] gap-4 font-[600] text-[22px]   flex items-center justify-center">
        <div className="min-w-[50px] min-h-[50px] rounded-[100%] bg-[#E9EBF0]">
          <img
            className="w-[50px] h-[50px] rounded-[100%] bg-[#E9EBF0]"
            src={user?.admin?.image?.original_url || userDefault}
            alt=""
          />
        </div>
        <div className="flex gap-1 flex-wrap w-full">
          <div className="text-[14px] w-full font-[500]">
            {user?.name != null ? user?.name : ""}
          </div>
        </div>
      </div>

      <Box
        className="p-3"
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <h1 className="text-[14px] my-[10px] font-[600] text-[#98A2B2] px-3 ">
          Dolandyryş paneli
        </h1>
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              onClick={() => history.push({ pathname: "/contact" })}
              selected={path.pathname.includes("/contact")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="2"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <circle cx="8" cy="10" r="2" stroke="#3B82F6" strokeWidth="2" />
                <path
                  d="M14 8H18"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 12H18"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 16H18"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">
                  Habarlaşmak
                </div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              onClick={() => history.push({ pathname: "/subscribes" })}
              selected={path.pathname.includes("/subscribes")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="7" r="4" stroke="#3B82F6" strokeWidth="2" />
                <path
                  d="M4 21C4 17 8 14 12 14C16 14 20 17 20 21"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <circle cx="6" cy="10" r="2" stroke="#3B82F6" strokeWidth="2" />
                <circle
                  cx="18"
                  cy="10"
                  r="2"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">
                  Yzarlaýanlar
                </div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              selected={path.pathname.includes("/news")}
              onClick={() => history.push({ pathname: "/news" })}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <text
                  x="12"
                  y="16"
                  text-anchor="middle"
                  font-size="6"
                  fill="#3B82F6"
                  font-family="Arial, sans-serif"
                  font-weight="bold"
                >
                  NEWS
                </text>
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">
                  Täzelikler
                </div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              selected={path.pathname.includes("/service")}
              onClick={() => history.push({ pathname: "/service" })}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <path
                  d="M8 10L12 8L16 10L12 12L8 10Z"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14L12 12L16 14L12 16L8 14Z"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">
                  Hyzmatlar
                </div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              selected={path.pathname.includes("/works")}
              onClick={() => history.push({ pathname: "/works" })}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <path
                  d="M8 9H16M8 12H16M8 15H16"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">Işler</div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              onClick={() => history.push({ pathname: "/banner" })}
              selected={path.pathname.includes("/banner")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  fill="#3B82F6"
                />
                <path
                  d="M3 12H21"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="7" cy="10" r="1.5" fill="white" />
                <circle cx="17" cy="14" r="1.5" fill="white" />
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">Banner</div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              onClick={() => history.push({ pathname: "/about" })}
              selected={path?.pathname.includes("/about")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9.00098" cy="6" r="4" fill="#3B82F6" />
                <ellipse
                  cx="9.00098"
                  cy="17.001"
                  rx="7"
                  ry="4"
                  fill="#3B82F6"
                />
                <path
                  d="M20.9996 17.0005C20.9996 18.6573 18.9641 20.0004 16.4788 20.0004C17.211 19.2001 17.7145 18.1955 17.7145 17.0018C17.7145 15.8068 17.2098 14.8013 16.4762 14.0005C18.9615 14.0005 20.9996 15.3436 20.9996 17.0005Z"
                  fill="#3B82F6"
                />
                <path
                  d="M17.9996 6.00073C17.9996 7.65759 16.6565 9.00073 14.9996 9.00073C14.6383 9.00073 14.292 8.93687 13.9712 8.81981C14.4443 7.98772 14.7145 7.02522 14.7145 5.99962C14.7145 4.97477 14.4447 4.01294 13.9722 3.18127C14.2927 3.06446 14.6387 3.00073 14.9996 3.00073C16.6565 3.00073 17.9996 4.34388 17.9996 6.00073Z"
                  fill="#3B82F6"
                />
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">
                  Biz barada
                </div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem className="h-[50px] hover:bg-[#3B82F6]">
            <ListItemButton
              onClick={() => history.push({ pathname: "/admins" })}
              selected={path?.pathname.includes("/admins")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9.00098" cy="6" r="4" fill="#3B82F6" />
                <ellipse
                  cx="9.00098"
                  cy="17.001"
                  rx="7"
                  ry="4"
                  fill="#3B82F6"
                />
                <path
                  d="M20.9996 17.0005C20.9996 18.6573 18.9641 20.0004 16.4788 20.0004C17.211 19.2001 17.7145 18.1955 17.7145 17.0018C17.7145 15.8068 17.2098 14.8013 16.4762 14.0005C18.9615 14.0005 20.9996 15.3436 20.9996 17.0005Z"
                  fill="#3B82F6"
                />
                <path
                  d="M17.9996 6.00073C17.9996 7.65759 16.6565 9.00073 14.9996 9.00073C14.6383 9.00073 14.292 8.93687 13.9712 8.81981C14.4443 7.98772 14.7145 7.02522 14.7145 5.99962C14.7145 4.97477 14.4447 4.01294 13.9722 3.18127C14.2927 3.06446 14.6387 3.00073 14.9996 3.00073C16.6565 3.00073 17.9996 4.34388 17.9996 6.00073Z"
                  fill="#3B82F6"
                />
              </svg>

              <ListItemContent>
                <div className="text-[14px] font-[500] text-black">
                  Adminlar
                </div>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton onClick={() => setOpenModal(true)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.125 12C16.125 11.5858 15.7892 11.25 15.375 11.25L4.40244 11.25L6.36309 9.56944C6.67759 9.29988 6.71401 8.8264 6.44444 8.51191C6.17488 8.19741 5.7014 8.16099 5.38691 8.43056L1.88691 11.4306C1.72067 11.573 1.625 11.7811 1.625 12C1.625 12.2189 1.72067 12.427 1.88691 12.5694L5.38691 15.5694C5.7014 15.839 6.17488 15.8026 6.44444 15.4881C6.71401 15.1736 6.67759 14.7001 6.36309 14.4306L4.40244 12.75L15.375 12.75C15.7892 12.75 16.125 12.4142 16.125 12Z"
                  fill="#FF4D4D"
                />
                <path
                  d="M9.375 8C9.375 8.70219 9.375 9.05329 9.54351 9.3055C9.61648 9.41471 9.71025 9.50848 9.81946 9.58145C10.0717 9.74996 10.4228 9.74996 11.125 9.74996L15.375 9.74996C16.6176 9.74996 17.625 10.7573 17.625 12C17.625 13.2426 16.6176 14.25 15.375 14.25L11.125 14.25C10.4228 14.25 10.0716 14.25 9.8194 14.4185C9.71023 14.4915 9.6165 14.5852 9.54355 14.6944C9.375 14.9466 9.375 15.2977 9.375 16C9.375 18.8284 9.375 20.2426 10.2537 21.1213C11.1324 22 12.5464 22 15.3748 22L16.3748 22C19.2032 22 20.6174 22 21.4961 21.1213C22.3748 20.2426 22.3748 18.8284 22.3748 16L22.3748 8C22.3748 5.17158 22.3748 3.75736 21.4961 2.87868C20.6174 2 19.2032 2 16.3748 2L15.3748 2C12.5464 2 11.1324 2 10.2537 2.87868C9.375 3.75736 9.375 5.17157 9.375 8Z"
                  fill="#FF4D4D"
                />
              </svg>
              <div className="text-[14px] leading-[40px] h-[40px] font-[500] !text-[#FF4D4D]">
                Çykmak
              </div>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
            <h1 className="text-[20px] font-[500]">Ulgamdan çykmak</h1>
            <button onClick={() => setOpenModal(false)}>
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
              Ulgamdan çykmak isleýärsiňizmi?
            </h1>

            <div className="flex gap-[29px] justify-center">
              <button
                onClick={() => setOpenModal(false)}
                className="text-[14px] font-[500] px-6 py-3 text-[#98A2B2] rounded-[8px] hover:bg-blue hover:text-white"
              >
                Goýbolsun et
              </button>
              <button
                onClick={() => {
                  logout();
                  history.push({ pathname: "/login" });
                }}
                className="text-[14px] font-[500] text-white hover:bg-[#fd6060] bg-[#FF4D4D] rounded-[8px] px-6 py-3"
              >
                Ulgamdan çyk
              </button>
            </div>
          </div>
        </Sheet>
      </Modal>
      <Divider />
    </Sheet>
  );
}
