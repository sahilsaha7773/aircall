import React, { useState } from "react";
import ReactDOM from "react-dom";

import Header from "./Header.jsx";
import ActivitiesList from "./components/ActivitiesList/index.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ArchiveList from "./components/ArchiveList/index.jsx";
import { IoHomeOutline } from "react-icons/io5";
import { LuArchive } from "react-icons/lu";

const App = () => {
  const [archivedTab, setArchivedTab] = useState(false);
  return (
    <div className="container">
      <Header />
      <div className="wrapper">
        <div className="bottomNav">
          <div
            className={`bottomNavItem ${!archivedTab ? "active" : ""}`}
            onClick={() => setArchivedTab(false)}
          >
            <IoHomeOutline className="bottomNavItemIcon" />
            <div className="bottomNavItemTitle">Home</div>
          </div>
          <div
            className={`bottomNavItem ${archivedTab ? "active" : ""}`}
            onClick={() => setArchivedTab(true)}
          >
            <LuArchive className="bottomNavItemIcon" />
            <div className="bottomNavItemTitle">Arhieved</div>
          </div>
        </div>
        <div className="container-view">
          {archivedTab ? <ArchiveList /> : <ActivitiesList />}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
