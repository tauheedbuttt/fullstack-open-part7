import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import {
  initializeUser,
  localStorageKey,
  loginUser,
} from "../reducers/userReducer";
import loginService from "../services/login";
import LoginForm from "./LoginForm";
import Togglable from "./Togglable";

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const showNotification = (notification, time) => {
    dispatch(setNotification(notification, time));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      dispatch(loginUser(user));
      setUsername("");
      setPassword("");
    } catch (err) {
      showNotification({
        message: err?.response?.data?.error ?? "wrong credentials",
      });
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageKey);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(initializeUser(user));
    }
  }, []);

  return (
    <div>
      {!user && (
        <Togglable buttonLabel="Login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}
    </div>
  );
};

export default Login;
