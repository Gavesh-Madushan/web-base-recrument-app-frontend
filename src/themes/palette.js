/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function themePalette(theme) {
    return {
        mode: theme?.customization?.mode,
        ...(theme?.customization?.mode === 'light' ? {
            common: {
                black: theme.colors?.darkPaper
            },
            primary: {
                light: theme.colors?.primaryLight,
                main: theme.colors?.primaryMain,
                dark: theme.colors?.primaryDark,
                200: theme.colors?.primary200,
                800: theme.colors?.primary800
            },
            secondary: {
                light: theme.colors?.secondaryLight,
                main: theme.colors?.secondaryMain,
                dark: theme.colors?.secondaryDark,
                200: theme.colors?.secondary200,
                800: theme.colors?.secondary800
            },
            info: {
                light: theme.colors?.infoLight,
                main: theme.colors?.infoMain,
                dark: theme.colors?.infoDark,
                200: theme.colors?.info200,
                800: theme.colors?.info800
            },
            text: {
                primary: theme.textPrimary,
                secondary: theme.textSecondary,
                dark: theme.textTitle,
                hint: theme.colors?.grey100
            },
        } : {
            common: {
                black: theme.colors?.darkPaper
            },
            primary: {
                light: theme.colors?.darkPrimaryLight,
                main: theme.colors?.darkPrimaryMain,
                dark: theme.colors?.darkPrimaryDark,
                200: theme.colors?.darkPrimary200,
                800: theme.colors?.darkPrimary800
            },
            secondary: {
                light: theme.colors?.darkSecondaryLight,
                main: theme.colors?.darkSecondaryMain,
                dark: theme.colors?.darkSecondaryDark,
                200: theme.colors?.darkSecondary200,
                800: theme.colors?.darkSecondary800
            },
            info: {
                light: theme.colors?.darkInfoLight,
                main: theme.colors?.darkInfoMain,
                dark: theme.colors?.darkInfoDark,
                200: theme.colors?.darkInfo200,
                800: theme.colors?.darkInfo800
            },
            text: {
                primary: theme.textPrimary,
                secondary: theme.textSecondary,
                dark: theme.textTitle,
                hint: theme.colors?.white100
            },
        }),
        background: {
            paper: theme.paper,
            default: theme.backgroundDefault,
            footer: theme.footerBackground
        },
        transparent: {
            light: theme.colors?.transparent,
            main: theme.colors?.transparent,
            dark: theme.colors?.transparent,
            200: theme.colors?.transparent,
            800: theme.colors?.transparent
        },
        error: {
            light: theme.colors?.errorLight,
            main: theme.colors?.errorMain,
            dark: theme.colors?.errorDark
        },
        orange: {
            light: theme.colors?.orangeLight,
            main: theme.colors?.orangeMain,
            dark: theme.colors?.orangeDark,
            200: theme.colors?.orange200,
            800: theme.colors?.orange800
        },
        blue: {
            light: theme.colors?.blueLight,
            main: theme.colors?.blueMain,
            dark: theme.colors?.blueDark,
            200: theme.colors?.blue200,
            800: theme.colors?.blue800
        },
        purple: {
            light: theme.colors?.purpleLight,
            main: theme.colors?.purpleMain,
            dark: theme.colors?.purpleDark,
            200: theme.colors?.purple200,
            800: theme.colors?.purple800
        },
        red: {
            light: theme.colors?.redLight,
            main: theme.colors?.redMain,
            dark: theme.colors?.redDark,
            200: theme.colors?.red200,
            800: theme.colors?.red800
        },
        warning: {
            light: theme.colors?.warningLight,
            main: theme.colors?.warningMain,
            dark: theme.colors?.warningDark
        },
        success: {
            light: theme.colors?.successLight,
            200: theme.colors?.success200,
            main: theme.colors?.successMain,
            dark: theme.colors?.successDark
        },
        grey: {
            50: theme.colors?.grey50,
            100: theme.colors?.grey100,
            300: theme.colors?.grey300,
            500: theme.colors?.grey500,
            600: theme.colors?.grey600,
            700: theme.colors?.grey700,
            900: theme.colors?.grey900
        },
        white: {
            50: theme.colors?.white50,
            100: theme.colors?.white100,
            300: theme.colors?.white300,
            500: theme.colors?.white500,
            600: theme.colors?.white600,
            700: theme.colors?.white700,
            900: theme.colors?.white900
        },
        green: {
            light: theme.colors?.greenLight,
            main: theme.colors?.greenMain,
            dark: theme.colors?.greenDark,
            200: theme.colors?.green200,
            800: theme.colors?.green800
        },
        dark: {
            light: theme.colors?.textPrimary,
            main: theme.colors?.darkLevel1,
            dark: theme.colors?.darkLevel2,
            800: theme.colors?.darkBackground,
            900: theme.colors?.darkPaper
        },
    };
}
