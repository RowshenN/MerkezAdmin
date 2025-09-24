import React, { useEffect, useState } from "react";
import Switch from "@mui/joy/Switch";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useHistory, useParams } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import { message, Button, Popconfirm } from "antd";
import {
  useUpdateAdminMutation,
  useGetAdminQuery,
  useDeleteAdminMutation,
  useDestroyAdminMutation,
} from "../../services/admin";

const AdminsUpdate = () => {
  const history = useHistory();
  const { id } = useParams();

  const [user, setUser] = useState({
    name: "",
    lastName: "",
    phone: "",
    can_message: true,
    position: "",
    type: "",
  });
  const [newPassword, setNewPassword] = useState("");

  const [updateAdmin] = useUpdateAdminMutation();
  const [deleteAdmin] = useDestroyAdminMutation();
  const { data: custumers, error, isLoading } = useGetAdminQuery(id);

  // Map backend lastName → frontend lastName
  useEffect(() => {
    if (custumers) {
      setUser({
        ...custumers,
        lastName: custumers.lastName,
        can_message: custumers.can_message ?? true,
      });
    }
  }, [custumers]);

  const updateUser = async () => {
    try {
      const bodyData = {
        id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        can_message: user.can_message,
        position: user.position,
        type: user.type,
      };

      if (newPassword.length > 0) {
        bodyData.password = newPassword;
      }

      await updateAdmin(bodyData).unwrap();
      message.success("Üstünlikli üýtgedildi!");
      history.goBack();
    } catch (err) {
      console.log(err);
      message.warning("Gaýtadan barlaň!");
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <div>Ýalňyşlyk boldy</div>;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Admin (Ulanyjy) hasaplar</h1>
      </div>

      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        {/* User Info */}
        <div className="flex items-center gap-4 pb-5 border-b-[1px] border-b-[#E9EBF0]">
          <div className="border-l-[3px] border-blue h-[20px]"></div>
          <h1 className="text-[20px] font-[500]">Hasap maglumaty</h1>
        </div>

        <div className="flex items-center justify-between py-[15px]">
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Ady</h1>
            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              placeholder="Girizilmedik"
            />
          </div>
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Familiýasy</h1>
            <input
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              placeholder="Girizilmedik"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-[15px]">
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Telefon</h1>
            <input
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              placeholder="Girizilmedik"
            />
          </div>
          <div className="w-[49%]">
            <h1 className="text-[16px] font-[500]">Täze Password</h1>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              placeholder="Girizilmedik"
              type="password"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center border-t-[1px] justify-between py-[30px]">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]">Status</h1>
            <p className="text-[14px] mt-2 font-[500] text-[#98A2B2]">
              Admin aktiwlygyny kesgitlemek üçin status düzüň
            </p>
          </div>
          <div className="flex justify-start w-[550px]">
            <Switch
              checked={user.can_message ?? false}
              onChange={(event) =>
                setUser({ ...user, can_message: event.target.checked })
              }
            />
          </div>
        </div>

        {/* Delete Admin */}
        <div className="w-full flex justify-between">
          <div className="w-[380px]">
            <h1 className="text-[18px] font-[500]"> Admin poz</h1>
            <p className="text-[14px] mt-2 font-[500] text-[#98A2B2]">
              Admin pozmak
            </p>
          </div>
          <Popconfirm
            title="Maglumaty pozmak!"
            description="Siz çyndan pozmak isleýärsiňizmi?"
            onConfirm={async () => {
              const response = await deleteAdmin(id);
              history.goBack();
              response?.data?.status === 200
                ? history.goBack()
                : message.warning(response.error?.data?.message);
            }}
            okText="Hawa"
            cancelText="Ýok"
          >
            <Button danger>Pozmak</Button>
          </Popconfirm>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="sticky bottom-0 py-2 bg-[#F7F8FA] w-full">
        <div className="w-full mt-5 flex justify-end items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
          <div className="w-fit flex gap-6 items-center">
            <button
              onClick={() => history.goBack()}
              className="text-blue text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red hover:text-white rounded-[8px]"
            >
              Goýbolsun et
            </button>
            <button
              onClick={() => updateUser()}
              className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue rounded-[8px] hover:bg-opacity-90"
            >
              Ýatda sakla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminsUpdate);
