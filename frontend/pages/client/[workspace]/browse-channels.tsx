import AppLayout from "@/layouts/AppLayout";
import ChannelSearch from "@/module/app/channel/components/ChannelSearch";

const Page = () => {
  return <AppLayout content={<ChannelSearch />} />;
};

Page.Auth = true;
export default Page;
