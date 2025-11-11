import React, { useEffect, useRef, useState, useMemo } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography, Switch } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { useHistory, useParams } from "react-router-dom";
import { message, Button, Popconfirm } from "antd";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useGetAllCategoriesFlatQuery,
  useDeleteCategoryMutation,
} from "../../services/category";

const CategoryUpdate = () => {
  const { id } = useParams();
  const history = useHistory();
  const imgRef = useRef(null);

  const [destroy] = useDeleteCategoryMutation();

  const { data: flatData } = useGetAllCategoriesFlatQuery({
    page: 1,
    limit: 100,
  });
  const { data: categoryData, isLoading } = useGetCategoryByIdQuery(id);
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [warning, setWarning] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [category, setCategory] = useState({
    name: "",
    parentId: "",
    level: 1,
    isActive: true,
  });

  // Load initial data
  useEffect(() => {
    if (categoryData) {
      setCategory({
        name: categoryData.name || "",
        parentId: categoryData.parentId || "",
        level: categoryData.level || 1,
        isActive: categoryData.isActive ?? true,
      });
      if (categoryData.image) {
        setPreview(`${process.env.REACT_APP_BASE_URL}./${categoryData.image}`);
      }
    }
  }, [categoryData]);

  // Filter parent categories dynamically based on level
  const parentOptions = useMemo(() => {
    if (!flatData?.categories) return [];
    if (category.level === 1) return [];
    if (category.level === 2)
      return flatData.categories.filter((cat) => cat.level === 1);
    if (category.level === 3)
      return flatData.categories.filter((cat) => cat.level === 2);
    return [];
  }, [flatData, category.level]);

  const handleUpdate = async () => {
    if (!category.name) {
      setWarning(true);
      return;
    }

    if (!imgFile && !preview) {
      message.error("Surat hökmany!");
      return;
    }

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("level", category.level);
    formData.append("isActive", category.isActive);

    if (category.parentId) formData.append("parentId", category.parentId);
    if (imgFile) formData.append("image", imgFile);

    try {
      await updateCategory({ id, formData }).unwrap();
      message.success("Kategoriýa üstünlikli täzelendi!");
      history.push("/categories");
    } catch (error) {
      console.error("Update error:", error);
      message.error("Täzelenende säwlik boldy!");
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
        <h1 className="text-[30px] font-[700]">Kategoriýany täzelenmek</h1>
      </div>

      {/* Form */}
      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        {/* Image Upload */}
        <div className="flex items-start justify-between py-[30px] gap-4">
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Kategoriýa logosy</h1>
            <div className="flex gap-5 mt-5 flex-wrap">
              {(preview || imgFile) && (
                <div className="relative w-[75px] h-[75px]">
                  <img
                    src={imgFile ? URL.createObjectURL(imgFile) : preview}
                    alt="preview"
                    className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  />
                  <div
                    onClick={() => {
                      setImgFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 cursor-pointer bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </div>
                </div>
              )}

              {!imgFile && !preview && (
                <div
                  onClick={() => imgRef.current.click()}
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
        </div>

        {/* Input fields */}
        <div className="flex items-start justify-between pt-7">
          <div className="w-[49%] flex flex-col items-start justify-start gap-4">
            {/* Category Name */}
            <div className="w-full flex flex-col items-baseline justify-start gap-2">
              <h1>Kategoriýanyň ady</h1>
              <input
                value={category.name}
                onChange={(e) =>
                  setCategory({ ...category, name: e.target.value })
                }
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            {/* Level */}
            <div className="w-full flex flex-col items-baseline justify-start gap-2">
              <h1>Kategoriýanyň derejesi (1 - 3)</h1>
              <input
                type="number"
                min="1"
                max="3"
                value={category.level}
                onChange={(e) =>
                  setCategory({
                    ...category,
                    level: Number(e.target.value),
                    parentId: "", // reset parent when level changes
                  })
                }
                placeholder="Level..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>

          <div className="w-[49%] flex flex-col items-start justify-start gap-4">
            {/* Parent Category */}
            <div className="w-full flex flex-col items-baseline justify-start gap-2">
              <h1>Parent kategoriýasy (islege görä)</h1>
              {parentOptions.length > 0 ? (
                <select
                  value={category.parentId || ""}
                  onChange={(e) =>
                    setCategory({ ...category, parentId: e.target.value })
                  }
                  className="text-[14px] w-full mt-1 border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
                >
                  <option value="">Parent saýla</option>
                  {parentOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-500 text-sm mt-2">
                  Bu dereje üçin parent kategoriýasy ýok
                </p>
              )}
            </div>

            {/* Active Switch */}
            <div className="w-full py-3 px-4 border border-[#98A2B2] rounded-lg  flex items-center justify-between mt-9">
              <h1>Aktiw ýagdaýy</h1>
              <Switch
                checked={category.isActive}
                onChange={(e) =>
                  setCategory({ ...category, isActive: e.target.checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between py-[30px] border-t">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]">Kategoriýany poz</h1>
          </div>
          <div className="flex justify-start w-[550px]">
            <Popconfirm
              title="Işi pozmak!"
              description="Siz çyndan pozmak isleýärsiňizmi?"
              onConfirm={async () => {
                try {
                  await destroy(id).unwrap();
                  message.success("Iş pozuldy");
                  history.goBack();
                } catch (err) {
                  message.warning("Pozmak başartmady!");
                }
              }}
              okText="Hawa"
              cancelText="Ýok"
            >
              <Button danger>Pozmak </Button>
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
            Goýbolsun et
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
          >
            {isUpdating ? "Ýatda saklanýar..." : "Ýatda sakla"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CategoryUpdate);
