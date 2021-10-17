import React, { useState } from "react";
import S from "../scss/LineLogin.module.scss";
import axios from "axios";

const LineLogin = () => {
  const [src, setSrc] = useState("./image/btn_login_base.png");

  return (
    <div>
      <h1>Login with Line</h1>
      <a href="http://localhost:8080/line/login">
        <img
          src={src}
          onMouseOver={() => setSrc("./image/btn_login_hover.png")}
          onMouseOut={() => setSrc("./image/btn_login_base.png")}
          onMouseDown={() => setSrc("./image/btn_login_press.png")}
          onMouseUp={() => setSrc("./image/btn_login_base.png")}
          className={S.img}
        />
      </a>
    </div>
  );
};

export default LineLogin;
