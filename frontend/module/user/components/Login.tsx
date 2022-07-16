/* eslint-disable @typescript-eslint/no-misused-promises */

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { useUser } from "../hooks/useUser";

const schema = yup.object({
  email: yup.string().email().min(6).max(40).required(),
  password: yup.string().min(6).max(20).required(),
});

type Schema = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: yupResolver(schema) });
  const { login } = useUser();
  const onSubmit: SubmitHandler<Schema> = (e) => {
    const loginDto = {
      email: e.email,
      password: e.password,
    };
    login(loginDto);

    return;
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col min-h-screen items-center justify-center">
          <div className="flex py-4">
            <span className="w-24">email</span>
            <input
              className="border-b border-neutral-500 w-60"
              type="text"
              {...register("email")}
            />
            <p>{errors.email?.message}</p>
          </div>
          <div className="flex py-4">
            <span className="w-24">password</span>
            <input
              className="border-b border-neutral-500 w-60"
              type="password"
              {...register("password")}
            />
            <p>{errors.password?.message}</p>
          </div>
          <div className="text-center pt-10">
            <button
              className="bg-neutral-700 rounded-xl w-80 h-20 text-neutral-200 text-2xl font-semibold"
              type="submit"
            >
              login
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
