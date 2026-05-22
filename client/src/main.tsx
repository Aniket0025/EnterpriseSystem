import { createRoot } from "react-dom/client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import App from "./App.tsx";
import "./index.css";

const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

if (recaptchaKey) {
  createRoot(document.getElementById("root")!).render(
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey} useRecaptchaNet>
      <App />
    </GoogleReCaptchaProvider>
  );
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}

