// pages/news/NewsUpdate.jsx
import React, { useEffect, useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import { Button, Popconfirm, message } from "antd";
import { useHistory, useParams } from "react-router-dom";
import PageLoading from "../../components/PageLoading";

import {
  useGetNewsQuery,
  useUpdateNewsMutation,
  useDestroyNewsMutation,
} from "../../services/news";

const NewsUpdate = () => {
  const history = useHistory();
  const { id } = useParams();
  const fileRef = useRef(null);

  const [news, setNews] = useState({
    name_tm: "",
    name_ru: "",
    name_en: "",
    text_tm: "",
    text_ru: "",
    text_en: "",
    img: null,
    date: "",
  });
  const [oldImg, setOldImg] = useState(null); // old image from backend
  const [file, setFile] = useState(null); // new uploaded file
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error } = useGetNewsQuery(id);
  const [updateNews] = useUpdateNewsMutation();
  const [destroyNews] = useDestroyNewsMutation();

  // Load news data
  useEffect(() => {
    if (data) {
      setNews(data);
      setOldImg(data.Imgs?.[0] || null);
    }
  }, [data]);

  if (isLoading) return <PageLoading />;
  if (error) return <div>Ýalňyşlyk boldy</div>;

  // Handle new file selection
  const handleFileChange = (f) => {
    const type = f.type?.split("/")[1];
    if (
      (type === "png" || type === "jpg" || type === "jpeg") &&
      f.size <= 1024 * 1000
    ) {
      setFile(f);
      setOldImg(null); // remove old image visually
    } else {
      message.warning("Faýl görnüşi ýa-da ölçegi nädogry!");
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (
      !news.name_tm ||
      !news.name_ru ||
      !news.name_en ||
      !news.text_tm ||
      !news.text_ru ||
      !news.text_en
    ) {
      setWarning(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name_tm", news.name_tm);
    formData.append("name_ru", news.name_ru);
    formData.append("name_en", news.name_en);
    formData.append("text_tm", news.text_tm);
    formData.append("text_ru", news.text_ru);
    formData.append("text_en", news.text_en);
    formData.append("date", news.date || "");

    // Send kept old image ID if not removed
    if (oldImg) formData.append("keptImgIds", JSON.stringify([oldImg.id]));

    // Append new uploaded file
    if (file) formData.append("img", file);

    setLoading(true);
    try {
      await updateNews(formData).unwrap();
      message.success("Täzelik üstünlikli üýtgedildi");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.warning("Üýtgetmek başartmady!");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <PageLoading />
  ) : (
    <div className="w-full">
      {/* Alert */}
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
            <div>{"Maglumat nädogry!"}</div>
            <Typography level="body-sm" color="warning">
              Maglumatlary doly we dogry girizmeli!
            </Typography>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Täzelik</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        {/* News Image */}
        <div className="flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Täzelik suratlary</h1>
        </div>
        <div className="flex items-center object-contain justify-between py-[30px]">
          <div className="w-[49%]">
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />

            {file ? (
              <div className="relative w-[75px] h-[75px]">
                <div
                  onClick={() => setFile(null)}
                  className="absolute -top-2 -right-2 cursor-pointer bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </div>
                <img
                  src={URL.createObjectURL(file)}
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  alt="New upload"
                />
              </div>
            ) : oldImg ? (
              <div className="relative w-[75px] h-[75px]">
                <div
                  onClick={() => setOldImg(null)}
                  className="absolute -top-2 -right-2 cursor-pointer bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </div>
                <img
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }uploads/news/${oldImg.src.split("\\").pop()}`}
                  className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  alt="Old news"
                />
              </div>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                className="border-[2px] w-full border-dashed border-[#98A2B2] p-5 rounded-[6px] cursor-pointer"
              >
                <span>+ Surat goş</span>
              </div>
            )}
          </div>
        </div>

        {/* News Text */}
        <div className="flex items-start justify-between py-[15px] gap-5">
          <div className="w-[49%] flex flex-col gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (türkmen dilinde)</h1>
              <input
                value={news.name_tm}
                onChange={(e) => setNews({ ...news, name_tm: e.target.value })}
                placeholder="Ady_tm"
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (iňlis dilinde)</h1>
              <input
                value={news.name_en}
                onChange={(e) => setNews({ ...news, name_en: e.target.value })}
                placeholder="Ady_en"
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (rus dilinde)</h1>
              <input
                value={news.name_ru}
                onChange={(e) => setNews({ ...news, name_ru: e.target.value })}
                placeholder="Ady_ru"
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>
          <div className="w-[49%] flex flex-col gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (türkmen dilinde)</h1>
              <textarea
                value={news.text_tm}
                onChange={(e) => setNews({ ...news, text_tm: e.target.value })}
                placeholder="Text_tm"
                className="text-[14px] w-full min-h-[70px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (iňlis dilinde)</h1>
              <textarea
                value={news.text_en}
                onChange={(e) => setNews({ ...news, text_en: e.target.value })}
                placeholder="Text_en"
                className="text-[14px] w-full min-h-[70px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (rus dilinde)</h1>
              <textarea
                value={news.text_ru}
                onChange={(e) => setNews({ ...news, text_ru: e.target.value })}
                placeholder="Text_ru"
                className="text-[14px] w-full min-h-[70px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between py-[30px] border-t-[1px]">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]">Täzeligi poz</h1>
          </div>
          <div className="flex justify-start w-[550px]">
            <Popconfirm
              title="Täzeligi pozmak!"
              description="Siz çyndan pozmak isleýärsiňizmi?"
              onConfirm={async () => {
                try {
                  await destroyNews(id).unwrap();
                  message.success("Täzelik pozuldy");
                  history.goBack();
                } catch (err) {
                  message.warning("Pozmak başartmady!");
                }
              }}
              okText="Hawa"
              cancelText="Ýok"
            >
              <Button danger>Pozmak</Button>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 py-2 bg-[#F7F8FA] w-full">
        <div className="w-full mt-5 flex justify-end gap-4 bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
          <button
            onClick={() => history.goBack()}
            className="text-blue text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red hover:text-white rounded-[8px]"
          >
            Goýbolsun et
          </button>
          <button
            onClick={handleUpdate}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
          >
            Ýatda sakla
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NewsUpdate);
