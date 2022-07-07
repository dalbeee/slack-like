import { useQuery } from "react-query";
import { useState } from "react";

import { httpClient } from "@/common/httpClient";

export const useChannelMenu = ({ workspace }: { workspace: string }) => {
  const [enabled, setEnabled] = useState(false);

  const { data } = useQuery(
    "/channels",
    () => {
      return httpClient.get<any, { id: string; name: string }[]>(
        `/${workspace}`
      );
    },
    { enabled }
  );
  return { data, enabled: setEnabled };
};
