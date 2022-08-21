import {
  Select,
  SelectChangeEvent,
  MenuItem,
  Grid,
  styled,
} from "@mui/material";
import { useQuery } from "react-query";

import { Route } from "../types/Route";
import { getDirections, getStops, getRoutes } from "../api";
import { Direction } from "../types/Direction";
import { Place } from "../types/Place";
import {
  useDepartureDataContext,
  AppContextInterface,
} from "../context/DepartureDataContext";
import { useEffect } from "react";

const StyledSelect = styled(Select)`
  width: 100%;
`;

const StyledFormContainer = styled(Grid)`
  padding-bottom: 32px;
  padding-top: 32px;
`;

function Form() {
  const {
    setSelectedRoute,
    selectedRoute,
    selectedDirection,
    setSelectedDirection,
    selectedPlace,
    setSelectedPlace,
    setSearchParams,
    searchParams,
  } = useDepartureDataContext() as AppContextInterface;

  const { data: routes, isLoading: isLoadingRoutes } = useQuery<Route[]>(
    ["routes"],
    getRoutes
  );

  const { data: directions, isLoading: isLoadingDirections } = useQuery<
    Direction[]
  >(
    ["directions", selectedRoute],
    async () => await getDirections(selectedRoute),
    { retry: false, enabled: selectedRoute !== "default" }
  );

  const { data: stops, isLoading: isLoadingStops } = useQuery<Place[]>(
    ["stops", selectedRoute, selectedDirection],
    async () => await getStops(selectedRoute, selectedDirection),
    {
      retry: false,
      enabled: selectedRoute !== "default" && selectedDirection > -1,
    }
  );

  // populates form inputs when refreshing the page and interacting with the browser back/forward buttons
  useEffect(() => {
    const routeParam = searchParams.get("route");
    const directionParam = searchParams.get("direction");
    const stopParam = searchParams.get("stop");

    setSelectedRoute(routeParam ? routeParam : "default");
    setSelectedDirection(directionParam ? directionParam : -1);
    setSelectedPlace(stopParam ? stopParam : "default");
  }, [searchParams]);

  const handleRouteChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as string;
    setSearchParams({ route: event.target.value });

    setSelectedRoute(value);
    setSelectedDirection(-1);
    setSelectedPlace("default");
  };

  const handleDirectionChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as number;
    if (value > -1) {
      setSearchParams({ route: selectedRoute, direction: value.toString() });
    } else {
      setSearchParams({ route: selectedRoute });
    }

    setSelectedDirection(value);
    setSelectedPlace("default");
  };

  const handlePlaceChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as string;

    if (value !== "default") {
      setSearchParams({
        route: selectedRoute,
        direction: selectedDirection,
        stop: value,
      });
    } else {
      setSearchParams({ route: selectedRoute, direction: selectedDirection });
    }

    setSelectedPlace(value);
  };

  return (
    <StyledFormContainer
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      data-testid="departure-form"
    >
      <Grid item xs={12} md={4}>
        <StyledSelect
          onChange={handleRouteChange}
          value={!isLoadingRoutes ? selectedRoute : "default"}
          data-testid="route-select"
          inputProps={{
            name: "route",
            "data-testid": "route-input",
          }}
          disabled={isLoadingRoutes}
        >
          <MenuItem value="default">Select route...</MenuItem>
          {routes?.map((route: Route) => (
            <MenuItem value={route.route_id} key={route.route_id}>
              {route.route_label}
            </MenuItem>
          ))}
        </StyledSelect>
      </Grid>
      <Grid item xs={12} md={4}>
        <StyledSelect
          disabled={selectedRoute === "default" || isLoadingDirections}
          onChange={handleDirectionChange}
          value={!isLoadingDirections ? selectedDirection : -1}
          data-testid="direction-select"
          inputProps={{
            name: "direction",
            "data-testid": "direction-input",
          }}
        >
          <MenuItem value={-1}>Select direction...</MenuItem>
          {directions?.map((direction: Direction) => (
            <MenuItem
              value={direction.direction_id}
              key={direction.direction_id}
            >
              {direction.direction_name}
            </MenuItem>
          ))}
        </StyledSelect>
      </Grid>
      <Grid item xs={12} md={4}>
        <StyledSelect
          onChange={handlePlaceChange}
          value={!isLoadingStops ? selectedPlace : "default"}
          disabled={
            selectedRoute === "default" ||
            selectedDirection === -1 ||
            isLoadingStops
          }
          data-testid="stop-select"
          inputProps={{
            name: "stop",
            "data-testid": "stop-input",
          }}
        >
          <MenuItem value="default">Select stop...</MenuItem>
          {stops?.map((stop: Place) => (
            <MenuItem value={stop.place_code} key={stop.place_code}>
              {stop.description}
            </MenuItem>
          ))}
        </StyledSelect>
      </Grid>
    </StyledFormContainer>
  );
}

export default Form;
