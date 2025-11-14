"use client";
import { useActionState, useState } from "react";
import { loginAction } from "@/_lib/actions/index";

export default function LoginForm() {
  const [input, setInput] = useState({
    email: "joshua@gmail.com",
    password: "Developedbyjay@1",
  });

  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2 container bg-gray-100 mx-auto">
          <h1 className="mb-4 p-3 bg-gray-400m font-semibold bg-gray-200">Login to use cart-service </h1>
      <form action={formAction} className="">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            email
          </label>
          <input
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            placeholder="Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
