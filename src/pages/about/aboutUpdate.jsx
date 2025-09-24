import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { message } from "antd";
import PageLoading from "../../components/PageLoading";
import { useGetAboutQuery, useUpdateAboutMutation } from "../../services/about";

const AboutUpdate = () => {
  const history = useHistory();
  const { id } = useParams();

  const { data, isLoading, error } = useGetAboutQuery(id);
  const [updateAbout, { isLoading: updating }] = useUpdateAboutMutation();

  const [about, setAbout] = useState({
    id,
    name_tm: "",
    name_ru: "",
    name_en: "",
    text_tm: "",
    text_ru: "",
    text_en: "",
  });

  useEffect(() => {
    if (data) {
      setAbout({ id, ...data });
    }
  }, [data, id]);

  const handleUpdate = async () => {
    try {
      await updateAbout(about).unwrap();
      message.success("Üstünlikli üýtgedildi");
      history.goBack();
    } catch (err) {
      console.error("Error updating about:", err);
      message.warning("Üýtgetmek başartmady!");
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <div>Ýalňyşlyk boldy...</div>;

  return (
    <div className="w-full">
      {/* header section */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Biz barada</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className="flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Biz barada maglumatlar</h1>
        </div>
        <div className="flex w-full items-baseline gap-5 flex-col justify-start py-[15px]">
          <div className="w-full flex items-start justify-center gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (türkmen dilinde)</h1>
              <input
                value={about.name_tm}
                onChange={(e) =>
                  setAbout({ ...about, name_tm: e.target.value })
                }
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Ady (iňlis dilinde)</h1>
              <input
                value={about.name_en}
                onChange={(e) =>
                  setAbout({ ...about, name_en: e.target.value })
                }
                placeholder="Ady..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
            <h1>Ady (rus dilinde)</h1>
            <input
              value={about.name_ru}
              onChange={(e) => setAbout({ ...about, name_ru: e.target.value })}
              placeholder="Ady..."
              className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
            />
          </div>

          <div className="w-full flex flex-col items-baseline justify-start gap-4">
            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (türkmen dilinde)</h1>
              <textarea
                value={about.text_tm}
                onChange={(e) =>
                  setAbout({ ...about, text_tm: e.target.value })
                }
                placeholder="Text..."
                className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (iňlis dilinde)</h1>
              <textarea
                value={about.text_en}
                onChange={(e) =>
                  setAbout({ ...about, text_en: e.target.value })
                }
                placeholder="Text..."
                className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-start gap-2 ">
              <h1>Beýany (rus dilinde)</h1>
              <textarea
                value={about.text_ru}
                onChange={(e) =>
                  setAbout({ ...about, text_ru: e.target.value })
                }
                placeholder="Text..."
                className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>
          </div>
        </div>
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
            onClick={handleUpdate}
            disabled={updating}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
          >
            {updating ? "Ýatda saklanylýar..." : "Ýatda sakla"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AboutUpdate);
