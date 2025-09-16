import React, { useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import { useHistory } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { useCreateBannerMutation } from "../../services/banner";
import { message } from "antd";

const BannerCreate = () => {
  const history = useHistory();
  const fileRef = useRef(null);

  const [banner, setBanner] = useState({
    title_tm: "",
    title_en: "",
    title_ru: "",
    text_tm: "",
    text_en: "",
    text_ru: "",
    link: "",
    type: "",
  });
  const [file, setFile] = useState(null);
  const [bigPostPicture, setBigPostPicture] = useState(null);
  const [warning, setWarning] = useState(false);

  const [createBanner, { isLoading }] = useCreateBannerMutation();

  const handleCreateBanner = async () => {
    if (!banner.title_tm || !banner.title_en || !banner.title_ru) {
      setWarning(true);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(banner).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) formData.append("img", file);

      await createBanner(formData).unwrap();
      message.success("Üstünlikli döredildi!");
      history.goBack(); // Go back to /banner
    } catch (err) {
      console.error(err);
      setWarning(true);
    }
  };

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="w-full">
      {warning && (
        <Alert
          className="!fixed z-50 top-5 right-5"
          key={"title"}
          sx={{ alignItems: "flex-start" }}
          startDecorator={<WarningIcon />}
          variant="soft"
          color={"warning"}
          endDecorator={
            <IconButton
              onClick={() => setWarning(false)}
              variant="soft"
              color={"warning"}
            >
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          <div>
            <div>{"Maglumat nädogry!"}</div>
            <Typography level="body-sm" color={"warning"}>
              Maglumatlary doly we dogry girizmeli!
            </Typography>
          </div>
        </Alert>
      )}

      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Banner</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className=" flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Banner maglumaty</h1>
        </div>
        {/* Banner Images */}
        <div className="w-[49%] pt-4 mb-4 ">
          <h1 className="text-[16px] font-[500]">Banner suratlary</h1>
          <div className="flex gap-5 mt-5 justify-start">
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <div className="w-[75px] h-[75px] p-0 cursor-pointer border-[#98A2B2] rounded-[6px] relative">
                <div
                  onClick={() => setFile(null)}
                  className="bg-gray-100 text-[8px] w-[30px] h-[30px] border-2 rounded-[100%] cursor-pointer absolute -top-[20px] -right-[20px] p-[1px]"
                >
                  <CloseRoundedIcon className="text-[8px] w-[30px] h-[30px]" />
                </div>
                <img
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  src={URL.createObjectURL(file)}
                  alt=""
                />
              </div>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                className="border-[2px] w-full cursor-pointer border-[#98A2B2] border-dashed p-[25px] rounded-[6px]"
              >
                <span>Surat ýükle</span>
              </div>
            )}
          </div>
        </div>

        {/* Banner Texts */}
        <div className="flex flex-col gap-5 items-start justify-between py-[15px]">
          <div className="w-full flex items-start justify-center gap-5 ">
            <div className="w-full flex flex-col gap-4">
              {["tm", "en", "ru"].map((lang) => (
                <div key={lang} className="w-full">
                  <h1 className="text-[16px] font-[500]">Ady_{lang}</h1>
                  <input
                    type="text"
                    placeholder="Girizilmedik"
                    value={banner[`title_${lang}`]}
                    onChange={(e) =>
                      setBanner({
                        ...banner,
                        [`title_${lang}`]: e.target.value,
                      })
                    }
                    className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                  />
                </div>
              ))}
              <div className="w-full">
                <h1 className="text-[16px] font-[500]">Link</h1>
                <input
                  type="text"
                  placeholder="Banner link"
                  value={banner.link}
                  onChange={(e) =>
                    setBanner({ ...banner, link: e.target.value })
                  }
                  className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>

              <div className="w-full">
                <h1 className="text-[16px] font-[500]">Type</h1>
                <input
                  type="text"
                  placeholder="Banner type"
                  value={banner.type}
                  onChange={(e) =>
                    setBanner({ ...banner, type: e.target.value })
                  }
                  className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              {["tm", "en", "ru"].map((lang) => (
                <div key={lang} className="w-full">
                  <h1 className="text-[16px] font-[500]">Text_{lang}</h1>
                  <textarea
                    placeholder={`Text_${lang}`}
                    value={banner[`text_${lang}`]}
                    onChange={(e) =>
                      setBanner({ ...banner, [`text_${lang}`]: e.target.value })
                    }
                    className="text-[14px] min-h-[100px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="sticky bottom-0 py-2 bg-[#F7F8FA] w-full">
        <div className="w-full mt-4 flex justify-end items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
          <div className="w-fit flex gap-6 items-center">
            <button
              onClick={() => history.goBack()}
              className="text-blue text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red hover:text-white rounded-[8px]"
            >
              Goýbolsun et
            </button>
            <button
              onClick={handleCreateBanner}
              className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
            >
              Ýatda sakla
            </button>
          </div>
        </div>
      </div>

      {/* Big image preview */}
      <Modal
        open={bigPostPicture != null}
        onClose={() => setBigPostPicture(null)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 600,
            width: "50%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <div className="w-full flex justify-center items-center">
            <img
              className="w-[50%] object-contain"
              src={bigPostPicture}
              alt=""
            />
          </div>
        </Sheet>
      </Modal>
    </div>
  );
};

export default React.memo(BannerCreate);
