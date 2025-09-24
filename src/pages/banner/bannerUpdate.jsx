import React, { useEffect, useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import PageLoading from "../../components/PageLoading";
import { useHistory, useParams } from "react-router-dom";
import { Button, Popconfirm, message } from "antd";

import {
  useGetBannerQuery,
  useUpdateBannerMutation,
  useDestroyBannerMutation,
} from "../../services/banner";

const BannerUpdate = () => {
  const { id } = useParams();
  const history = useHistory();
  const imgRef = useRef(null);

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
  const [oldImg, setOldImg] = useState(null);
  const [file, setFile] = useState(null);
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

  const handleSubmit = async () => {
    if (!banner.title_tm || !banner.title_en || !banner.title_ru) {
      setWarning(true);
      return;
    }

    const formData = new FormData();
    Object.entries(banner).forEach(([key, value]) =>
      formData.append(key, value ?? "")
    );

    // Keep old image if not removed
    if (oldImg) formData.append("keptImg", oldImg.src);

    // Append new uploaded image
    if (file) formData.append("img", file);

    try {
      await updateBanner(formData).unwrap();
      message.success("Banner üstünlikli üýtgedildi!");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.error("Üýtgetmek başartmady!");
    }
  };

  const handleDelete = async () => {
    try {
      await destroyBanner(banner.id).unwrap();
      message.success("Banner pozuldy!");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.error("Pozmak başartmady!");
    }
  };

  return (
    <div className="w-full">
      {/* Warning */}
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
        <h1 className="text-[30px] font-[700]">Banner Üýtgetmek</h1>
      </div>

      {/* Form */}
      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        {/* Section Header */}
        <div className="flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Banner maglumaty</h1>
        </div>

        {/* Image Upload */}
        <div className="w-full pt-4 mb-4">
          <h1 className="text-[16px] font-[500]">Banner suraty</h1>
          <div className="flex w-[49%] gap-5 mt-5 flex-wrap">
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
            ) : oldImg ? (
              <div className="relative w-[75px] h-[75px]">
                <img
                  src={`${process.env.REACT_APP_BASE_URL}${oldImg.src
                    .split("\\")
                    .pop()}`}
                  alt="banner"
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  onClick={() =>
                    setBigPostPicture(
                      `${process.env.REACT_APP_BASE_URL}${oldImg.src
                        .split("\\")
                        .pop()}`
                    )
                  }
                />
                <div
                  onClick={() => setOldImg(null)}
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
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setBigPostPicture(URL.createObjectURL(e.target.files[0]));
                  setOldImg(null);
                }
              }}
            />
          </div>

          {/* Input Fields */}
          <div className="flex w-full flex-col items-start justify-between pt-7 gap-4">
            <div className="w-full flex gap-4">
              <div className="w-full flex-col flex items-baseline gap-5 justify-center ">
                {["tm", "en"].map((lang) => (
                  <div key={lang} className="flex w-full flex-col gap-2">
                    <h1>
                      Ady ({lang === "tm" ? "türkmen dilinde" : "iňlis dilinde"}
                      )
                    </h1>
                    <input
                      value={banner[`title_${lang}`]}
                      onChange={(e) =>
                        setBanner({
                          ...banner,
                          [`title_${lang}`]: e.target.value,
                        })
                      }
                      placeholder="Ady..."
                      className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="w-full flex-col flex items-center justify-center gap-5 ">
                <div className="flex w-full flex-col gap-2">
                  <h1>Ady (rus dilinde)</h1>
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
                  onChange={(e) =>
                    setBanner({ ...banner, link: e.target.value })
                  }
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

          {/* Delete */}
          <div className="flex items-center justify-between py-[30px] border-t-[1px]">
            <div className="w-[380px]">
              <h1 className="text-[18px] font-[500]">Banneri poz </h1>
            </div>
            <div className="flex justify-start w-[550px]">
              <Popconfirm
                title="Hyzmaty pozmak!"
                description="Siz çyndan pozmak isleýärsiňizmi?"
                onConfirm={async () => {
                  handleDelete();
                }}
                okText="Hawa"
                cancelText="Ýok"
              >
                <Button danger>Pozmak</Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
              onClick={handleSubmit}
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
