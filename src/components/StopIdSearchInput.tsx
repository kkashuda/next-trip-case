import { useEffect, useState, EventHandler, KeyboardEvent } from "react";

import { Grid, styled, IconButton, Alert, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  useDepartureDataContext,
  AppContextInterface,
} from "../context/DepartureDataContext";

const StyledFormContainer = styled(Grid)`
  padding-bottom: 32px;
  padding-top: 32px;
`;

const StyledTextField = styled(TextField)`
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

function StopIdSearchInput() {
  const {
    setStopId,
    stopId,
    setInvalidStopId,
    invalidStopId,
    searchParams,
    setSearchParams,
  } = useDepartureDataContext() as AppContextInterface;
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    return () => {
      setInvalidStopId(false);
    };
  }, []);

  useEffect(() => {
    const stopIdParam = searchParams.get("stopId");
    if (stopIdParam) {
      setInputValue(stopIdParam);
      setStopId(stopIdParam);
    } else {
      setInputValue("");
      setStopId(-1);
    }
  }, [searchParams]);

  const handleKeyPress: EventHandler<KeyboardEvent<HTMLInputElement>> = (
    event
  ) => {
    const value = (event.target as HTMLInputElement).value;
    setInvalidStopId(false);
    setInputValue(value);
    if (event.key === "Enter") {
      setStopId((event.target as HTMLInputElement).value);
      setSearchParams({ stopId: value });
    }
  };

  const handleSearchButtonClick = () => {
    setStopId(inputValue);
    setSearchParams({ stopId: inputValue });
  };

  return (
    <StyledFormContainer
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      data-testid="search-form"
    >
      <Grid item xs={6}>
        <StyledTextField
          type="number"
          InputProps={{
            inputProps: { min: 0 },
          }}
          id="filled-basic"
          label="Stop Id"
          variant="standard"
          onKeyDown={handleKeyPress}
          onChange={(event) => setInputValue(event.target.value)}
          value={inputValue}
          data-testid="search-input"
        />
        <IconButton
          type="button"
          aria-label="search"
          onClick={handleSearchButtonClick}
          data-testid="search-button"
        >
          <SearchIcon />
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        {invalidStopId && (
          <Alert
            severity="error"
            data-testid="invalid-stop-id-alert"
          >{`Stop id #${stopId} doesn't exist.`}</Alert>
        )}
      </Grid>
    </StyledFormContainer>
  );
}

export default StopIdSearchInput;
