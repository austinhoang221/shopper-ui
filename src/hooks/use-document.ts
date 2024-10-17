import React from "react";

export const useDocVisible = () => {
  const [visible, setVisible] = React.useState<boolean>(
    window.document.visibilityState === "visible"
  );
  React.useEffect(() => {
    const change = () =>
      setVisible(window.document.visibilityState === "visible");
    window.document.addEventListener("visibilitychange", change);
    return () =>
      window.document.removeEventListener("visibilitychange", change);
  }, []);
  return visible;
};
