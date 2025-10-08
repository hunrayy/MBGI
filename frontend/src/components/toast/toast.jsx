import { toast } from "sonner";
import React from "react";

// Default icons for each toast type
const toastIcons = {
  success: <i className="fa fa-check-circle" style={{ color: "green", fontSize: "1.2rem" }}></i>,
  error: <i className="fa fa-times-circle" style={{ color: "red", fontSize: "1.2rem" }}></i>,
  info: <i className="fa fa-info-circle" style={{ color: "blue", fontSize: "1.2rem" }}></i>,
  warning: <i className="fa fa-exclamation-circle" style={{ color: "orange", fontSize: "1.2rem" }}></i>,
};

// Default style for all toasts
const defaultStyle = {
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  paddingTop: "20px",
  paddingBottom: "20px",
};

// Wrapper functions
export const toastSuccess = (message) => toast.success(message, { style: defaultStyle, icon: toastIcons.success });
export const toastError = (message) => toast.error(message, { style: defaultStyle, icon: toastIcons.error });
export const toastInfo = (message) => toast(message, { style: defaultStyle, icon: toastIcons.info });
export const toastWarning = (message) => toast(message, { style: defaultStyle, icon: toastIcons.warning });
