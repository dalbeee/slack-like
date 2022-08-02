import AppLayout from "@/layouts/AppLayout";
import MessagesViewer from "@/module/app/message/components/MessagesViewer";
import ThreadViewer from "@/module/app/message/components/ThreadViewer";

const Page = () => {
  return (
    <>
      <AppLayout content={<MessagesViewer />} sideBar={<ThreadViewer />} />
    </>
  );
};

Page.Auth = true;
export default Page;
