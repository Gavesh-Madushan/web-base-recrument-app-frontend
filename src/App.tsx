import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import "./App.css";
import Routes from "./components/Routes";
import themes from "./themes";
import ConfirmDialog from "./utils/ui-components/pop-ups/ConfirmDialog";
import ErrorDialog from "./utils/ui-components/pop-ups/ErrorDialog";
import SuccessDialog from "./utils/ui-components/pop-ups/SuccessDialog";
import { useSelector } from "react-redux";
import { StyledEngineProvider } from "@mui/material";
import { injectStore } from "./assets/api/interceptor";
import CustomConfirmDialog from "./utils/ui-components/pop-ups/CustomConfirmDialog";
import ConfirmWithCommentDialog from "./utils/ui-components/pop-ups/ConfirmWithCommentDialog";
import CustomizedSnackbar from "./utils/ui-components/CustomSnackBar";
import { NavigationProvider } from "./components/Routes/NavigationProvider";
import useVersionCheck from "./utils/version-check";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FileViewer from "./utils/ui-components/FileViewer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App({ store }: any) {
  injectStore(store);
  const customization = useSelector((state: any) => state.customization);
  useVersionCheck(300000);

  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <NavigationProvider>
            <CssBaseline />
            <Routes />
            <ConfirmDialog />
            <CustomConfirmDialog />
            <SuccessDialog />
            <ErrorDialog />
            <ConfirmWithCommentDialog />
            <CustomizedSnackbar />
            <FileViewer />
          </NavigationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
