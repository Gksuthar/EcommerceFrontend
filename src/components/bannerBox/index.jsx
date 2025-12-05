import React from "react";
import { Link } from "react-router-dom";

const BannerBox = ({ img }) => {
  return (
    <div>
      <div className="group ">
        <div className="box bannerBox overflow-hidden rounded-lg">
          <Link to="/">
            <img
              src={img}
              alt="Banner"
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerBox;
