import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { logoutUser } from "../reducers/userReducer";

const Navigation = () => {
  const dispatch = useDispatch();
  const paths = ["blogs", "users"];
  const user = useSelector((state) => state.user);
  const handleLogout = () => dispatch(logoutUser(null));
  return (
    <div className="mb-3">
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
        className="px-3 rounded"
      >
        <div className="d-flex align-items-center w-100">
          <h2 className="mb-0 me-5">BLOGS</h2>
          <Nav className="me-auto" style={{ gap: "2rem" }}>
            {paths.map((item) => (
              <Nav.Link
                as={Link}
                to={`/${item}`}
                key={item}
                className="btn btn-primary"
              >
                {item}
              </Nav.Link>
            ))}
          </Nav>
          {user && (
            <div className="ms-auto d-flex align-items-center">
              <span className="me-3">{user.name}</span>
              <button className="btn btn-danger" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </Navbar>
    </div>
  );
};

export default Navigation;
