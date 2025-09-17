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

import { useCreateNewsMutation } from "../../services/news";

const NewsCreate = () => {
  const history = useHistory();
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  const [imgFile, setImgFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [bigPostPicture, setBigPostPicture] = useState(null);
  const fileRef = useRef(null);
  const [warning, setWarning] = useState(false);
  const [news, setNews] = useState({
    name_tm: "",
    name_ru: "",
    name_en: "",
    text_tm: "",
    text_ru: "",
    text_en: "",
    date: "",
  });

  const [createNews, { isLoading }] = useCreateNewsMutation();

  const handleSubmit = async () => {
    if (
      !news.name_tm ||
      !news.name_ru ||
      !news.name_en ||
      !news.text_tm ||
      !news.text_ru ||
      !news.text_en ||
      !news.date
    ) {
      setWarning(true);
      return;
    }

    const formData = new FormData();
    formData.append("name_tm", news.name_tm);
    formData.append("name_ru", news.name_ru);
    formData.append("name_en", news.name_en);
    formData.append("text_tm", news.text_tm);
    formData.append("text_ru", news.text_ru);
    formData.append("text_en", news.text_en);
    formData.append("date", news.date);

    if (imgFile) formData.append("img", imgFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      await createNews(formData).unwrap();
      message.success("Täzelik üstünlikli döredildi");
      history.push("/news");
    } catch (error) {
      console.error("Error creating news:", error);
      message.error("Maglumatlary barlaň");
    }
  };

  if (isLoading) return <PageLoading />;

  return (
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

      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Täzelik</h1>
      </div>

      {/* Form */}
      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className="flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Täzeligiň maglumaty</h1>
        </div>
        {/* Image & Video Upload */}
        <div className="flex items-start justify-between py-[30px] gap-4">
          {/* Image Upload */}
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Täzelik suratlary</h1>
            <div className="flex gap-5 mt-5 flex-wrap">
              {imgFile && (
                <div className="relative w-[75px] h-[75px]">
                  <img
                    src={URL.createObjectURL(imgFile)}
                    alt={imgFile.name}
                    className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  />
                  <div
                    onClick={() => setImgFile(null)}
                    className="absolute -top-2 -right-2 cursor-pointer bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </div>
                </div>
              )}

              {!imgFile && (
                <div
                  onClick={() => (videoFile ? null : imgRef.current.click())}
                  className="border-[2px] w-full border-dashed border-[#98A2B2] p-5 rounded-[6px] cursor-pointer"
                >
                  + Surat goş
                </div>
              )}
              <input
                ref={imgRef}
                type="file"
                className="hidden"
                onChange={(e) => setImgFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Video Upload */}
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Täzelik wideosy</h1>
            <div className="flex gap-5 mt-5 flex-wrap">
              {videoFile && (
                <div className="relative w-[75px] h-[75px]">
                  <video
                    src={URL.createObjectURL(videoFile)}
                    className="w-[75px] h-[75px] object-cover rounded-[6px]"
                    controls
                  />
                  <div
                    onClick={() => setVideoFile(null)}
                    className="absolute -top-2 -right-2 cursor-pointer bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </div>
                </div>
              )}

              {!videoFile && (
                <div
                  onClick={() => (imgFile ? null : videoRef.current.click())}
                  className="border-[2px] w-full border-dashed border-[#98A2B2] p-5 rounded-[6px] cursor-pointer"
                >
                  + Wideo goş
                </div>
              )}
              <input
                ref={videoRef}
                type="file"
                className="hidden"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {/* Input fields */}
        <div className="flex items-start justify-between pt-7">
          <div className="w-[49%] flex flex-col items-start justify-start gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (türkmen dilinde)</h1>
              <input
                value={news.name_tm}
                onChange={(e) => setNews({ ...news, name_tm: e.target.value })}
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (iňlis dilinde)</h1>
              <input
                value={news.name_en}
                onChange={(e) => setNews({ ...news, name_en: e.target.value })}
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (rus dilinde)</h1>
              <input
                value={news.name_ru}
                onChange={(e) => setNews({ ...news, name_ru: e.target.value })}
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Täzeligiň senesi</h1>
              <input
                value={news.date}
                onChange={(e) => setNews({ ...news, date: e.target.value })}
                type="date"
                className="border-[1px] w-full border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>

          <div className="w-[49%] flex flex-col items-baseline justify-start gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (türkmen dilinde)</h1>
              <textarea
                value={news.text_tm}
                onChange={(e) => setNews({ ...news, text_tm: e.target.value })}
                placeholder="Text..."
                className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (iňlis dilinde)</h1>
              <textarea
                value={news.text_en}
                onChange={(e) => setNews({ ...news, text_en: e.target.value })}
                placeholder="Text..."
                className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (rus dilinde)</h1>
              <textarea
                value={news.text_ru}
                onChange={(e) => setNews({ ...news, text_ru: e.target.value })}
                placeholder="Text..."
                className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
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

      {/* Big image modal */}
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

export default React.memo(NewsCreate);
