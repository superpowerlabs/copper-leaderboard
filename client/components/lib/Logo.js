import React from "react";
import { isSynCity } from "../../config";

function Logo(props) {
  let src = isSynCity
    ? "https://data.mob.land/assets/SynCityYellowLogo.png"
    : "https://s3.mob.land/assets/Mobland_Title_Stylized300.png";

  return (
    <img
      className={props.cls}
      src={src}
      alt={"logo"}
      style={props.style || {}}
    />
  );
}
export default Logo;
