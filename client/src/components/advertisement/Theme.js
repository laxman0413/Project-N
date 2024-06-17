import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  spacing: factor => `${factor * 8}px`,
});

export default Theme;