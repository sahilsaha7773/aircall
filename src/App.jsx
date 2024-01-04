import React, { useState } from "react";
import ReactDOM from "react-dom";

import Header from "./Header.jsx";
import ActivitiesList from "./components/ActivitiesList/index.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ArchiveList from "./components/ArchiveList/index.jsx";
import { IoHomeOutline } from "react-icons/io5";
import { LuArchive } from "react-icons/lu";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ActivitiesList />,
  },
  {
    path: "/details",
    element: <div>Details</div>,
  },
]);
const App = () => {
  const [archivedTab, setArchivedTab] = useState(false);
  return (
    <div className="container">
      <div className="wrapper">
        <Header />
        <div className="bottomNav">
          <div
            className={`bottomNavItem ${!archivedTab ? "active" : ""}`}
            onClick={() => setArchivedTab(false)}
          >
            {/* <div className="bottomNavItemIcon">
            <img src="https://img.icons8.com/ios/50/000000/home--v1.png" />
          </div> */}
            <IoHomeOutline className="bottomNavItemIcon" />
            <div className="bottomNavItemTitle">Home</div>
          </div>
          <div
            className={`bottomNavItem ${archivedTab ? "active" : ""}`}
            onClick={() => setArchivedTab(true)}
          >
            {/* <div className="bottomNavItemIcon">
            <img src="https://img.icons8.com/ios/50/000000/phone.png" />
          </div> */}
            <LuArchive className="bottomNavItemIcon" />
            <div className="bottomNavItemTitle">Arhieved</div>
          </div>
        </div>
        <div className="container-view">
          {/* Some activities should be here */}
          {/* <ActivitiesList /> */}
          {archivedTab ? <ArchiveList /> : <ActivitiesList />}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
