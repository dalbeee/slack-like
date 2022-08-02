import AppLayout from "@/layouts/AppLayout";
import MessagesViewer from "@/module/app/message/components/MessagesViewer";

const Page = () => {
  return (
    <>
      <AppLayout content={<MessagesViewer />} />
    </>
  );
};

Page.Auth = true;
export default Page;
