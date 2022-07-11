import { useDispatch, useSelector } from "react-redux";

import { httpClient } from "@/common/httpClient";
import { UserJwtToken, UserLoginDto } from "@/common/types";
import { RootState } from "@/store/store";
import { setAccessToken } from "@/store/userSlice";
import { useRouter } from "next/router";

export const useUser = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const login = (body: UserLoginDto) => {
    httpClient.post<any, UserJwtToken>("/auth/login", body).then((r) => {
      dispatch(setAccessToken(r.access_token as string));
      router.push("/auth/connect");
      return;
    });
  };

  return { user, login };
};
