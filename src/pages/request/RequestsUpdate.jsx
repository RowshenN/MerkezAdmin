import React, { useEffect, useState } from "react";
import Alert from "@mui/joy/Alert";
import { IconButton, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { useHistory, useParams } from "react-router-dom";
import { Button, message } from "antd";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import { KeyboardArrowDown } from "@mui/icons-material";

import {
  useGetRequestByIdQuery,
  useChangeRequestStatusMutation,
  useDeleteRequestMutation,
} from "../../services/request";

const RequestsUpdate = () => {
  const history = useHistory();
  const { id } = useParams();

  const [warning, setWarning] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [status, setStatus] = useState("");

  const { data: requestData, isLoading } = useGetRequestByIdQuery(id);
  const [updateStatus, { isLoading: updating }] = useChangeRequestStatusMutation();
  const [deleteRequest] = useDeleteRequestMutation();

  // Fill status once data is loaded
  useEffect(() => {
    if (requestData) {
      setStatus(requestData.status || "pending");
    }
  }, [requestData]);

  const handleStatusChange = async () => {
    if (!status) {
      setWarning(true);
      return;
    }
    try {
      await updateStatus({ id, status }).unwrap();
      message.success("Status üstünlikli üýtgedildi!");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.error("Status üýtgetmek başartmady!");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRequest(id).unwrap();
      message.success("Request üstünlikli pozuldy!");
      setIsDelete(false);
      history.goBack();
    } catch (err) {
      console.error(err);
      message.error("Request pozmak başartmady!");
    }
  };

  if (isLoading || updating) return <PageLoading />;

  return (
    <div className="w-full bg-white py-4 px-4 rounded-lg">
      {warning && (
        <Alert
          className="!fixed z-50 top-5 right-5"
          sx={{ alignItems: "flex-start" }}
          startDecorator={<WarningIcon />}
          variant="soft"
          color={"warning"}
          endDecorator={
            <IconButton onClick={() => setWarning(false)} variant="soft" color={"warning"}>
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          <div>
            <div>{"Maglumat nädogry!"}</div>
            <Typography level="body-sm" color={"warning"}>
              Status saýlamaly!
            </Typography>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="w-full pb-3 border-b border-border flex items-center justify-start text-[20px] font-[600] text-text-prime">
        <div className="flex items-center justify-start gap-3">
          <div className="bg-blue w-1 h-5 rounded-full"></div>
          <p>Request üýtgetmek</p>
        </div>
      </div>

      {/* Request info */}
      <div className="w-full divide-y divide-border">
        <InfoField label="Ady" value={requestData?.name} />
        <InfoField label="Familiýasy" value={requestData?.surname} />
        <InfoField label="Telefon" value={requestData?.phoneNumber} />
        <InfoField label="Business Type" value={requestData?.businessType?.name} />
        <InfoField label="Salgy" value={requestData?.address} />
        <InfoField label="Note" value={requestData?.note} />

        {/* Status select */}
        <div className="py-5 w-full flex items-start justify-between gap-5">
          <div className="text-text-prime w-[50%] text-[18px] font-[500] flex flex-col gap-1">
            <p>Status</p>
            <p className="text-text-secondary/70 w-[80%] text-sm font-[400]">
              Request status saýlaň
            </p>
          </div>
          <div className="w-[50%]">
            <Select
              value={status}
              onChange={(e, val) => setStatus(val)}
              className="w-full !py-2 !px-3 !text-text-prime !text-base !font-[400] !border !rounded-lg !border-black/30 !bg-white"
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
              <Option value="pending">Pending</Option>
              <Option value="accepted">Accepted</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </div>
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between py-[30px] border-t">
          <div className="w-[50%]">
            <h1 className="text-[18px] font-[500]">Request pozmak</h1>
          </div>
          <div className="flex justify-start w-[50%]">
            <Button danger onClick={() => setIsDelete(true)}>
              Pozmak
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full">
        <div className="w-full mt-4 flex justify-end gap-5 items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
          <button
            onClick={() => history.goBack()}
            className="text-[14px] font-[500] py-[11px] px-[27px] hover:bg-red/70 bg-red text-white rounded-[8px]"
          >
            Goýbolsun et
          </button>
          <button
            onClick={handleStatusChange}
            className="text-white text-[14px] font-[500] py-[11px] px-[27px] bg-blue hover:bg-blue/70 rounded-[8px]"
          >
            Ýatda sakla
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        open={isDelete}
        onClose={() => setIsDelete(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}>
          <div className="flex w-[350px] border-b-[1px] border-[#E9EBF0] pb-5 justify-between items-center">
            <h1 className="text-[20px] font-[500]">Request pozmak</h1>
            <button onClick={() => setIsDelete(false)}>✕</button>
          </div>
          <div>
            <h1 className="text-[16px] text-center my-10 font-[400]">
              Request pozmak isleýärsiňizmi?
            </h1>
            <div className="flex gap-[29px] justify-center">
              <button
                onClick={() => setIsDelete(false)}
                className="text-[14px] font-[500] px-6 py-3 text-[#98A2B2] rounded-[8px]"
              >
                Ýatyrmak  
              </button>
              <button
                onClick={handleDelete}
                className="text-[14px] font-[500] text-white hover:bg-[#fd6060] bg-[#FF4D4D] rounded-[8px] px-6 py-3"
              >
                Pozmak
              </button>
            </div>
          </div>
        </Sheet>
      </Modal>
    </div>
  );
};

// 🔹 helper component for showing request info
const InfoField = ({ label, value }) => (
  <div className="py-5 w-full flex items-start justify-between gap-5">
    <div className="text-text-prime w-[50%] text-[18px] font-[500] flex flex-col gap-1">
      <p>{label}</p>
    </div>
    <div className="w-[50%]">
      <p className="text-text-prime text-base">{value || "-"}</p>
    </div>
  </div>
);

export default React.memo(RequestsUpdate);
