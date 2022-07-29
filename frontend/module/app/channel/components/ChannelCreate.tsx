/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { channelCreateTextScript } from "./textScript";

export const ChannelCreate = () => {
  return (
    <div className="w-4/5 bg-neutral-800 p-6 rounded-md">
      <h1 className="text-2xl font-bold text-neutral-200 pb-4">
        {channelCreateTextScript.title}
      </h1>
      <p className="text-neutral-300">
        {channelCreateTextScript.titleDescribe}
      </p>
      <div className="flex flex-col py-4">
        <span className="text-neutral-200 py-1">
          {channelCreateTextScript.name}
        </span>
        <input
          className=""
          placeholder={channelCreateTextScript.nameDescribe}
        />
      </div>
      <div className="flex flex-col py-4">
        <span className="text-neutral-200 py-1">
          {channelCreateTextScript.describe}
        </span>
        <input className="" />
        <span className="text-neutral-300 text-sm">
          {channelCreateTextScript.describeRemark}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-3/5">
          <div className="text-neutral-200">
            {channelCreateTextScript.inPrivate}
          </div>
          <span className="text-neutral-300 text-sm">
            {channelCreateTextScript.inPrivateDescribe}
          </span>
        </div>
        <input className="w-8 h-8" type="check" />
      </div>
      <div className="flex justify-between pt-8">
        <div className="">
          <input
            className=""
            type="check"
            placeholder={channelCreateTextScript.externalShare}
          />
          <span>⚠️</span>
        </div>
        <button className="px-4 py-1 text-neutral-200 rounded-md bg-neutral-500">
          {channelCreateTextScript.createButton}
        </button>
      </div>
    </div>
  );
};
