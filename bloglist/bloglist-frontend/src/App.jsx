import { Route, Routes } from "react-router";
import Login from "./components/Login";
import Notification from "./components/Notification";
import User from "./User";
import Users from "./Users";
import Blogs from "./Blogs";
import Blog from "./components/Blog";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <div>
      <h2>BLOGS</h2>
      <Notification />
      <Navigation />
      <Login />
      <Routes>
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
