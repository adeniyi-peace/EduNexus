import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  redirect, 
  type LoaderFunctionArgs
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { themeCookie } from "./routes/resources.theme";
import { ErrorLayout } from "./components/ui/ErrorLayout";

import MaintenancePage from "./routes/MaintenancePage";
// Mock Utility - Replace with your actual database/auth logic
import { getSystemStatus, getUser } from "./utils/db.server"
import OfflinePage from "./routes/OfflinePage";
import { useEffect, useState } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const theme = (await themeCookie.parse(cookieHeader)) || "edunexus";

  // 1. Check System Status from DB/Redis/Config and Check User Role (Admins bypass maintenance)
  // Fetch User and System Status (Parallel fetch for performance)
  const [user, systemStatus] = await Promise.all([
        getUser(request),
        getSystemStatus()
    ]);

  let maintenanceMode = false

  // 3. The Logic Check
  if (systemStatus.maintenance && user?.role !== 'ADMIN') {
      // If it's a JSON request (API), return 503
      if (request.url.endsWith('.json')) {
            throw new Response("Service Unavailable", { status: 503 });
      }
      // Otherwise, signal the UI to show Maintenance
      maintenanceMode = true 
  }

  return { 
      theme, 
      maintenanceMode
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData<typeof loader>();
  return (
    <html lang="en" data-theme={theme} className={theme === "edunexus_dark" ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { maintenanceMode } = useLoaderData<typeof loader>();
  const [isOnline, setIsOnline] = useState(true);

  // Sync Offline State
  useEffect(() => {
      setIsOnline(navigator.onLine);
      const goOnline = () => setIsOnline(true);
      const goOffline = () => setIsOnline(false);

      window.addEventListener("online", goOnline);
      window.addEventListener("offline", goOffline);

      return () => {
          window.removeEventListener("online", goOnline);
          window.removeEventListener("offline", goOffline);
      };
  }, []);

  if (!isOnline) {
      return <OfflinePage />;
  }

  // If maintenance is ON, we hijack the entire app rendering
  if (maintenanceMode) {
      return <MaintenancePage />;
  }

  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

    // 1. Handle Response Errors (Thrown from loaders/actions)
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <ErrorLayout code="404" title="Not Found" message="The requested resource doesn't exist." />;
        }

        if (error.status === 401 || error.status === 403) {
            return (
                <ErrorLayout 
                    code="403" 
                    title="Faculty Only" 
                    message="You don't have the necessary permissions to access this restricted area." 
                />
            );
        }

        return (
            <ErrorLayout 
                code="500" 
                title="System Glitch" 
                message={`Error ${error.status}: ${error.statusText}`} 
            />
        );
    }

    // 2. Handle Unexpected JavaScript Crashes
    let errorMessage = "An unexpected error occurred within the application core.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <ErrorLayout 
            code="500" 
            title="Our Servers Fainted" 
            message={errorMessage} 
        />
    );
}