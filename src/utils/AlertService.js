const sweetAlert =
  typeof window !== "undefined" && typeof document !== "undefined"
    ? require("sweetalert")
    : async () => {};

const DELAY_TIME = 5000;

const closeFn = () => {
  sweetAlert.stopLoading();
  sweetAlert.close();
};

// Hard close
export function closeAlert() {
  if (sweetAlert.getState().isOpen) {
    closeFn();
  } else {
    setTimeout(closeFn);
  }
}

const setDelay = () => {
  setTimeout(() => {
    closeAlert();
  }, DELAY_TIME);
};

// A prompt modal, when wants to show error
export function showError(text) {
  return sweetAlert({
    title: "Error",
    text,
    icon: "error",
  });
}

// A prompt modal, when wants to show success
export function showSuccess(text, title = "", needDelay = true) {
  if (needDelay) setDelay();
  return sweetAlert({ title, text, icon: "success" });
}

// A prompt modal, when wants to show some information
export function showInfo(text, title = "Info", icon = "info") {
  return sweetAlert({ title, text, icon });
}

// A prompt modal, when confirmation needed
export function showConfirmation(text, title = "warning") {
  return sweetAlert({
    title: title,
    text,
    icon: "warning",
    buttons: {
      cancel: true,
      confirm: "yes",
    },
    dangerMode: true,
    closeOnClickOutside: false,
    closeOnEsc: false,
  });
}

// A prompt modal, where the user's input is logged
export function promptString(text, buttonText = "Ok") {
  return sweetAlert({
    text,
    content: "input",
    button: {
      text: buttonText,
      closeModal: true,
    },
  });
}

export default {
  closeAlert,
  promptString,
  showConfirmation,
  showSuccess,
  showError,
  showInfo,
};
