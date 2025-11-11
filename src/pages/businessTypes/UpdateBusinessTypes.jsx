import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Alert from "@mui/joy/Alert";
import { IconButton, Switch, Typography } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningIcon from "@mui/icons-material/Warning";
import PageLoading from "../../components/PageLoading";
import { message } from "antd";
import {
  useGetBusinessTypeByIdQuery,
  useUpdateBusinessTypeMutation,
} from "../../services/businessTypes";

const UpdateBusinessTypes = () => {
  const history = useHistory();
  const { id } = useParams();

  // ✅ Fetch single business type
  const { data: businessTypeData, isLoading: isFetching } =
    useGetBusinessTypeByIdQuery(id);

  // ✅ RTK mutation for update
  const [updateBusinessType, { isLoading: isUpdating }] =
    useUpdateBusinessTypeMutation();

  const [warning, setWarning] = useState(false);
  const [businessType, setBusinessType] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // ✅ Fill form when data loads
  useEffect(() => {
    if (businessTypeData) {
      setBusinessType({
        name: businessTypeData.name || "",
        description: businessTypeData.description || "",
        isActive: businessTypeData.isActive ?? true,
      });
    }
  }, [businessTypeData]);

  // ✅ Submit handler
  const handleSubmit = async () => {
    if (!businessType.name || !businessType.description) {
      setWarning(true);
      return;
    }

    try {
      await updateBusinessType({
        id,
        data: {
          name: businessType.name,
          description: businessType.description,
          isActive: businessType.isActive,
        },
      }).unwrap();

      message.success("Business type updated successfully!");
      history.goBack();
    } catch (err) {
      console.error(err);
      message.error("Error updating business type. Please try again.");
    }
  };

  if (isFetching || isUpdating) return <PageLoading />;

  return (
    <div className="w-full">
      {/* Warning Alert */}
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
              Please fill in both the name and description fields.
            </Typography>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="w-full pb-[30px] flex justify-between items-center">
        <h1 className="text-[30px] font-[700]">Biznes görnüşini üýtget</h1>
      </div>

      {/* Form Container */}
      <div className="w-full min-h-[60vh] p-5 bg-white rounded-[8px]">
        <div className="flex flex-col md:flex-row justify-between py-[30px] gap-6">
          <div className="w-full md:w-[49%] flex flex-col gap-6">
            {/* Name Input */}
            <div className="w-full flex flex-col gap-2">
              <h1>Name</h1>
              <input
                value={businessType.name}
                onChange={(e) =>
                  setBusinessType({ ...businessType, name: e.target.value })
                }
                placeholder="Enter business type name..."
                className="text-[14px] w-full mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            {/* Description */}
            <div className="w-full flex flex-col gap-2">
              <h1>Description</h1>
              <textarea
                value={businessType.description}
                onChange={(e) =>
                  setBusinessType({
                    ...businessType,
                    description: e.target.value,
                  })
                }
                placeholder="Enter description..."
                className="text-[14px] w-full min-h-[100px] mt-1 text-black font-[400] border-[1px] border-[#98A2B2] rounded-[6px] px-5 py-3 outline-none"
              />
            </div>

            {/* Active Switch */}
            <div className="w-full py-3 px-4 border border-[#98A2B2] rounded-lg flex items-center justify-between mt-4">
              <h1>Aktiw ýagdaýy</h1>
              <Switch
                checked={businessType.isActive}
                onChange={(e) =>
                  setBusinessType({
                    ...businessType,
                    isActive: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="sticky bottom-0 py-2 bg-[#F7F8FA] w-full">
        <div className="w-full mt-4 flex justify-end gap-5 items-center bg-white py-4 px-5 border-[1px] border-[#E9EBF0] rounded-[8px]">
          <button
            onClick={() => history.goBack()}
            className="text-[14px] font-[500] py-[11px] px-[27px] text-blue hover:bg-red hover:text-white rounded-[8px]"
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

export default React.memo(UpdateBusinessTypes);
