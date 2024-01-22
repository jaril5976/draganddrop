import { BASE_URL_DASHBOARD } from "../../../ApiEndPoint";

export const fetchAllDashboard = async (token) => {
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards`,
    fetchOptions
  );

  if (response.status !== 200) {
    const text = await response.text();
    return text;
  }
  return response.json();
};

export const AddDashboard = async (data, token) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards`,
    fetchOptions
  );

  if (response.status !== 200) {
    const text = await response.text();
    return text;
  }
  return response.json();
};

export const UpdateDashboard = async (id, data, token) => {
  const fetchOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards/${id}`,
    fetchOptions
  );

  if (response.status !== 200) {
    const text = await response.text();
    return text;
  }
  return response.json();
};

export const DeleteDashboard = async (id, token) => {
  const fetchOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards/${id}`,
    fetchOptions
  );

  if (response.status !== 200) {
    const errObj = await response.json();
    return alert("Something Went Wrong");
  }

  return response.json();
};

export const AddWidget = async (dashboardID, data, token, widgetID) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards/${dashboardID}/widgets/${widgetID}`,
    fetchOptions
  );

  if (response.status !== 200) {
    const errObj = await response.json();
    return alert("Something Went Wrong");
  }
  return response.json();
};

export const DisplayWidgetByWidgetID = async (dashboardID, token, widgetID) => {
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards/${dashboardID}/widgets/${widgetID}`,
    fetchOptions
  );

  if (response.status !== 200) {
    const text = await response.text();
    return text;
  }
  return response.json();
};

export const DisplayWidgetByDashboardID = async (dashboardID, token) => {
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards/${dashboardID}/widgets`,
    fetchOptions
  );

  if (response.status !== 200) {
    const text = await response.text();
    return text;
  }
  return response.json();
};

export const DeleteWidget = async (dashboardID, token, widgetID) => {
  const fetchOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards/${dashboardID}/widgets/${widgetID}`,
    fetchOptions
  );

  if (response.status !== 200) {
    const text = await response.text();
    return text;
  }
  return response.json();
};

export const UpdateWidget = async (dashboardID, data, token, widgetID) => {
  const fetchOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_URL_DASHBOARD}/dashboards/${dashboardID}/widgets/${widgetID}`,
    fetchOptions
  );

  if (response.status !== 200) {
    const errObj = await response.json();
    return alert("Something Went Wrong");
  }
  return response.json();
};
