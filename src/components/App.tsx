import React, { useEffect, useState } from "react";

import { Box, Typography, Tabs, Tab, styled } from "@mui/material";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useQuery } from "react-query";

import "../App.css";
import DepartureTable from "./DepartureTable";
import Form from "./Form";
import {
  AppContextInterface,
  useDepartureDataContext,
} from "../context/DepartureDataContext";
import StopIdSearchInput from "./StopIdSearchInput";
import { getNextTrips, getStop } from "../api";
import { NextTripResult } from "../types/NextTripResult";
import TabPanel from "./TabPanel";

const StyledBox = styled(Box)`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px #00000033;

  ${({ theme }) => `${theme.breakpoints.down("sm")} {
    padding: 16px;
  }`}

  ${({ theme }) => `${theme.breakpoints.up("md")} {
    padding: 50px;
    max-width: 700px;
    margin: 50px auto;
  }`}
`;

function App() {
  const [activeTab, setActiveTab] = useState("/");
  const location = useLocation();

  const {
    stopId,
    selectedRoute,
    selectedDirection,
    selectedPlace,
    setInvalidStopId,
  } = useDepartureDataContext() as AppContextInterface;
  const { data: nextTripsByStopId } = useQuery<NextTripResult>(
    ["stopId", stopId],
    async () => await getStop(stopId),
    {
      onError: () => {
        setInvalidStopId(true);
      },
      retry: false,
      enabled: stopId >= 0,
      refetchInterval: 300000,
    }
  );

  const { data: nextTrips } = useQuery<NextTripResult>(
    ["stops", selectedRoute, selectedDirection, selectedPlace],
    async () =>
      await getNextTrips(selectedRoute, selectedDirection, selectedPlace),
    {
      retry: false,
      enabled:
        selectedRoute !== "default" &&
        selectedDirection > -1 &&
        selectedPlace !== "default",
      refetchInterval: 30000,
    }
  );

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleTabChange = (event: React.SyntheticEvent, tabRoute: string) => {
    setActiveTab(tabRoute);
  };

  return (
    <StyledBox>
      <Box paddingBottom={5} sx={{ textAlign: "center" }}>
        <DirectionsSubwayIcon fontSize="large" />
        <Typography variant="h6" textAlign="center">
          Minneapolis Metro Transit Real Time Departures
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            value="/"
            label="Search By Route"
            component={Link}
            to="/"
            {...a11yProps(0)}
            data-testid="tab-1"
          />
          <Tab
            value="/byStopId"
            label="Search By Stop Id"
            component={Link}
            to="/byStopId"
            {...a11yProps(1)}
            data-testid="tab-2"
          />
        </Tabs>
      </Box>
      <Routes>
        <Route
          path="/"
          element={
            <TabPanel value={activeTab} index={0}>
              <Form />
            </TabPanel>
          }
        />
        <Route
          path="/byStopId"
          element={
            <TabPanel value={activeTab} index={1}>
              <StopIdSearchInput />
            </TabPanel>
          }
        />
      </Routes>
      <DepartureTable
        nextTrips={activeTab === "/" ? nextTrips : nextTripsByStopId}
      />{" "}
    </StyledBox>
  );
}

export default App;
