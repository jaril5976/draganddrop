// src/App.jsx

import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login/ui/components/login.component";
import PageNotFound from "./components/NotFound/PageNotFound";
import Dashboard from "./components/Dashboard/ui/components/dashboard.component";
import i18n from "./i18n";

const App = () => {
  const location = useLocation();
  const langFromPath = location.pathname.split("/")[1];

  useEffect(() => {
    i18n.changeLanguage(langFromPath);
  }, [location.pathname]);

  if (langFromPath && !["en", "es", "pt"].includes(langFromPath)) {
    return <PageNotFound />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${i18n.language}/sso`} replace={true} />}
      ></Route>
      <Route path="/:language/sso" element={<Login />}></Route>
      <Route path="/:language/dashboard" element={<Dashboard />}>
        <Route path=":dashboardId" element={<Dashboard />} />
      </Route>
      <Route
        path={`/:language`}
        element={<Navigate to={`/${i18n.language}/sso`} />}
      />
      <Route path="*" element={<PageNotFound />}></Route>
    </Routes>
  );
};

export default App;
