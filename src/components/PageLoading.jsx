import { Flex, Spin } from "antd";

const PageLoading = () => {
  return (
    <div className="h-[90vh] w-full flex items-center justify-center ">
      <Flex align="center" gap="middle">
        <Spin size="large" />
      </Flex>
    </div>
  );
};

export default PageLoading;
