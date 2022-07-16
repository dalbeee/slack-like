import { useSocketConnect } from "@/module/app/hooks/useSocketConnect";

const SocketInitializer = () => {
  useSocketConnect();

  return <></>;
};

export default SocketInitializer;
