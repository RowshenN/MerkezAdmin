import React, { useEffect, useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import { useHistory, useParams } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { message } from "antd";
import {
  useGetBannerQuery,
  useUpdateBannerMutation,
  useDestroyBannerMutation,
} from "../../services/banner";

const BannerUpdate = () => {
  const { id } = useParams();
  const history = useHistory();
  const fileRef = useRef(null);

  const {
    data: bannerData,
    isLoading,
    error,
  } = useGetBannerQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [updateBanner] = useUpdateBannerMutation();
  const [destroyBanner] = useDestroyBannerMutation();

  const [banner, setBanner] = useState(null);
  const [oldImg, setOldImg] = useState(null); // old image from backend
  const [file, setFile] = useState(null); // new uploaded file
  const [bigPostPicture, setBigPostPicture] = useState(null);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (bannerData) {
      setBanner(bannerData);
      setOldImg(bannerData.img ? { src: bannerData.img } : null);
    }
  }, [bannerData]);

  if (isLoading || !banner) return <PageLoading />;
  if (error) return <div>Ýalňyşlyk boldy</div>;

  const handleUpdateBanner = async () => {
    if (!banner.title_tm || !banner.title_en || !banner.title_ru) {
      setWarning(true);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(banner).forEach(([key, value]) =>
        formData.append(key, value ?? "")
      );

      // Keep old image if not removed
      if (oldImg) formData.append("keptImg", oldImg.src);

      // Append new uploaded image
      if (file) formData.append("img", file);

      await updateBanner(formData).unwrap();
      message.success("Banner üstünlikli üýtgedildi!");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.warning("Başartmady!");
    }
  };

  const handleDeleteBanner = async () => {
    try {
      await destroyBanner(banner.id).unwrap();
      message.success("Banner pozuldy!");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.warning("Pozmak başartmady!");
    }
  };

  return (
    <div className="w-full">
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

      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Banner Üýtgetmek</h1>
      </div>

      {/* Banner Form */}
      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px] flex flex-col gap-5">
        <div className=" flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500] ">Banner maglumaty</h1>
        </div>
        {/* Banner Image */}
        <div className="w-[49%]">
          <h1 className="text-[16px] font-[500]">Banner suratlary</h1>
          <div className="flex gap-5 mt-5 justify-start">
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setBigPostPicture(URL.createObjectURL(e.target.files[0]));
                  setOldImg(null); // remove old image visually
                }
              }}
            />

            {file ? (
              <div className="w-[75px] h-[75px] relative cursor-pointer border-[#98A2B2] rounded-[6px]">
                <div
                  onClick={() => setFile(null)}
                  className="absolute -top-[20px] -right-[20px] w-[30px] h-[30px] p-[1px] rounded-full border-2 bg-gray-100 flex items-center justify-center"
                >
                  <CloseRoundedIcon className="w-[16px] h-[16px]" />
                </div>
                <img
                  src={URL.createObjectURL(file)}
                  alt="banner"
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                />
              </div>
            ) : oldImg ? (
              <div className="w-[75px] h-[75px] relative cursor-pointer border-[#98A2B2] rounded-[6px]">
                <div
                  onClick={() => setOldImg(null)}
                  className="absolute -top-[20px] -right-[20px] w-[30px] h-[30px] p-[1px] rounded-full border-2 bg-gray-100 flex items-center justify-center"
                >
                  <CloseRoundedIcon className="w-[16px] h-[16px]" />
                </div>
                <img
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }uploads/banner/${oldImg.src.split("\\").pop()}`}
                  alt="banner"
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                />
              </div>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 w-full border-dashed border-[#98A2B2] p-[25px] rounded-[6px] cursor-pointer"
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
                  <h1 className="text-[16px] font-[500]">
                    Ady (
                    {lang == "tm"
                      ? "türkmen dilinde"
                      : lang == "en"
                      ? "iňlis dilinde"
                      : "rus dilinde"}
                    )
                  </h1>
                  <input
                    type="text"
                    placeholder="Ady..."
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
                <h1 className="text-[16px] font-[500]">Baglanyşygy</h1>
                <input
                  type="text"
                  placeholder="Baglanyşygy..."
                  value={banner.link}
                  onChange={(e) =>
                    setBanner({ ...banner, link: e.target.value })
                  }
                  className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                />
              </div>

              <div className="w-full">
                <h1 className="text-[16px] font-[500]">Görnüşi</h1>
                <input
                  type="text"
                  placeholder="Görnüşi..."
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
                  <h1 className="text-[16px] font-[500]">
                    Beýany (
                    {lang == "tm"
                      ? "türkmen dilinde"
                      : lang == "en"
                      ? "iňlis dilinde"
                      : "rus dilinde"}
                    )
                  </h1>
                  <textarea
                    placeholder={`Text...`}
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

        {/* Delete Button */}
        <div className="w-full mt-4 flex justify-end">
          <button
            onClick={handleDeleteBanner}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-red rounded-[8px] hover:bg-opacity-90"
          >
            Pozmak
          </button>
        </div>
      </div>

      {/* Bottom Buttons */}
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
              onClick={handleUpdateBanner}
              className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
            >
              Ýatda sakla
            </button>
          </div>
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

export default React.memo(BannerUpdate);
