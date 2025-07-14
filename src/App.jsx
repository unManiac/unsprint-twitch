import { AppBar, Button, Container, Toolbar } from "@mui/material";
import { styled } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route, NavLink } from "react-router-dom";
import About from "./pages/About/About";
import Config from "./pages/Config/Config";
import Sprint from "./pages/Sprint/Sprint";
import Forest from "./pages/Forest/Forest";
import Glossary from "./pages/Glossary/Glossary";
import Sprint2 from "./pages/Sprint2/Sprint2";
import { Toaster } from "sonner";

const StyledToolbarDiv = styled("div")(({ theme }) => ({
  flexGrow: 1,
}));

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#f9f9fb",
    },
    primary: {
      light: "#A1C8FF", // soft sky blue
      main: "#1976D2", // strong mid blue
      dark: "#004BA0", // deep navy
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#D7B2FF", // soft lavender
      main: "#A95EFF", // rich purple
      dark: "#6E1FBF", // deep violet
      contrastText: "#ffffff",
    },
    error: {
      main: "#E53935",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFA000",
      contrastText: "#000000",
    },
    info: {
      main: "#0288D1",
      contrastText: "#ffffff",
    },
    success: {
      main: "#43A047",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#5f6368",
      disabled: "#9e9e9e",
    },
    divider: "#e0e0e0",
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar color="default" position="static">
        <Toolbar>
          <StyledToolbarDiv>
            <NavLink to="/">
              {({ isActive }) => <Button color="info">Sprint</Button>}
            </NavLink>
            <NavLink to="/forest">
              {({ isActive }) => <Button color="success">Forest</Button>}
            </NavLink>
            <NavLink to="/config">
              {({ isActive }) => (
                <Button color="secondary">Configuração</Button>
              )}
            </NavLink>
            <NavLink to="/about">
              {({ isActive }) => <Button color="secondary">Ajuda</Button>}
            </NavLink>
            <NavLink to="/comandos">
              {({ isActive }) => <Button color="secondary">Glossário</Button>}
            </NavLink>
          </StyledToolbarDiv>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/config" element={<Config />} />
          <Route path="/about" element={<About />} />
          <Route path="/sprint" element={<Sprint2 />} />
          <Route path="/forest" element={<Forest />} />
          <Route path="/comandos" element={<Glossary />} />
          <Route path="/" element={<Sprint />} />
        </Routes>
      </Container>

      <Toaster position="top-right" theme="light" richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
