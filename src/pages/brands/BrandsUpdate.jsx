import React, { useRef, useState, useEffect } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Switch, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { useHistory, useParams } from "react-router-dom";
import { message, Popconfirm, Button } from "antd";
import {
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandByIdQuery,
} from "../../services/brand";
import { useGetAllLevel1CategoriesQuery } from "../../services/category";

const BrandsUpdate = () => {
  const history = useHistory();
  const { id } = useParams();
  const imgRef = useRef(null);

  const { data, isLoading } = useGetBrandByIdQuery(id);
  const { data: categories } = useGetAllLevel1CategoriesQuery();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [brand, setBrand] = useState({
    name: "",
    description: "",
    isActive: true,
    categoryId: "",
  });

  const [imgFile, setImgFile] = useState(null);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (data?.brand) {
      const b = data.brand;
      setBrand({
        name: b.name || "",
        description: b.description || "",
        isActive: b.isActive,
        categoryId: b.category?.id || "",
      });
      setImgFile(b.logo ? { url: b.logo } : null);
    }
  }, [data]);

  if (isLoading) return <PageLoading />;

  const handleUpdate = async () => {
    if (!brand.name || !brand.description || !imgFile || !brand.categoryId) {
      setWarning(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", brand.name);
    formData.append("description", brand.description);
    formData.append("isActive", brand.isActive);
    formData.append("categoryId", brand.categoryId);
    if (imgFile instanceof File) formData.append("logo", imgFile);

    try {
      await updateBrand({ id, formData }).unwrap();
      message.success("Brand updated successfully!");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.error("Update failed!");
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
            <div>{"Data is incomplete!"}</div>
            <Typography level="body-sm" color="warning">
              Fill all fields, select a category and upload a logo.
            </Typography>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Edit Brand</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        {/* Logo Upload */}
        <div className="flex items-end justify-between py-[30px] gap-4">
          <div className="w-[49%]">
            <div className="w-full">
              <h1 className="text-[16px] font-[500]">Logo</h1>
              <div className="flex gap-5 mt-5 flex-wrap">
                {imgFile && (
                  <div className="relative w-[75px] h-[75px]">
                    <img
                      src={
                        imgFile instanceof File
                          ? URL.createObjectURL(imgFile)
                          : `${
                              process.env.REACT_APP_BASE_URL
                            }${imgFile.url.replace("\\", "/")}`
                      }
                      alt={brand.name}
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

            <div className="w-full flex flex-col gap-2 mt-4">
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

            {/* Shops list */}
            {data?.brand?.shops?.length > 0 && (
              <div className="w-full mt-3">
                <h1 className="font-[500] text-[14px]">Shops:</h1>
                <ul className="text-[13px] text-gray-700 ml-2">
                  {data.brand.shops.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between py-[30px] border-t">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]">Delete Brand</h1>
          </div>
          <div className="flex justify-start w-[550px]">
            <Popconfirm
              title="Delete Brand!"
              description="Are you sure?"
              onConfirm={async () => {
                try {
                  await deleteBrand(id).unwrap();
                  message.success("Brand deleted!");
                  history.goBack();
                } catch (err) {
                  message.warning("Delete failed!");
                }
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
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
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BrandsUpdate);
