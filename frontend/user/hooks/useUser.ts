import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { httpClient, tokenVault } from "@/common/httpClient";
import { RootState } from "@/store/store";
import { setAccessToken } from "@/store/userSlice";
import { UserJwtToken, UserLoginDto } from "@/common";

export const useUser = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const login = (body: UserLoginDto) => {
    httpClient.post<any, UserJwtToken>("/auth/login", body).then((r) => {
      dispatch(setAccessToken(r?.access_token as string));
      router.push("/auth/connect");
      tokenVault.setAccessToken(r?.access_token as string);
      tokenVault.vaultFlush();
      return;
    });
  };

  return { user, login };
};
