import React, { useContext, useRef, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./verification.css";

import { Context } from "../../context/context";

import lang from "../../lang/home.json";
import { axiosInstance } from "../../utils/axiosIntance";

const Verification = () => {
  const history = useHistory();
  const { phone } = useParams();
  const { dil, checkLogin } = useContext(Context);
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const [foc, setFoc] = useState(2);
  // const [code, setCode] = useState({ a: "", b: "", c: "", d: "", e: "" });
  const [code, setCode] = useState("");
  const goBack = () => {
    history.goBack();
  };
  const goVerificationFilled = () => {
    // history.push({pathname:"/verification_filled"})
  };
  // useEffect(() => {
  //   console.log(foc, code.a.length);
  //   if (code.a.length > 0) {
  //     setFoc(2);
  //   } else if (code.b.length > 0) {
  //     setFoc(3);
  //   } else if (code.c.length > 0) {
  //     setFoc(4);
  //   } else if (code.d.length > 0) {
  //     setFoc(5);
  //   }
  // }, [code, foc]);

  const verify = () => {
    axiosInstance
      .post("/api/user/check", {
        code: code,
        phone_number: phone,
      })
      .then((data) => {
        if (data.data?.token) {
          localStorage.setItem("userData", JSON.stringify(data.data));
          checkLogin();
          history.push({ pathname: "/mrt/profile/info" });
        }
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="max-h-[100vh]">
      <div className="v-body">
        <section>
          <div className="login-container !h-fit">
            <h2 className="Title">Tassyklayjy kod</h2>
            <p className="p-1">Telefon belgiñize tassyklaýjy kody iberdik</p>
            <div className="v-input-box">
              <input
                autoFocus={true}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    verify();
                  }
                }}
                className="v-input !w-full text-center text-[22px] outline-none"
                maxLength={5}
                required
                type="text"
              />
              {/* <input
                autoFocus={foc === 1}
                onChange={(e) => {
                  setCode({ ...code, a: e.target.value });
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    setFoc(2);
                    console.log("s");
                  }
                }}
                className="v-input text-center text-[22px] outline-none"
                maxLength={1}
                required
                type="text"
              />
              <input
                autoFocus={foc == 2}
                onChange={(e) => {
                  setCode({ ...code, b: e.target.value });
                }}
                className="v-input text-center text-[22px] outline-none"
                maxLength={1}
                required
                type="text"
              />
              <input
                autoFocus={foc == 3}
                onChange={(e) => {
                  setCode({ ...code, c: e.target.value });
                }}
                className="v-input text-center text-[22px] outline-none"
                maxLength={1}
                required
                type="text"
              />
              <input
                autoFocus={foc == 4}
                onChange={(e) => {
                  setCode({ ...code, d: e.target.value });
                }}
                className="v-input text-center text-[22px] outline-none"
                maxLength={1}
                required
                type="text"
              />
              <input
                autoFocus={foc == 5}
                onChange={(e) => {
                  setCode({ ...code, e: e.target.value });
                }}
                className="v-input text-center text-[22px] outline-none"
                maxLength={1}
                required
                type="text"
              /> */}
            </div>
            {/* <p style={{ marginTop: "24px", marginBottom: "18px" }}>0:35</p> */}
            <button className="button-1" onClick={() => verify()}>
              Dowam etmek
            </button>
            <div>
              <p
                style={{ cursor: "pointer" }}
                className="p-3"
                onClick={() => goBack()}
              >
                {"<-- "} Yza gaýtmak
              </p>
            </div>
          </div>
        </section>
        <div className="w-full flex  justify-center text-[18px] my-6 text-neutral-900 font-semi">
          © 2023
          <span className="font-bold mx-1">
            {/* Günlük söwda  */}
            Söwda müdürligi onlaýn.
          </span>
          {dil === "TM"
            ? "Ähli Hukuklar goralan"
            : dil === "RU"
            ? "Все права защищены"
            : "All Rights Reserved"}
        </div>
      </div>
    </div>
  );
};
export default Verification;
