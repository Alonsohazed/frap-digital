import { Toaster as Sonner } from "sonner";
import { useTheme } from "../../App";

export function Toaster(props) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === "dark" ? "dark" : "light"}
      richColors
      closeButton
      {...props}
    />
  );
}
