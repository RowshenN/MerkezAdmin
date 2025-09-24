// pages/service/ServiceUpdate.jsx
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
  useGetServiceQuery,
  useUpdateServiceMutation,
  useDestroyServiceMutation,
} from "../../services/service";

const ServiceUpdate = () => {
  const history = useHistory();
  const { id } = useParams();
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  const [product, setProduct] = useState({
    name_tm: "",
    name_ru: "",
    name_en: "",
    text_tm: "",
    text_ru: "",
    text_en: "",
    date: "",
  });

  const [imgFiles, setImgFiles] = useState([]); // old + new images
  const [videoFile, setVideoFile] = useState(null); // only 1 video
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error } = useGetServiceQuery(id);
  const [updateService] = useUpdateServiceMutation();
  const [destroyService] = useDestroyServiceMutation();

  // Load service data
  useEffect(() => {
    if (data) {
      setProduct({
        name_tm: data.name_tm || "",
        name_ru: data.name_ru || "",
        name_en: data.name_en || "",
        text_tm: data.text_tm || "",
        text_ru: data.text_ru || "",
        text_en: data.text_en || "",
        date: data.date ? data.date.slice(0, 10) : "",
      });
      setImgFiles(data.Imgs || []);
      setVideoFile(data.Videos?.[0] || null);
    }
  }, [data]);

  if (isLoading) return <PageLoading />;
  if (error) return <div>Ýalňyşlyk boldy</div>;

  // Handle update
  const handleUpdate = async () => {
    if (
      !product.name_tm ||
      !product.name_ru ||
      !product.name_en ||
      !product.text_tm ||
      !product.text_ru ||
      !product.text_en
    ) {
      setWarning(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name_tm", product.name_tm);
    formData.append("name_ru", product.name_ru);
    formData.append("name_en", product.name_en);
    formData.append("text_tm", product.text_tm);
    formData.append("text_ru", product.text_ru);
    formData.append("text_en", product.text_en);
    formData.append("date", product.date || "");

    // Append new images
    imgFiles.forEach((file) => {
      if (file instanceof File) formData.append("img", file);
    });

    // Append video if it's a new file
    if (videoFile instanceof File) formData.append("video", videoFile);

    // Send IDs of old images/videos to keep
    const keptImgIds = imgFiles
      .filter((f) => !(f instanceof File))
      .map((f) => f.id);
    const keptVideoIds =
      videoFile && !(videoFile instanceof File) ? [videoFile.id] : [];
    formData.append("keptImgIds", JSON.stringify(keptImgIds));
    formData.append("keptVideoIds", JSON.stringify(keptVideoIds));

    setLoading(true);
    try {
      await updateService(formData).unwrap();
      message.success("Hyzmat üstünlikli üýtgedildi");
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
        <h1 className="text-[30px] font-[700]">Hyzmat</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        {/* Media Upload */}
        <div className="flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Hyzmat maglumatlary</h1>
        </div>
        <div className="flex items-start justify-between py-[30px] gap-4">
          {/* Images */}
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Suratlar</h1>
            <div className="flex gap-5 mt-5 flex-wrap">
              {imgFiles.map((file, index) => (
                <div key={index} className="relative w-[75px] h-[75px]">
                  <img
                    src={
                      file instanceof File
                        ? URL.createObjectURL(file)
                        : file.src
                        ? `${process.env.REACT_APP_BASE_URL}./${file.src
                            .split("\\")
                            .pop()}`
                        : ""
                    }
                    className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  />
                  <div
                    onClick={() =>
                      setImgFiles(imgFiles.filter((_, i) => i !== index))
                    }
                    className="absolute -top-2 -right-2 cursor-pointer bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </div>
                </div>
              ))}

              <div
                onClick={() => imgRef.current.click()}
                className="border-[2px] border-dashed border-[#98A2B2] p-5 rounded-[6px] cursor-pointer"
              >
                + Surat goş
              </div>
              <input
                ref={imgRef}
                type="file"
                className="hidden"
                onChange={(e) => setImgFiles([...imgFiles, e.target.files[0]])}
              />
            </div>
          </div>

          {/* Video */}
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Wideo</h1>
            <div className="flex gap-5 mt-5 flex-wrap">
              {videoFile && (
                <div className="relative w-[75px] h-[75px]">
                  <video
                    src={
                      videoFile instanceof File
                        ? URL.createObjectURL(videoFile)
                        : videoFile.src
                        ? `${
                            process.env.REACT_APP_BASE_URL
                          }uploads/service/${videoFile.src.split("\\").pop()}`
                        : ""
                    }
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
                  onClick={() => videoRef.current.click()}
                  className="border-[2px] border-dashed border-[#98A2B2] p-5 rounded-[6px] cursor-pointer"
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

        {/* Service Text */}
        <div className="flex items-start justify-between py-[15px] gap-5">
          <div className="w-[49%] flex flex-col gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (türkmen dilinde)</h1>
              <input
                value={product.name_tm}
                onChange={(e) =>
                  setProduct({ ...product, name_tm: e.target.value })
                }
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (rus dilinde)</h1>
              <input
                value={product.name_ru}
                onChange={(e) =>
                  setProduct({ ...product, name_ru: e.target.value })
                }
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>
          <div className="w-[49%] flex flex-col gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (iňlis dilinde)</h1>
              <input
                value={product.name_en}
                onChange={(e) =>
                  setProduct({ ...product, name_en: e.target.value })
                }
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Hyzmadyň senesi </h1>
              <input
                value={product.date}
                onChange={(e) =>
                  setProduct({ ...product, date: e.target.value })
                }
                type="date"
                className="border-[1px] w-full border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-4 flex flex-col gap-4">
          <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
            <h1>Beýany (türkmen dilinde)</h1>
            <textarea
              value={product.text_tm}
              onChange={(e) =>
                setProduct({ ...product, text_tm: e.target.value })
              }
              placeholder="Text..."
              className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
            />
          </div>

          <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
            <h1>Beýany (iňlis dilinde)</h1>
            <textarea
              value={product.text_en}
              onChange={(e) =>
                setProduct({ ...product, text_en: e.target.value })
              }
              placeholder="Text..."
              className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
            />
          </div>

          <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
            <h1>Beýany (rus dilinde)</h1>
            <textarea
              value={product.text_ru}
              onChange={(e) =>
                setProduct({ ...product, text_ru: e.target.value })
              }
              placeholder="Text..."
              className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
            />
          </div>
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between py-[30px] border-t-[1px]">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]">Hyzmaty poz</h1>
          </div>
          <div className="flex justify-start w-[550px]">
            <Popconfirm
              title="Hyzmaty pozmak!"
              description="Siz çyndan pozmak isleýärsiňizmi?"
              onConfirm={async () => {
                try {
                  await destroyService(id).unwrap();
                  message.success("Hyzmat pozuldy");
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

export default React.memo(ServiceUpdate);
