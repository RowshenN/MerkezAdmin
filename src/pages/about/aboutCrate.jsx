import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { useCreateAboutMutation } from "../../services/about";

const AboutCreate = () => {
  const history = useHistory();
  const [about, setAbout] = useState({
    name_tm: "",
    name_ru: "",
    name_en: "",
    text_tm: "",
    text_ru: "",
    text_en: "",
  });
  const [createAbout, { isLoading }] = useCreateAboutMutation();

  const handleCreate = async () => {
    try {
      await createAbout(about).unwrap(); // creates without invalidating getAll
      message.success("Üusünlikli döredildi");
      history.goBack(); // go back to About list without refetch
    } catch (err) {
      console.error("Error creating About:", err);
      message.warning("Üstünlikli döredilmedi");
    }
  };

  return (
    <div className="w-full">
      {/* header section */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Biz barada</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className=" flex items-center gap-4 pb-5">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Biz barada maglumatlar</h1>
        </div>
        {[
          { label: "Header_tm", key: "name_tm", placeholder: "Adyny giriz" },
          { label: "Header_ru", key: "name_ru", placeholder: "Adyny giriz" },
          { label: "Header_en", key: "name_en", placeholder: "Adyny giriz" },
        ].map((field) => (
          <div
            key={field.key}
            className="flex items-center border-t-[1px] justify-between py-[30px]"
          >
            <div className="w-[380px]">
              <h1 className="text-[18px] font-[500]">{field.label}</h1>
              <p className="text-[14px] mt-2 font-[500] text-[#98A2B2]">
                {field.label}
              </p>
            </div>
            <div className="flex justify-start w-[550px]">
              <input
                type="text"
                value={about[field.key]}
                onChange={(e) =>
                  setAbout({ ...about, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                className="text-[14px] w-full text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>
        ))}

        {[
          { label: "Text_tm", key: "text_tm", placeholder: "Text_tm giriz" },
          { label: "Text_en", key: "text_en", placeholder: "Text_en giriz" },
          { label: "Text_ru", key: "text_ru", placeholder: "Text_ru giriz" },
        ].map((field) => (
          <div
            key={field.key}
            className="flex items-center  border-t-[1px] justify-between py-[30px]"
          >
            <div className="w-[380px]">
              <h1 className="text-[18px] font-[500]">{field.label}</h1>
              <p className="text-[14px] mt-2 font-[500] text-[#98A2B2]">
                {field.label}
              </p>
            </div>
            <div className="flex justify-start w-[550px]">
              <textarea
                type="text"
                value={about[field.key]}
                onChange={(e) =>
                  setAbout({ ...about, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                className="text-[14px] min-h-[100px] w-full text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full mt-5 flex justify-end items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
        <div className="w-fit flex gap-6 items-center ">
          <button
            onClick={() => history.goBack()}
            className="text-blue text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red hover:text-white rounded-[8px]"
          >
            Goýbolsun et
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
          >
            {isLoading ? "Ýatda saklanylýar..." : "Ýatda sakla"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AboutCreate);
