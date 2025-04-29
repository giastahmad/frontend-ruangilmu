import React, { useEffect } from "react";

function ToastNotification({ status }) {
  useEffect(() => {
    if (status) {
      const toast = document.getElementById(`${status}Toast`);
      toast.classList.remove("invisible");
      setTimeout(() => toast.classList.add("invisible"), 3000);
    }
  }, [status]);

  return (
    <>
      <div
        id="successToast"
        className="invisible fixed top-5 left-1/2 -translate-x-1/2 bg-white border-3 border-[#026078] text-green-500 py-2 px-4 rounded-md shadow-lg"
      >
        Login Successful!
      </div>
      <div
        id="errorToast"
        className="invisible fixed top-5 left-1/2 -translate-x-1/2 bg-white border-3 border-[#026078] text-red-500 py-2 px-4 rounded-md shadow-lg"
      >
        Incorrect Email or Password!
      </div>
    </>
  );
}

export default ToastNotification;
