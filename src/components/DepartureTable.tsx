import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import { useTheme } from "@mui/material/styles";

import { Departure } from "../types/Departure";
import { NextTripResult } from "../types/NextTripResult";

interface Props {
  nextTrips: NextTripResult | undefined;
}
const DepartureTable = ({ nextTrips }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader aria-label="departure table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={isMobile ? 2 : 1}>
              <Typography sx={{ fontSize: isMobile ? 14 : 16 }}>
                Stop Name:{" "}
                <span data-testid="stop-name-header">
                  {nextTrips ? nextTrips.stops[0].description : "--"}
                </span>
              </Typography>
            </TableCell>
            <TableCell align="right" colSpan={isMobile ? 1 : 2}>
              <Typography noWrap sx={{ fontSize: isMobile ? 14 : 16 }}>
                Stop #:{" "}
                <span data-testid="stop-id-header">
                  {nextTrips ? nextTrips.stops[0].stop_id : "--"}
                </span>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ top: 57 }}>Destination</TableCell>
            <TableCell style={{ top: 57 }} align="left">
              Route
            </TableCell>
            <TableCell style={{ top: 57 }} align="right">
              Depart Time
            </TableCell>
          </TableRow>
        </TableHead>
        {nextTrips ? (
          <TableBody>
            {nextTrips.departures.map((departure: Departure) => (
              <TableRow
                key={departure.departure_time}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {departure.description}
                </TableCell>
                <TableCell component="th" scope="row">
                  {departure.route_short_name}
                </TableCell>
                <TableCell size="small" align="right" style={{ width: 80 }}>
                  {departure.actual && (
                    <DepartureBoardIcon
                      aria-label="live departure time"
                      className="blink"
                      color="info"
                      style={{ float: "left" }}
                    />
                  )}{" "}
                  {departure.departure_text}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                --
              </TableCell>
              <TableCell component="th" scope="row">
                --
              </TableCell>
              <TableCell align="right">--</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default DepartureTable;
