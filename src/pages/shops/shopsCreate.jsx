import React, { useRef, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import Switch from "@mui/joy/Switch";

import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { KeyboardArrowDown } from "@mui/icons-material";

import { useCreateMyShopMutation } from "../../services/shop";
import { useGetBrandsQuery } from "../../services/brand";
import { useGetAllLevel1CategoriesQuery } from "../../services/category";

const ShopsCreate = () => {
  const history = useHistory();
  const imgRef = useRef(null);

  const [warning, setWarning] = useState(false);
  const [imgFile, setImgFile] = useState(null);

  const [store, setStore] = useState({
    name: "",
    categoryId: "",
    brandId: "",
    paymentType: "",
    phoneNumber: "",
    workTime: "",
    address: "",
    email: "",
    tiktok: "",
    instagram: "",
    isDelivery: false,
  });

  const [createShop, { isLoading }] = useCreateMyShopMutation();

  // Fetch categories & brands
  const { data: categoryData, isLoading: catLoading } =
    useGetAllLevel1CategoriesQuery();
  const { data: brandData, isLoading: brandLoading } = useGetBrandsQuery({
    page: 1,
    limit: 50,
  });

  const handleSubmit = async () => {
    const isTextIncomplete =
      !store.name ||
      !store.categoryId ||
      !store.brandId ||
      !store.paymentType ||
      !store.phoneNumber ||
      !store.workTime ||
      !store.address;

    if (isTextIncomplete || !imgFile) {
      setWarning(true);
      return;
    }

    // ✅ Handle paymentTypes correctly
    let paymentArray = [];
    if (store.paymentType === "cash") paymentArray = ["cash"];
    else if (store.paymentType === "terminal") paymentArray = ["card"];
    else if (store.paymentType === "both") paymentArray = ["cash", "card"];

    const formData = new FormData();
    formData.append("name", store.name);
    formData.append("categoryId", store.categoryId);
    formData.append("brandId", store.brandId);
    formData.append("paymentTypes", JSON.stringify(paymentArray)); // ✅ send as array
    formData.append("phoneNumber", store.phoneNumber);
    formData.append("workTime", store.workTime);
    formData.append("address", store.address);
    formData.append("delivery", store.isDelivery);
    if (store.email) formData.append("email", store.email);
    if (store.tiktok) formData.append("tiktok", store.tiktok);
    if (store.instagram) formData.append("instagram", store.instagram);
    if (imgFile) formData.append("logo", imgFile);

    try {
      await createShop(formData).unwrap();
      message.success("Dükan üstünlikli döredildi!");
      history.push("/shops");
    } catch (error) {
      console.error("Error creating shop:", error);
      message.error("Maglumatlary barlaň!");
    }
  };

  if (isLoading || catLoading || brandLoading) return <PageLoading />;

  return (
    <div className="w-full bg-white py-4 px-4 rounded-lg ">
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

      {/* header */}
      <div className="w-full pb-3 border-b border-border flex items-center justify-start text-[20px] font-[600] text-text-prime ">
        <div className="flex items-center justify-start gap-3 ">
          <div className="bg-green w-1 h-5 rounded-full "></div>
          <p>Dükan döretmek</p>
        </div>
      </div>

      {/* form */}
      <div className="w-full divide-y divide-border ">
        {/* logo div */}
        <div className="py-5 w-full flex items-start justify-between  gap-5 ">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col items-baseline justify-start ">
            <p>Dükanyň logosy</p>
            <p className="text-text-secondary/70 w-[80%] text-sm font-[400] ">
              Diňe * .png, * .jpg we * .jpeg surat faýllary kabul edilýär. Iň
              kiçi ölçegi 50px X 50px, iň uly göwrümi 2MB
            </p>
          </div>

          <div className=" w-[50%] ">
            <div className="flex gap-5 flex-wrap">
              {imgFile && (
                <div className="relative w-[75px] h-[75px]">
                  <img
                    src={URL.createObjectURL(imgFile)}
                    alt={imgFile.name}
                    className="w-[75px] h-[75px] object-cover rounded-[6px]"
                  />
                  <div
                    onClick={() => setImgFile(null)}
                    className="absolute -top-2 -right-2 cursor-pointer bg-slate-300 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </div>
                </div>
              )}

              {!imgFile && (
                <div
                  onClick={() => imgRef.current.click()}
                  className="border-[2px] border-dashed border-[#98A2B2] px-5 py-3 text-2xl rounded-[6px] cursor-pointer"
                >
                  +
                </div>
              )}
              <input
                ref={imgRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => setImgFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {/* name */}
        <InputField
          label="Ady"
          desc="Dükanyň adyny giriziň"
          placeholder="Adyny giriz"
          value={store.name}
          onChange={(e) => setStore({ ...store, name: e.target.value })}
        />

        {/* category */}
        <SelectField
          label="Kategoriýa"
          desc="Dükanyň kategoriýasyny saýlaň"
          value={store.categoryId}
          onChange={(value) => setStore({ ...store, categoryId: value })}
          options={categoryData || []}
          optionLabel="name"
          optionValue="id"
        />

        {/* brand */}
        <SelectField
          label="Marka"
          desc="Dükanyň markasyny saýlaň"
          value={store.brandId}
          onChange={(value) => setStore({ ...store, brandId: value })}
          options={brandData?.brands || []}
          optionLabel="name"
          optionValue="id"
        />

        {/* paymentType */}
        <SelectField
          label="Töleg"
          desc="Nähili töleg kabul edýändigiňizi saýlaň"
          value={store.paymentType}
          onChange={(value) => setStore({ ...store, paymentType: value })}
          options={[
            { value: "both", label: "Ikisi hem" },
            { value: "cash", label: "Nagt" },
            { value: "terminal", label: "Terminal" },
          ]}
          optionLabel="label"
          optionValue="value"
        />

        {/* phoneNumber */}
        <InputField
          label="Telefon belgi"
          desc="Dükanyň eýesiniň telefon belgisini giriziň"
          placeholder="Telefon belgisi"
          value={store.phoneNumber}
          onChange={(e) => setStore({ ...store, phoneNumber: e.target.value })}
        />

        {/* workTime */}
        <InputField
          label="Iş wagty"
          desc="Dükanyň iş wagtyny giriziň"
          placeholder="Iş wagty"
          value={store.workTime}
          onChange={(e) => setStore({ ...store, workTime: e.target.value })}
        />

        {/* address */}
        <InputField
          label="Salgy"
          desc="Dükanyň salgysyny giriziň"
          placeholder="Salgy"
          value={store.address}
          onChange={(e) => setStore({ ...store, address: e.target.value })}
        />

        {/* email */}
        <InputField
          label="E-poçta"
          desc="Dükanyň e-poçtasyny giriziň"
          placeholder="E-poçta"
          value={store.email}
          onChange={(e) => setStore({ ...store, email: e.target.value })}
        />

        {/* tiktok */}
        <InputField
          label="Tiktok"
          desc="Dükanyň tiktok hasbyny giriziň (islege görä)"
          placeholder="Tiktok"
          value={store.tiktok}
          onChange={(e) => setStore({ ...store, tiktok: e.target.value })}
        />

        {/* instagram */}
        <InputField
          label="Instagram"
          desc="Dükanyň instagram hasabyny giriziň (islege görä)"
          placeholder="Instagram"
          value={store.instagram}
          onChange={(e) => setStore({ ...store, instagram: e.target.value })}
        />
        <div className="flex items-center border-t-[1px] justify-between py-[30px]">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]">Eltip bermek</h1>
            <p className="text-[14px] mt-2 font-[500]">
              Eltip bermek hyzmaty barmy ýa-da ýokdugyny saýlaň
            </p>
          </div>
          <div className="flex justify-start w-[550px]">
            <Switch
              checked={store.isDelivery}
              onChange={(event) =>
                setStore({ ...store, isDelivery: event.target.checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className=" w-full">
        <div className="w-full mt-4 flex justify-end gap-5 items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
          <button
            onClick={() => history.goBack()}
            className=" text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red/70 bg-red text-white rounded-[8px]"
          >
            Goýbolsun et
          </button>
          <button
            onClick={handleSubmit}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-green hover:bg-green/70 rounded-[8px]"
          >
            Ýatda sakla
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 helper components
const InputField = ({ label, desc, ...props }) => (
  <div className="py-5 w-full flex items-start justify-between gap-5 ">
    <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col items-baseline justify-start ">
      <p>{label}</p>
      <p className="text-text-secondary/70 w-[80%] text-sm font-[400] ">
        {desc}
      </p>
    </div>
    <div className="w-[50%] ">
      <input
        {...props}
        className="w-full py-2 px-3 outline-none text-text-prime text-base font-[400] border rounded-lg border-black/30 "
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  desc,
  options = [],
  optionLabel,
  optionValue,
  value,
  onChange,
}) => (
  <div className="py-5 w-full flex items-start justify-between gap-5 ">
    <div className="text-text-prime w-[50%] text-[18px] font-[500] flex gap-1 flex-col items-baseline justify-start ">
      <p>{label}</p>
      <p className="text-text-secondary/70 w-[80%] text-sm font-[400] ">
        {desc}
      </p>
    </div>

    <div className="w-[50%] ">
      <Select
        placeholder={label}
        value={value}
        onChange={(e, val) => onChange(val)}
        className="w-full !py-2 !px-3 !text-text-prime !text-base !font-[400] !border !rounded-lg !border-black/30 !bg-white "
        indicator={<KeyboardArrowDown className="!text-[20px]" />}
        sx={{
          [`& .${selectClasses.indicator}`]: {
            transition: "0.2s",
            [`&.${selectClasses.expanded}`]: {
              transform: "rotate(-180deg)",
            },
          },
        }}
      >
        {options.map((opt) => (
          <Option key={opt[optionValue]} value={opt[optionValue]}>
            {opt[optionLabel]}
          </Option>
        ))}
      </Select>
    </div>
  </div>
);

export default React.memo(ShopsCreate);
