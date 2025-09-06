import {createTheme} from '@mui/material/styles';

// assets
import colors from '../assets/scss/_theme-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {

    const color = colors;

    const themeOption = (customization?.mode === 'light' ? {
        colors: color,
        heading: color.grey900,
        paper: color.paper,
        backgroundDefault: color.paper,
        background: color.background,
        footerBackground: color.primaryLight,
        textPrimary: color.textPrimary,
        textSecondary: color.textSecondary,
        textTitle: color.textTitle,
        menuSelected: color.secondaryDark,
        menuSelectedBack: color.secondaryLight,
        divider: color.grey200,
        transparent: color.transparent,
        customization
    } : {
        colors: color,
        heading: color.white900,
        paper: color.darkPaper,
        backgroundDefault: color.darkPaper,
        background: color.darkBackground,
        footerBackground: color.darkSecondaryDark,
        textPrimary: color.darkTextPrimary,
        textSecondary: color.darkTextSecondary,
        textTitle: color.darkTextTitle,
        menuSelected: color.darkSecondaryDark,
        menuSelectedBack: color.darkSecondaryLight,
        divider: color.white200,
        transparent: color.transparent,
        customization
    });

    const themeOptions = {
        direction: 'ltr',
        palette: themePalette(themeOption),
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypography(themeOption)
    };

    const themes = createTheme(themeOptions);
    themes.components = componentStyleOverrides(themeOption);

    return themes;
};

export default theme;
