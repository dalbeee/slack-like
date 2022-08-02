import AppLayout from "@/layouts/AppLayout";
import DirectMessageContent from "@/module/app/channel/components/directMessage/DirectMessageContent";

const Page = () => {
  return <AppLayout content={<DirectMessageContent />} />;
};

Page.Auth = true;
export default Page;
