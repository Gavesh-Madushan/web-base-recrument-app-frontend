import { useEffect, useState } from "react";
import { openSnackBar } from "./ui-components/CustomSnackBar";

const useVersionCheck = (intervalMs: number = 300000): string | null => {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(`/version.json?t=${new Date().getTime()}`);
        if (response.ok) {
          const data: { version: string } = await response.json();
          if (currentVersion && currentVersion !== data.version) {
            console.log("New version detected. Reloading...");
            openSnackBar("New version detected. Reloading...", "warning", 6000);
            window.location.reload();
          } else {
            setCurrentVersion(data.version);
          }
        }
      } catch (error) {
        console.error("Error fetching version.json:", error);
      }
    };

    // Initial check
    fetchVersion();

    // Periodic version checking
    const intervalId = setInterval(fetchVersion, intervalMs);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [currentVersion, intervalMs]);

  return currentVersion;
};

export default useVersionCheck;
