import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { AuthProvider } from "./common/context/AuthContext";
import { ThemeProvider } from "./common/hooks/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
