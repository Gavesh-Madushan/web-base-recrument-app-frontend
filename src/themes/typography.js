import { isBrowser, isTablet ,isMobile } from "react-device-detect";

/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function themeTypography(theme) {
  return {
    fontFamily: theme?.customization?.fontFamily,
    h6: {
      fontWeight: 500,
      color: theme.heading,
      fontSize: "0.75rem",
    },
    h5: {
      fontSize: "0.875rem",
      color: theme.heading,
      fontWeight: 500,
    },
    h4: {
      fontSize: "1rem",
      color: theme.heading,
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      color: theme.heading,
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      color: theme.heading,
      fontWeight: 700,
    },
    h1: {
      fontSize: "2.125rem",
      color: theme.heading,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 550,
      color: theme.textTitle,
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      color: theme.textSecondary,
    },
    caption: {
      fontSize: "0.75rem",
      color: theme.textSecondary,
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334em",
    },
    body2: {
      letterSpacing: "0em",
      fontWeight: 400,
      lineHeight: "1.5em",
      color: theme.textPrimary,
    },
    pageHeader: {
      fontSize:  '1.25rem',
      fontWeight: 600,
      color: theme.textSecondary,
      display: "flex",
      // alignItems: "center",
      gap: 1,
    },
    button: {
      textTransform: "capitalize",
      marginTop: 1.3,
      fontWeight: 500,
    },
    customInput: {
      marginTop: 1,
      marginBottom: 1,
      "& .MuiInputLabel-root": {
        top: 20,
        left: 0,
        color: theme?.customization?.mode === "light" ? theme.colors?.grey500 : theme.colors?.white500,
        '&[data-shrink="false"]': {
          top: 5,
        },
      },
      "& > div > input": {
        padding: "30.5px 14px 11.5px !important",
      },
      "& > div > div": {
        padding: "30.5px 14px 11.5px !important",
      },
      "& textarea": {
        padding: "30.5px 14px 0px !important",
      },
      "& legend": {
        display: "none",
      },
      "& fieldset": {
        top: 0,
      },
    },
    mainContent: {
      backgroundColor: theme.backgroundDefault,
      width: "100%",
      flexGrow: 1,
    },
    mainLayoutContent: {
      backgroundColor: theme.background,
      minHeight: "calc(100vh - 65px)",
      padding: isBrowser ? "20px": isTablet ? "20px" : isMobile ? "20px 5px 10px 5px": "20px",
      margin: isBrowser ? "65px 16px 0 16px": isTablet ? "65px 10px 0 10px" : isMobile ? "60px 5px 0 5px": "65px 16px 0 16px",
      borderRadius: `${theme?.customization?.borderRadius}px ${theme?.customization?.borderRadius}px 0 0`,
    },
    minimalLayoutContent: {
      backgroundColor: theme.background,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    menuCaption: {
      fontSize: "0.875rem",
      fontWeight: 550,
      color: theme.heading,
      padding: "6px",
      textTransform: "capitalize",
      marginTop: "10px",
    },
    subMenuCaption: {
      fontSize: "0.6875rem",
      fontWeight: 550,
      color: theme.textSecondary,
      textTransform: "capitalize",
    },
    commonAvatar: {
      cursor: "pointer",
      borderRadius: "8px",
    },
    smallAvatar: {
      width: "22px",
      height: "22px",
      fontSize: "1rem",
    },
    mediumAvatar: {
      width: "34px",
      height: "34px",
      fontSize: "1.2rem",
    },
    largeAvatar: {
      width: "44px",
      height: "44px",
      fontSize: "1.5rem",
    },
  };
}
