import React, { useEffect, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography, Select, Option } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { useHistory, useParams } from "react-router-dom";
import { message, Button, Popconfirm } from "antd";
import { useGetAllLevel1CategoriesQuery } from "../../services/category";
import {
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useGetAttributeByIdQuery,
} from "../../services/attribute";

const AttributeUpdate = () => {
  const { id } = useParams();
  const history = useHistory();

  const { data: categoriesData } = useGetAllLevel1CategoriesQuery();

  const [updateAttribute, { isLoading: isUpdating }] =
    useUpdateAttributeMutation();
  const [deleteAttribute] = useDeleteAttributeMutation();

  const [warning, setWarning] = useState(false);
  const [options, setOptions] = useState([]);

  const [attribute, setAttribute] = useState({
    name: "",
    type: "string",
    categoryId: "",
    isRequired: false,
  });

  const { data: selectedAttribute, isLoading } = useGetAttributeByIdQuery(id);

  useEffect(() => {
    if (selectedAttribute) {
      setAttribute({
        name: selectedAttribute.name || "",
        type: selectedAttribute.type || "string",
        categoryId: selectedAttribute.categoryId || "",
        isRequired: selectedAttribute.isRequired || false,
      });
      setOptions(selectedAttribute.options || []);
    }
  }, [selectedAttribute]);

  const handleUpdate = async () => {
    if (!attribute.name || !attribute.type || !attribute.categoryId) {
      setWarning(true);
      return;
    }

    try {
      await updateAttribute({
        id,
        data: {
          ...attribute,
          options: attribute.type === "select" ? options : [],
        },
      }).unwrap();
      message.success("Atribut üstünlikli täzelendi!");
      history.goBack();
    } catch (error) {
      console.error("Update error:", error);
      message.error("Täzelenende säwlik boldy!");
    }
  };

  if (isLoading || !selectedAttribute) return <PageLoading />;

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
        <h1 className="text-[30px] font-[700]">Atributy täzelenmek</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className="flex items-start justify-between pt-7">
          <div className="w-[49%] flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
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

            <div className="w-full flex flex-col gap-2">
              <h1>Atributyň görnüşi</h1>
              <Select
                value={attribute.type}
                onChange={(_, value) =>
                  setAttribute({ ...attribute, type: value })
                }
                className="w-full"
              >
                <Option value="string">String</Option>
                <Option value="number">Number</Option>
                <Option value="boolean">Boolean</Option>
                <Option value="select">Select (options)</Option>
              </Select>
            </div>

            {attribute.type === "select" && (
              <div className="w-full flex flex-col gap-2 mt-2">
                <h1>Options</h1>
                <div className="flex gap-2 flex-wrap">
                  {options.map((opt, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                    >
                      <span>{opt}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setOptions(options.filter((_, i) => i !== index))
                        }
                        className="text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Option name..."
                  className="border px-3 py-2 rounded w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      setOptions([...options, e.target.value.trim()]);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="w-[49%] flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <h1>Kategoriýa saýla</h1>
              <Select
                value={attribute.categoryId || ""}
                onChange={(_, value) =>
                  setAttribute({ ...attribute, categoryId: value })
                }
                className="w-full"
              >
                {categoriesData?.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="w-full h-[65px] flex items-center justify-between mt-4">
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

        <div className="flex items-center justify-between py-[30px] border-t mt-10">
          <h1 className="text-[18px] font-[500]">Atributy poz</h1>
          <Popconfirm
            title="Pozmak!"
            description="Siz çyndan pozmak isleýärsiňizmi?"
            onConfirm={async () => {
              try {
                await deleteAttribute(id).unwrap();
                message.success("Pozuldy!");
                history.goBack();
              } catch {
                message.warning("Ýalňyşlyk!");
              }
            }}
            okText="Hawa"
            cancelText="Ýok"
          >
            <Button danger>Pozmak</Button>
          </Popconfirm>
        </div>
      </div>

      <div className="sticky bottom-0 py-2 bg-[#F7F8FA] w-full">
        <div className="w-full mt-4 flex justify-end gap-5 items-center bg-white py-4 px-5 border border-[#E9EBF0] rounded-[8px]">
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

export default React.memo(AttributeUpdate);
