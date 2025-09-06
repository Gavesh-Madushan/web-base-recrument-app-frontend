import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import DialogContentText from "@mui/material/DialogContentText";

export const ModelClose = styled(IconButton)`
  box-shadow: none !important;
  position: absolute !important;
  right: 0px;
  top: 0px;
  display: flex !important;
  align-items: center;
`;
export const StatusIcon = styled(Icon)(
    ({theme, color}) => `
  font-size: 72px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 3px solid ${theme.palette[color].main};
  outline-offset:5px;
  color: ${theme.palette[color].main}
`,
);
export const ModelTitle = styled(DialogTitle)(
    ({theme, color}) => `
    text-align: center;
    color: ${theme.palette[color].main};
    font-size: 1.75rem;
    font-weight: bold;
`,
);
export const ModelContentText = styled(DialogContentText)`
    text-align: center;
    font-size: medium;
`;
export const ModelButton = styled(Button)`
  height: 40px;
  margin: 10px 0;
  line-height: 17px;
  font-weight: bold;
`;
