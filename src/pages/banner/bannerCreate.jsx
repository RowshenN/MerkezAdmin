import React, { useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import PageLoading from "../../components/PageLoading";
import { useHistory } from "react-router-dom";
import { message } from "antd";

import { useCreateBannerMutation } from "../../services/banner";
import { useContext } from "react";
import ContextProvider from "../../context/context";

const BannerCreate = () => {
  const history = useHistory();
  const imgRef = useRef(null);

  const dil = useContext(ContextProvider);

  const [banner, setBanner] = useState({
    title_tm: "",
    title_ru: "",
    title_en: "",
    text_tm: "",
    text_ru: "",
    text_en: "",
    link: "",
    type: "",
  });

  const [file, setFile] = useState(null);
  const [bigPostPicture, setBigPostPicture] = useState(null);
  const [warning, setWarning] = useState(false);

  const [createBanner, { isLoading }] = useCreateBannerMutation();

  const handleSubmit = async () => {
    if (!banner.title_tm || !banner.title_ru || !banner.title_en) {
      setWarning(true);
      return;
    }

    const formData = new FormData();
    Object.entries(banner).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) formData.append("img", file);

    try {
      await createBanner(formData).unwrap();
      message.success("Banner üstünlikli döredildi");
      history.push("/banner");
    } catch (error) {
      console.error(error);
      message.error("Maglumatlary barlaň");
    }
  };

  if (isLoading) return <PageLoading />;

  return (
    <div className="w-full">
      {/* Warning Alert */}
      {warning && (
        <Alert
          className="!fixed z-50 top-5 right-5"
          sx={{ alignItems: "flex-start" }}
          startDecorator={<WarningIcon />}
          variant="soft"
          color="warning"
          endDecorator={
            <IconButton
              onClick={() => setWarning(false)}
              variant="soft"
              color="warning"
            >
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          <div>
            <div>Maglumat nädogry!</div>
            <Typography level="body-sm" color="warning">
              Maglumatlary doly we dogry girizmeli!
            </Typography>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Banner</h1>
      </div>

      {/* Form */}
      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        {/* Section Header */}
        <div className="flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Banner maglumaty</h1>
        </div>

        {/* Image Upload */}
        <div className="w-[49%] pt-4 mb-4">
          <h1 className="text-[16px] font-[500]">Banner suraty</h1>
          <div className="flex gap-5 mt-5 flex-wrap">
            {file ? (
              <div className="relative w-[75px] h-[75px]">
                <img
                  src={URL.createObjectURL(file)}
                  alt="banner"
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  onClick={() => setBigPostPicture(URL.createObjectURL(file))}
                />
                <div
                  onClick={() => setFile(null)}
                  className="absolute -top-2 -right-2 cursor-pointer bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </div>
              </div>
            ) : (
              <div
                onClick={() => imgRef.current.click()}
                className="border-[2px] w-full border-dashed border-[#98A2B2] p-5 rounded-[6px] cursor-pointer"
              >
                + Surat ýükle
              </div>
            )}
            <input
              ref={imgRef}
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col items-start justify-between pt-7 gap-4">
          <div className="w-full flex gap-4">
            <div className="w-full flex-col flex items-baseline gap-5 justify-center ">
              <div className="flex w-full flex-col gap-2">
                <h1>Ady (türkmen dilinde)</h1>
                <input
                  value={banner.title_tm}
                  onChange={(e) =>
                    setBanner({ ...banner, title_tm: e.target.value })
                  }
                  placeholder="Ady..."
                  className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>

              <div className="flex w-full flex-col gap-2">
                <h1>Ady (iňlis dilinde)</h1>
                <input
                  value={banner.title_en}
                  onChange={(e) =>
                    setBanner({ ...banner, title_en: e.target.value })
                  }
                  placeholder="Ady..."
                  className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>
            </div>
            <div className="w-full flex-col flex items-center justify-center gap-5 ">
              <div className="flex w-full flex-col gap-2">
                <h1>Ady (rus dilinde) </h1>
                <input
                  value={banner.title_ru}
                  onChange={(e) =>
                    setBanner({ ...banner, title_ru: e.target.value })
                  }
                  placeholder="Ady..."
                  className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <h1>Görnüşi</h1>
                <input
                  value={banner.type}
                  onChange={(e) =>
                    setBanner({ ...banner, type: e.target.value })
                  }
                  placeholder="Görnüşi..."
                  className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col w-full gap-2">
              <h1>Baglanyşygy</h1>
              <input
                value={banner.link}
                onChange={(e) => setBanner({ ...banner, link: e.target.value })}
                placeholder="Baglanyşygy..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
            {["tm", "en", "ru"].map((lang) => (
              <div key={lang} className="flex flex-col gap-2">
                <h1>
                  Beýany (
                  {lang === "tm"
                    ? "türkmen dilinde"
                    : lang === "en"
                    ? "iňlis dilinde"
                    : "rus dilinde"}
                  )
                </h1>
                <textarea
                  value={banner[`text_${lang}`]}
                  onChange={(e) =>
                    setBanner({ ...banner, [`text_${lang}`]: e.target.value })
                  }
                  placeholder="Text..."
                  className="text-[14px] min-h-[100px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 py-2 bg-[#F7F8FA] w-full">
        <div className="w-full mt-4 flex justify-end gap-5 items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
          <button
            onClick={() => history.goBack()}
            className="text-blue text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red hover:text-white rounded-[8px]"
          >
            Goýbolsun et
          </button>
          <button
            onClick={handleSubmit}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
          >
            Ýatda sakla
          </button>
        </div>
      </div>

      {/* Big Image Modal */}
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
