import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Chip,
  Input,
} from "@mui/material";
import { styled } from "@mui/system";
import Downshift from "downshift";
import { useDispatch, useSelector } from "react-redux";
import { VIP_UPDATE } from "../../constants/actionTypes";

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme?.spacing ? theme.spacing(0.5, 0.25) : "4px 2px",
}));

const TagsAdornment = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  maxHeight: 400,
  overflow: "auto",
}));

const TagsInput = styled(TextField)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "baseline",
}));

const TagsInputComponent = memo(
  ({ tags, selectedTags, placeholder, ...other }) => {
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
                <TagsInput
                  InputProps={{
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

                <TagsAdornment>
                  {selectedItem.map((item) => (
                    <StyledChip
                      key={item}
                      tabIndex={-1}
                      label={item}
                      onDelete={handleDelete(item)}
                    />
                  ))}
                </TagsAdornment>
              </div>
            );
          }}
        </Downshift>
      </React.Fragment>
    );
  }
);

const StyledForm = styled("form")(({ theme }) => ({
  padding: 10,
}));

const DialogContentStyled = styled(DialogContent)(({ theme }) => ({
  overflow: "hidden",
}));

const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  marginTop: 20,
  justifyContent: "center",
}));

function SprintVip({ open, onClose, ...rest }) {
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
      <StyledForm onSubmit={onSave} {...rest}>
        <DialogContentStyled>
          <h2>Multiplicador Especial</h2>
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
              <TagsInputComponent
                tags={list}
                fullWidth
                placeholder="Digite o usuário da twitch e de enter pra adicionar"
                label="Usuários Twitch"
                selectedTags={setList}
              />
            </Grid>
          </Grid>
        </DialogContentStyled>

        <DialogActionsStyled>
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            style={{ marginRight: 30, width: 150 }}
          >
            Confirmar
          </Button>

          <Button variant="outlined" color="error" onClick={() => onClose()}>
            Voltar
          </Button>
        </DialogActionsStyled>
      </StyledForm>
    </Dialog>
  );
}

export default SprintVip;
