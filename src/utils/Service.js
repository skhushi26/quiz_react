import React from "react";
import axios from "axios";

const Service = (method, url, body = {}, params = {}) => {
  return new Promise((resolve, reject) => {
    const header = {
      "Content-Type": "application/json",
    };
    let config = {
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
          resolve({
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
