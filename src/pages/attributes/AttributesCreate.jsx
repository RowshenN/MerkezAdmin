import React, { useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography, Select, Option } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { useCreateAttributeMutation } from "../../services/attribute";
import { useGetAllLevel1CategoriesQuery } from "../../services/category";

const AttributesCreate = () => {
  const history = useHistory();

  const [warning, setWarning] = useState(false);
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState([]);

  const [attribute, setAttribute] = useState({
    name: "",
    type: "string",
    categoryId: null,
    isRequired: false,
  });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllLevel1CategoriesQuery();

  const [createAttribute, { isLoading }] = useCreateAttributeMutation();

  const handleAddOption = () => {
    if (!optionInput.trim()) return;
    setOptions([...options, optionInput.trim()]);
    setOptionInput("");
  };

  const handleCreate = async () => {
    if (!attribute.name || !attribute.type || !attribute.categoryId) {
      setWarning(true);
      return;
    }

    try {
      await createAttribute({
        ...attribute,
        options: attribute.type === "select" ? options : [],
      }).unwrap();

      message.success("Atribut üstünlikli döredildi!");
      history.goBack();
    } catch (error) {
      console.error("Error creating attribute:", error);
      message.error("Maglumatlary barlaň!", error);
    }
  };

  if (isLoading || categoriesLoading) return <PageLoading />;

  const categories = categoriesData || [];

  return (
    <div className="w-full">
      {warning && (
        <Alert
          className="!fixed z-50 top-5 right-5"
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
              Maglumatlary doly girizmeli!
            </Typography>
          </div>
        </Alert>
      )}

      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Atribut döretmek</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className="flex items-start justify-between pt-7">
          {/* LEFT SIDE */}
          <div className="w-[49%] flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2 w-full">
              <h1>Atributyň ady</h1>
              <input
                value={attribute.name}
                onChange={(e) =>
                  setAttribute({ ...attribute, name: e.target.value })
                }
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 border border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-2 w-full">
              <h1>Atributyň görnüşi</h1>
              <Select
                value={attribute.type}
                onChange={(_, value) =>
                  setAttribute({ ...attribute, type: value })
                }
                className="w-full"
              >
                <Option value="string">String (Text)</Option>
                <Option value="number">Number</Option>
                <Option value="boolean">Boolean</Option>
                <Option value="select">Select (options)</Option>
              </Select>
            </div>

            {/* OPTIONS (Visible only when type === select) */}
            {attribute.type === "select" && (
              <div className="flex flex-col gap-2 w-full">
                <h1>Wariantlar</h1>

                {/* List */}
                <div className="flex flex-wrap mb-2 gap-2">
                  {options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                    >
                      <span>{opt}</span>
                      <button
                        className="text-red-500 font-bold"
                        onClick={() =>
                          setOptions(options.filter((_, index) => index !== i))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    value={optionInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        setOptions([...options, e.target.value.trim()]);
                        e.target.value = "";
                      }
                    }}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Wariant giriz..."
                    className="border outline-none px-3 py-2 rounded w-full"
                  />
                  <button
                    onClick={handleAddOption}
                    className="bg-blue text-white px-4 py-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="w-[49%] flex flex-col gap-4">
            {/* Category */}
            <div className="flex flex-col gap-2 w-full">
              <h1>Kategoriýa</h1>
              <Select
                className="!py-2"
                value={attribute.categoryId || ""}
                placeholder="Kategoriýa saýla..."
                onChange={(_, value) =>
                  setAttribute({ ...attribute, categoryId: value })
                }
              >
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Required */}
            <div className="w-full border mt-9 border-[#98A2B2] rounded-lg py-3 px-2 flex items-center justify-between mt-4">
              <h1>Talap edilýärmi?</h1>
              <input
                type="checkbox"
                checked={attribute.isRequired}
                onChange={(e) =>
                  setAttribute({ ...attribute, isRequired: e.target.checked })
                }
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 py-2 bg-[#F7F8FA] w-full">
        <div className="flex justify-end gap-5 bg-white py-4 px-5 border border-[#E9EBF0] rounded-[8px]">
          <button
            onClick={() => history.goBack()}
            className="text-blue py-[11px] px-[27px] hover:bg-red hover:text-white rounded-[8px]"
          >
            Goýbolsun et
          </button>
          <button
            onClick={handleCreate}
            className="text-white py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
          >
            Ýatda sakla
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AttributesCreate);
