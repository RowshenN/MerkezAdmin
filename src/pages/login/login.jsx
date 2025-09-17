import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../../context/context";
import loginImg from "../../images/login.svg";
import { useLoginMutation } from "../../services/login";
import { message } from "antd";

const Login = () => {
  const [passType, setPassType] = useState("password");
  const history = useHistory();
  const { dil } = useContext(Context);

  const [user, setUser] = useState({
    phone: "",
    password: "",
  });

  const [login, { isLoading, error }] = useLoginMutation();

  const sign = async () => {
    try {
      // unwrap() gives you the backend JSON directly
      const result = await login(user).unwrap();
      console.log("Login response:", result);

      if (result?.token) {
        localStorage.setItem("userData", JSON.stringify(result));
        message.success("Üstünlikli!");
        window.open("/contact", "_self"); // or history.push("/home")
      } else {
        message.warning("Ilki registratsiýa bolmaly!");
        history.push("/signup");
        console.warn("No token in response:", result);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="max-h-[100vh] w-full flex justify-between">
      <div className="w-fit pl-[60px] h-[100vh] flex flex-col justify-around">
        <div className="">
          <h1 className="text-[40px] font-[500] text-black">Salam!</h1>
          <p className="text-[28px] font-[400]">
            Dolandyryş panela hoş geldiňiz
          </p>
        </div>

        <div className="flex flex-col items-baseline justify-center gap-5">
          <div className="w-[400px] flex flex-wrap gap-1">
            <label className="text-[16px] font-[500]" htmlFor="phone">
              Ulanyjy telefon belgisi
            </label>
            <input
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && sign()}
              id="phone"
              className="px-4 text-black text-[16px] font-[400] h-[50px] w-[400px] rounded-[6px] border border-[#98A2B2] outline-none"
              type="text"
              placeholder="Giriz"
            />
          </div>

          <div className="w-[400px] mt-4 flex flex-wrap gap-1">
            <label className="text-[16px] font-[500]" htmlFor="password">
              Açar sözi
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && sign()}
              id="password"
              className="px-4 text-black text-[16px] font-[400] h-[50px] w-[400px] rounded-[6px] border border-[#98A2B2] outline-none"
              type={passType}
              placeholder="*********"
            />
          </div>

          <div className="px-4 text-black text-[16px] font-[400] h-[50px] w-[400px] rounded-[6px] border border-[#98A2B2] flex items-center justify-start ">
            <p className="text-[18px] font-[sfmedium] ">
              Registratsiýa bolmadyk bolsanyz{" "}
              <span
                onClick={() => history.push("/signup")}
                className="cursor-pointer text-blue "
              >
                Registratsiýa
              </span>{" "}
            </p>
          </div>

          <button
            disabled={isLoading}
            onClick={sign}
            className="text-white text-[16px] mt-[30px] bg-blue font-[500] leading-[50px] h-[50px] w-[400px] rounded-[8px]"
          >
            {isLoading ? "Ulgama girýär..." : "Ulgama gir"}
          </button>

          {error && (
            <div className="text-red-500 mt-2">
              Login failed: {error.error || "Unknown error"}
            </div>
          )}
        </div>

        <div className="text-[16px] font-[500] text-[#98A2B2] w-[350px]">
          Açar sözi we admin maglumatlary üýtgetmek üçin super admina ýüz tutuň.
        </div>
      </div>

      <div className="h-[100vh] w-fit">
        <img className="h-[100vh] object-contain" src={loginImg} alt="" />
      </div>
    </div>
  );
};

export default Login;
