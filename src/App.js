import {
  AppBar,
  Button,
  Container,
  makeStyles,
  Toolbar,
} from "@material-ui/core";
import React from "react";
import { HashRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import About from "./pages/About/About";
import Config from "./pages/Config/Config";
import Sprint from "./pages/Sprint/Sprint";
import Streamers from "./pages/Streamers/Streamers";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router basename={process.env.REACT_APP_BASE_URL}>
      <AppBar color="default" position="static">
        <Toolbar>
          <div className={classes.title}>
            <NavLink
              to="/"
              component={(props) => (
                <Button {...props} color="primary">
                  Sprint
                </Button>
              )}
            />
            <NavLink
              to="/config"
              component={(props) => (
                <Button {...props} color="secondary">
                  Configuração
                </Button>
              )}
            />
            <NavLink
              to="/about"
              component={(props) => (
                <Button {...props} color="default">
                  Ajuda
                </Button>
              )}
            />
            <NavLink
              to="/streamers"
              component={(props) => (
                <Button {...props} color="default">
                  Streamers
                </Button>
              )}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Switch>
          <Route path="/config">
            <Config />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/streamers">
            <Streamers />
          </Route>
          <Route exact path="/">
            <Sprint />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
