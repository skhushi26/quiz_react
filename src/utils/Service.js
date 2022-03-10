import axios from "axios";
import { showInfo } from "./AlertService";

const Service = (method, url, body = {}, params = {}, token = null) => {
  // const navigate = useNavigate();
  return new Promise((resolve, reject) => {
    const header = {
      "Content-Type": "application/json",
    };
    if (token) {
      console.log("token: ", token);
      const AUTH_TOKEN = `Bearer ${token}`;
      header.Authorization = AUTH_TOKEN;
    }
    const config = {
      method: method,
      url: url,
      headers: header,
    };
    if (method != "GET" && body) {
      config.data = body;
    } else {
      config.params = params;
    }
    axios(config)
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          resolve({
            error: false,
            data: response.data.data,
            message: response.data.message,
            status: response.status,
          });
        }
      })
      .catch(({ request, response, message }) => {
        const { status, responseText } = request;
        const newResponseText = JSON.parse(responseText);
        if (status === 401) {
          // will logout
          showInfo(
            "Session is expire please do logout and login again!",
            "warning",
            "warning"
          );
          reject({
            error: true,
            data: newResponseText.data,
            message: newResponseText.message,
            status,
          });
        } else {
          resolve({
            error: true,
            data: newResponseText.data,
            message: newResponseText.message,
            status,
          });
        }
      })
      .then(() => {});
  });
};

export default Service;
