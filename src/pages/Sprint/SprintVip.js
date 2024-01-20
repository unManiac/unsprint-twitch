import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import Downshift from "downshift";
import { useDispatch, useSelector } from "react-redux";
import Chip from "@material-ui/core/Chip";
import { VIP_UPDATE } from "../../constants/actionTypes";

const useTagsStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  adornment: {
    display: "flex",
    flexWrap: "wrap",
    maxHeight: 400,
    overflow: "auto",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
  },
}));

const TagsInput = memo(({ tags, selectedTags, placeholder, ...other }) => {
  const classes = useTagsStyles();
  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(tags);

  useEffect(() => {
    setSelectedItem(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(selectedItem);
  }, [selectedItem, selectedTags]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      if (event.preventDefault) event.preventDefault();
      const newSelectedItem = [...selectedItem];
      const duplicatedValues = newSelectedItem.indexOf(
        event.target.value.trim()
      );

      if (duplicatedValues !== -1) {
        setInputValue("");
        return;
      }
      if (!event.target.value.replace(/\s/g, "").length) return;

      newSelectedItem.push(event.target.value.toLowerCase().trim());
      setSelectedItem(newSelectedItem);
      setInputValue("");
    }
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  }
  function handleChange(item) {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    setSelectedItem(newSelectedItem);
  }

  const handleDelete = (item) => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
  };

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  return (
    <React.Fragment>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={handleChange}
        selectedItem={selectedItem}
      >
        {({ getInputProps }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onKeyDown: handleKeyDown,
            placeholder,
          });
          return (
            <div>
              <TextField
                InputProps={{
                  classes: { root: classes.input },
                  endAdornment: (
                    <div className={classes.adornment}>
                      {selectedItem.map((item) => (
                        <Chip
                          key={item}
                          tabIndex={-1}
                          label={item}
                          className={classes.chip}
                          onDelete={handleDelete(item)}
                        />
                      ))}
                    </div>
                  ),
                  onBlur: (event) => {
                    handleKeyDown({ key: "Enter", target: event.target });
                    onBlur(event);
                  },
                  onChange: (event) => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                {...other}
                {...inputProps}
              />
            </div>
          );
        }}
      </Downshift>
    </React.Fragment>
  );
});

const useStyles = makeStyles(() => ({
  form: {
    padding: 10,
  },
  dialog: {
    overflow: "hidden",
  },
  actions: {
    marginTop: 20,
    justifyContent: "center",
  },
}));

function SprintVip({ open, onClose, ...rest }) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const vip = useSelector((state) => state.vip);

  const [multiplier, setMultiplier] = useState(vip.multiplier);
  const [list, setList] = useState(vip.list || []);

  const onSave = (e) => {
    e.preventDefault();

    dispatch({
      type: VIP_UPDATE,
      multiplier,
      list,
    });

    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <form onSubmit={onSave} className={classes.form} {...rest}>
        <DialogContent className={classes.dialog}>
          <h2 className={classes.title}>Multiplicador Especial</h2>
          <p>Apenas os usuários inseridos irão receber esse multiplicador.</p>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <TextField
                value={multiplier}
                label="Multiplicador especial"
                name="multiplier"
                type="number"
                required
                onChange={({ target: { value } }) => setMultiplier(value)}
                fullWidth
                helperText={`1 minuto = ${multiplier} pontos`}
              />
            </Grid>

            <Grid item xs={12} sm={7} />

            <Grid item xs={12} sm={12}>
              <TagsInput
                tags={list}
                fullWidth
                placeholder="Digite o usuário da twitch e de enter pra adicionar"
                label="Usuários Twitch"
                selectedTags={setList}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className={classes.actions}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            style={{ marginRight: 30, width: 150 }}
          >
            Confirmar
          </Button>

          <Button variant="outlined" color="default" onClick={() => onClose()}>
            Voltar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default SprintVip;
