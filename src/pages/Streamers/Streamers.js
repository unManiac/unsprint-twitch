import { Button, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { GREEN } from "../../constants/colors";
import { shuffleArray } from "../../helper";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 30,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  title: {
    margin: 0,
    display: "inline-block",
    color: GREEN,
  },
}));

const Streamer = ({ channel }) => {
  return (
    <div style={{ padding: 15 }}>
      <iframe
        src={`https://player.twitch.tv/?channel=${channel}&parent=unmaniac.github.io&muted=true`}
        height="270"
        width="540"
        title={channel}
        allowfullscreen="true"
      ></iframe>
    </div>
  );
};

export default function Streamers() {
  const classes = useStyles();

  const names = shuffleArray([
    "andreabistafa",
    "aprendizdelivros",
    "ayaliteraria",
    "baleiatriz",
    "bibilendo",
    "carollmariaa",
    "eibarbarasa",
    "fernandoarjr",
    "flaviafialho",
    "norathegrace",
    "patricialimams",
    "souoleoedai",
  ]);

  return (
    <Grid container className={classes.root} spacing={1} alignItems="center">
      <Grid container justifyContent="space-between" alignItems="center">
        <h2 className={classes.title}>Streamers que utilizam o unSprint</h2>

        <Button
          onClick={() =>
            window.alert(
              "Envie um sussuro ao unManiac, é recomendado que seja um(a) streamer ativo(a) para participar da página."
            )
          }
          color="primary"
          variant="outlined"
        >
          Quero fazer parte!
        </Button>
      </Grid>
      {names.map((name) => (
        <Streamer key={name} channel={name} />
      ))}
    </Grid>
  );
}
