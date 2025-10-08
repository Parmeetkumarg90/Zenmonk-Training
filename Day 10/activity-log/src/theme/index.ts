import { colors, createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: "1rem",
                    background: "#fff",
                    border:"1px solid #757575",
                    color: "#1976d2",
                    padding: "2% 0 2% 0",
                    margin: "1% 0 1% 0",
                    '&:hover': {
                        backgroundColor: '#1976d2',
                        color: "white"
                    },
                },
                
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontWeight:"bolder",
                    fontSize: "2rem"
                }
            }
        }
    }
});

export default theme;