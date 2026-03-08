import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { UploadPrescription } from "./pages/UploadPrescription.jsx";
import { AnalysisResults } from "./pages/AnalysisResults.jsx";
import { PatientRecords } from "./pages/PatientRecords.jsx";
import { About } from "./pages/About.jsx";
import { Contact } from "./pages/Contact.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

// Protected route wrappers
function UploadRoute() {
  return <ProtectedRoute><UploadPrescription /></ProtectedRoute>;
}

function AnalysisRoute() {
  return <ProtectedRoute><AnalysisResults /></ProtectedRoute>;
}

function PatientsRoute() {
  return <ProtectedRoute><PatientRecords /></ProtectedRoute>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "upload", Component: UploadRoute },
      { path: "analysis/:id", Component: AnalysisRoute },
      { path: "patients", Component: PatientsRoute },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
], {
  basename: '/',
});
