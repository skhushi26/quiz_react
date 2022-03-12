import React, { useState, useContext, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { AppContext } from "../../contexts/appContext";

export default function Loader() {
  const { userDetail } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const { loader } = userDetail;

  useEffect(() => {
    if (!loader) {
      setTimeout(() => {
        setOpen(loader);
      }, 1000);
    } else setOpen(loader);
  }, [loader]);

  return open ? (
    <div className="backdrop">
      <Spinner animation="border" variant="danger" />
    </div>
  ) : (
    <></>
  );
}
