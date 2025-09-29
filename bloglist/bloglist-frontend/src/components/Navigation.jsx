import React from "react";
import { Link } from "react-router";

const Navigation = () => {
  const paths = ["blogs", "users"];
  return (
    <div>
      {paths.map((path) => (
        <span>
          <Link key={path} to={`/${path}`}>
            {path}
          </Link>{" "}
        </span>
      ))}
    </div>
  );
};

export default Navigation;
