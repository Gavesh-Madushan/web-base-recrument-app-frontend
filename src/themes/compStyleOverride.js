import { lighten } from "@mui/material";

export default function componentStyleOverrides(theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        fieldset: {
          border: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: `${theme?.customization?.borderRadius}px`,
        },
        contained: {
          color: theme.colors?.paper,
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
        },
        contained: {
          color: theme.paper,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          color: theme.paper,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors?.textTitle,
          padding: "24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.textPrimary,
          paddingTop: "10px",
          paddingBottom: "10px",
          "&.Mui-selected": {
            color: theme.menuSelected,
            backgroundColor: theme.menuSelectedBack,
            "&:hover": {
              backgroundColor: theme.menuSelectedBack,
            },
            "& .MuiListItemIcon-root": {
              color: theme.menuSelected,
            },
          },
          "&:hover": {
            backgroundColor: theme.menuSelectedBack,
            color: theme.menuSelected,
            "& .MuiListItemIcon-root": {
              color: theme.menuSelected,
            },
            "& .MuiTypography-root": {
              color: theme.menuSelected,
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.textPrimary,
          minWidth: "36px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textTitle,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.textTitle,
          "&::placeholder": {
            color: theme.textSecondary,
            fontSize: "0.875rem",
          },
          "&:-webkit-autofill": {
            transitionDelay: "9999s",
            transitionProperty: "background-color, color",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          transform: "translate(14px, 12px) scale(1)",
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -6px) scale(0.75)", // Shrink label position
          },
          "&.Mui-focused": {
            transform: "translate(14px, -6px) scale(0.75)",
          },
          "&.MuiFormLabel-filled": {
            transform: "translate(14px, -6px) scale(0.75)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          background: theme.paper,
          borderRadius: `${theme?.customization?.borderRadius}px`,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme?.customization?.mode === "light" ? theme.colors?.grey300 : theme.colors?.white300,
          },
          "&:hover $notchedOutline": {
            borderColor: theme?.customization?.mode === "light" ? theme.colors?.primaryLight : theme.colors?.darkPrimaryLight,
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
          "& .MuiInputLabel-root": {
            transform: "translate(0, 8px) scale(1)", // Default label position
            transition: "transform 0.2s ease",
          },
          "& .MuiInputBase-root.MuiInputBase-adornedStart + .MuiInputLabel-root": {
            transform: "translate(40px, 8px) scale(1)", // Adjust position when startAdornment exists
          },
        },
        input: {
          fontWeight: 500,
          padding: "15.5px 14px",
          borderRadius: `${theme?.customization?.borderRadius}px`,
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
          "&:-webkit-autofill": {
            WebkitBoxShadow: "inherit",
            WebkitTextFillColor: "inherit",
            caretColor: "inherit",
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: theme?.customization?.mode === "light" ? theme.colors?.grey300 : theme.colors?.white300,
          },
        },
        mark: {
          backgroundColor: theme.paper,
          width: "4px",
        },
        valueLabel: {
          color: theme?.colors?.primaryLight,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.divider,
          opacity: 1,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: theme?.customization?.mode === "light" ? theme.colors?.primaryDark : theme.colors?.darkPrimaryDark,
          background: theme?.customization?.mode === "light" ? theme.colors?.primary200 : theme.colors?.darkPrimary200,
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: `8px`,
          size: "small",
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
          fontWeight: "bold",
          color: "#ffffff",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: theme.paper,
          background: theme?.customization?.mode === "light" ? theme.colors?.grey700 : theme.colors?.white700,
        },
      },
    },
    MuiTable: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: `${theme.customization.borderRadius}px`,
          "& .MuiTableContainer-root": {
            borderRadius: `${theme.customization.borderRadius}px`,
            border: `1px solid ${theme.customization.mode === "light" ? theme.colors.primaryMain : theme.colors.darkPrimaryMain}`,
          },
          "& .MuiTableHead-root": {
            borderRadius: `${theme.customization.borderRadius}px`,
            border: `1px solid ${theme.customization.mode === "light" ? theme.colors.primaryMain : theme.colors.darkPrimaryMain}`,
          },
          "& .MuiTableCell-root": {
            borderBottom: `1px solid ${theme.colors.primaryLight}`,
          },
          "& .MuiTableCell-head": {
            fontWeight: "bold",
            backgroundColor: theme?.customization?.mode === "light" ? theme.colors?.primaryLight : theme.colors?.darkPaper,
            // backgroundColor: theme.customization.mode === "light" ? theme.colors.primaryLight : theme.colors.darkPrimaryLight,
            color: theme.customization.mode === "light" ? theme.colors.primaryMain : theme.colors.darkPrimaryMain,
            borderBottom: `1px solid ${theme.customization.mode === "light" ? theme.colors.primaryMain : theme.colors.darkPrimaryMain}`,
          },
          "& .MuiTableRow-root:nth-of-type(odd)": {
            backgroundColor: theme?.customization?.mode === "light" ? theme.colors?.grey100 : theme.colors?.info200,
          },
          "& .MuiTableBody-root": {
            marginTop: "8px",
          },
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        density: "compact",
        disableColumnMenu: true,
        disableColumnSorting: true,
      },
      styleOverrides: {
        root: {
          minHeight: "400px",
          // borderRadius: `${theme?.customization?.borderRadius}px`,
          backgroundColor: theme.paper,
          ".MuiDataGrid-overlay": {
            minHeight: "100% !important",
          },
          "& .MuiDataGrid-main": {
            margin: "10px",
          },
          "& .MuiDataGrid-virtualScroller": {
            // borderRadius: `${theme?.customization?.borderRadius}px`,
            paddingTop: "8px",
            minHeight: "250px",
          },
          "& .MuiDataGrid-columnHeaders": {
            // backgroundColor: theme?.customization?.mode === "light" ? theme.colors?.primaryLight : theme.colors?.darkPaper,
            // borderRadius: `${theme?.customization?.borderRadius}px`,
            border: `1px solid ${theme?.customization?.mode === "light" ? theme.colors?.primaryMain : theme.colors?.darkPrimaryMain}`,
            marginBottom: "8px",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: theme?.customization?.mode === "light" ? theme.colors?.primaryLight : theme.colors?.darkPaper,
          },
          "& .MuiDataGrid-columnSeparator": {
            color: theme?.customization?.mode === "light" ? theme.colors?.primaryMain : theme.colors?.darkrimaryMain,
          },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: theme?.customization?.mode === "light" ? theme.colors?.grey100 : theme.colors?.info200,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `0px solid ${theme.colors?.primaryLight}`,
            alignContent: "center",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important",
            color: theme?.customization?.mode === "light" ? theme.colors?.primaryMain : theme.colors?.darkPrimaryMain,
          },
          "& .edited-row": {
            backgroundColor: lighten(theme?.customization?.mode === "light" ? theme.colors?.secondaryLight : theme.colors?.darkSecondaryLight, 0.5),
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
          height: "40px",
          border: `2px solid ${theme.divider}`,
          color: theme?.customization?.mode === "light" ? theme.colors?.secondaryMain : theme.colors?.darkSecondaryMain,
          "& .MuiButtonBase-root.MuiTab-root": {
            fontWeight: "bold",
            zIndex: 1,
            minHeight: "40px", // Ensures consistent height for tabs
            transition: "color 0.1s ease, transform 0.1s ease", // Smooth color and scale transition
            "&:hover": {
              color: theme.colors?.secondaryMain,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: theme?.paper,
            top: 3,
            bottom: 3,
            right: 3,
            marginLeft: 3,
            height: "36px",
            borderRadius: `${theme?.customization?.borderRadius}px`,
            boxShadow: "0 4px 12px 0 rgba(0,0,0,0.16)",
            border: `1px solid ${theme.colors?.primaryLight}`,
            transition: "all 0.3s ease",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 100,
          minHeight: 40, // Adjust the minimum height to control the tab height
          opacity: 0.7,
          // color: theme?.customization?.mode === "light" ? theme.colors?.secondaryMain : theme.colors?.darkSecondaryMain,
          textTransform: "initial",
          // transition: "color 0.3s ease, opacity 0.3s ease, padding-top 0.3s ease",
          "&:hover": {
            color: theme?.customization?.mode === "light" ? theme.colors?.secondaryMain : theme.colors?.darkSecondaryMain,
            opacity: 1,
          },
          "&.Mui-selected": {
            opacity: 1,
            color: theme?.customization?.mode === "light" ? theme.colors?.textPrimary : theme.colors?.darkTextPrimary,
            borderRadius: `${theme?.customization?.borderRadius}px`,
            fontWeight: 550,
            transition: "all 0.5s ease", // Smooth transition for selection state
          },
          "&.Mui-focusVisible": {
            transition: "background-color 0.3s ease", // Smooth focus transition
            backgroundColor: theme?.customization?.mode === "light" ? theme.colors?.secondaryLight : theme.colors?.darkSecondaryLight,
          },
          "& .MuiTab-iconWrapper": {
            marginBottom: 0, // Prevent extra spacing below the icon
            transition: "transform .1s ease", // Smooth icon hover effect
          },
        },
      },
    },

    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
          ".Mui-disabled": {
            color:
              theme?.customization?.mode === "light"
                ? theme.colors?.grey300
                : theme.colors?.white300,
          },
          "&.Mui-disabled .MuiSvgIcon-root": {
            color:
              theme?.customization?.mode === "light"
                ? theme.colors?.grey300
                : theme.colors?.white300,
            opacity: 0.5,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme?.customization?.mode === "light" ? theme.colors?.primaryMain : theme.colors?.darkPrimaryMain}`,
          marginTop: 10,
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&:before": {
            display: "none",
          },
        },
        rounded: {
          square: true,
        },
        gutters: {
          disableGutters: true,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: theme?.customization?.mode === "light" ? theme.colors?.primaryLight : theme.colors?.darkPrimaryLight,
          flexDirection: "row-reverse",
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
          "& .MuiAccordionSummary-content": {
            marginLeft: 16,
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: theme?.customization?.mode === "light" ? "rgb(0, 0, 0, 0.5)" : "rgb(255, 255, 255, 0.35)",
          boxShadow: "none",
        },
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: "small",
      },
    },
  };
}
