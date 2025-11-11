import React, { useRef, useState, useEffect } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Switch, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import PageLoading from "../../components/PageLoading";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { useCreateBrandMutation } from "../../services/brand";
import { useGetAllLevel1CategoriesQuery } from "../../services/category"; // You need category service

const BrandsCreate = () => {
  const history = useHistory();
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const { data: categories } = useGetAllLevel1CategoriesQuery();

  const imgRef = useRef(null);
  const [imgFile, setImgFile] = useState(null);
  const [warning, setWarning] = useState(false);

  const [brand, setBrand] = useState({
    name: "",
    description: "",
    isActive: true,
    categoryId: "",
  });

  const handleSubmit = async () => {
    if (!brand.name || !brand.description || !imgFile || !brand.categoryId) {
      setWarning(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", brand.name);
    formData.append("description", brand.description);
    formData.append("isActive", brand.isActive);
    formData.append("categoryId", brand.categoryId);
    formData.append("logo", imgFile);

    try {
      await createBrand(formData).unwrap();
      message.success("Brand created successfully!");
      history.push("/brands");
    } catch (err) {
      console.error(err);
      message.error("Check the data and try again");
    }
  };

  if (isLoading) return <PageLoading />;

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
            <div>{"Data is incomplete!"}</div>
            <Typography level="body-sm" color="warning">
              Fill all fields, select a category and upload a logo.
            </Typography>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Marka goş</h1>
      </div>

      {/* Form */}
      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className="flex items-end justify-between py-[30px] gap-4">
          {/* Logo Upload */}
          <div className="w-[49%] flex flex-col items-baseline justify-start gap-3 ">
            <div className="">
              <h1 className="text-[16px] font-[500]">Logo</h1>
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
                    onClick={() => imgRef.current.click()}
                    className="border-[2px] w-full border-dashed border-[#98A2B2] p-5 rounded-[6px] cursor-pointer"
                  >
                    + Upload logo
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

            <div className="w-full flex flex-col gap-2">
              <h1>Category</h1>
              <select
                value={brand.categoryId}
                onChange={(e) =>
                  setBrand({ ...brand, categoryId: e.target.value })
                }
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              >
                <option value="">Select Category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full py-3 px-4 border border-[#98A2B2] rounded-lg  flex items-center justify-between mt-9">
              <h1>Aktiw ýagdaýy</h1>
              <Switch
                checked={brand.isActive}
                onChange={(e) =>
                  setBrand({ ...brand, isActive: e.target.checked })
                }
              />
            </div>
          </div>

          {/* Brand Info */}
          <div className="w-[49%] flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <h1>Name</h1>
              <input
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                placeholder="Brand name..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <h1>Description</h1>
              <textarea
                value={brand.description}
                onChange={(e) =>
                  setBrand({ ...brand, description: e.target.value })
                }
                placeholder="Description..."
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
            className=" text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red text-blue hover:text-white rounded-[8px]"
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
  );
};

export default React.memo(BrandsCreate);
