import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import nookies from "nookies";
import { setCookie } from "nookies";
import { fetchAllDashboard } from "../../../Dashboard/api/DashboardApi";
import { useAppDispatch } from "../../../core/api/redux/hooks";
import { updateDashboardState } from "../../../core/api/redux/features/dashboardSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("token");
  const { token } = nookies.get({});
  const location = useLocation();
  const langParam = location.pathname.split("/")[1] || "pt";

  const fetchAll = async (token) => {
    const resp = await fetchAllDashboard(token);
    dispatch(
      updateDashboardState({ name: "alldashboard", payload: resp.data })
    );
    dispatch(
      updateDashboardState({
        name: "activeDashboard",
        payload: resp?.data ? resp.data[0] : null,
      })
    );
    if (resp?.data && resp.data?.length > 0) {
      navigate(`/${langParam}/dashboard/${resp?.data[0]?.uid}`);
    } else {
      navigate(`/${langParam}/dashboard`);
    }
  };

  useEffect(() => {
    token && navigate(`/${langParam}/dashboard`);
  }, [token]);

  useEffect(() => {
    if (!token && query) {
      setCookie(null, "token", query, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      fetchAll(query);
    }
  }, [query, token, langParam]);

  return;
};

export default Login;
