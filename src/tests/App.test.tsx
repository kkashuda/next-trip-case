import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import App from "../components/App";
import { MemoryRouter } from "react-router-dom";
import DepartureDataContext from "../context/DepartureDataContext";
import { QueryClientProvider, QueryClient, setLogger } from "react-query";
import * as apiModule from "../api";
import {
  axiosError,
  mockDirectionData,
  mockNextRoutesData,
  mockPlaceData,
  mockRouteData,
} from "./mockData";
import { InitialEntry } from "history";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";

afterEach(cleanup);

const customRender = (
  ui: React.ReactElement<any>,
  { providerProps, ...renderOptions }: { providerProps: any },
  initialEntries: InitialEntry[]
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <DepartureDataContext {...providerProps}>{ui}</DepartureDataContext>
      </MemoryRouter>
    </QueryClientProvider>,
    renderOptions
  );
};

const queryClient = new QueryClient();
const providerProps = {};

jest.mock("../api");

test("renders the departure form on initial load", async () => {
  jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  customRender(<App />, { providerProps }, [""]);

  await waitFor(async () =>
    expect(await screen.findByTestId("route-select")).toBeEnabled()
  );

  const departureForm = await screen.findByTestId("departure-form");
  expect(departureForm).toBeTruthy();
  cleanup();
});

test("expect getNextTrips to be called when a route, direction and place is provided", async () => {
  jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  jest
    .spyOn(apiModule, "getDirections")
    .mockImplementation(() => Promise.resolve(mockDirectionData));

  jest
    .spyOn(apiModule, "getPlaces")
    .mockImplementation(() => Promise.resolve(mockPlaceData));

  const nextTripsSpy = jest
    .spyOn(apiModule, "getNextTrips")
    .mockImplementation(() => Promise.resolve(mockNextRoutesData));

  customRender(
    <App />,
    {
      providerProps,
    },
    ["/?route=901&direction=0&stop=HHTE"]
  );

  expect(nextTripsSpy).toHaveBeenCalledWith("901", "0", "HHTE");

  await waitFor(async () =>
    expect(await screen.findByTestId("stop-input")).toBeEnabled()
  );

  expect(await screen.findByTestId("stop-input")).toHaveValue("HHTE");
});

test("renders the search by stop id input when clicking the second tab", async () => {
  jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  customRender(<App />, { providerProps }, [""]);

  await waitFor(async () =>
    expect(await screen.findByTestId("route-select")).toBeEnabled()
  );

  const tab2 = screen.getByTestId("tab-2");
  await act(() => {
    fireEvent.click(tab2);
  });

  const stopIdSearchInput = screen.getByTestId("search-form");
  expect(stopIdSearchInput).toBeTruthy();
  cleanup();
});

test("expect getStop to be called with the provided stop id", async () => {
  const nextTripsSpy = jest
    .spyOn(apiModule, "getStop")
    .mockImplementation(() => Promise.resolve(mockNextRoutesData));

  customRender(<App />, { providerProps }, ["/byStopId?stopId=51434"]);

  const stopIdSearchInput = screen.getByTestId("search-form");
  expect(stopIdSearchInput).toBeTruthy();

  expect(nextTripsSpy).toHaveBeenCalledWith("51434");
  cleanup();
});

test("expect getStop to be called with the provided stop id when the search button is clicked", async () => {
  const nextTripsSpy = jest
    .spyOn(apiModule, "getStop")
    .mockImplementation(() => Promise.resolve(mockNextRoutesData));

  customRender(<App />, { providerProps }, ["/byStopId"]);

  const stopIdSearchInput = screen.getByTestId("search-form");
  expect(stopIdSearchInput).toBeTruthy();

  const field = screen.getByLabelText("Stop Id");
  expect(field).toBeInTheDocument();

  await act(() => {
    fireEvent.change(field, { target: { value: "51434" } });
  });

  expect(field).toHaveValue(51434);

  const searchBtn = screen.getByTestId("search-button");

  await waitFor(async () => {
    fireEvent.click(searchBtn);
    return await expect(screen.getByTestId("stop-id-header")).toHaveTextContent(
      "51434"
    );
  });

  expect(nextTripsSpy).toHaveBeenCalledWith("51434");
  cleanup();
});

test("expect getStop to be called with the provided stop id when the 'enter' key is pressed", async () => {
  const nextTripsSpy = jest
    .spyOn(apiModule, "getStop")
    .mockImplementation(() => Promise.resolve(mockNextRoutesData));

  customRender(<App />, { providerProps }, ["/byStopId"]);

  const stopIdSearchInput = screen.getByTestId("search-form");
  expect(stopIdSearchInput).toBeTruthy();

  const field = screen.getByLabelText("Stop Id");
  expect(field).toBeInTheDocument();

  userEvent.type(field, "51434{enter}");

  expect(field).toHaveValue(51434);

  await waitFor(async () => {
    return await expect(screen.getByTestId("stop-id-header")).toHaveTextContent(
      "51434"
    );
  });

  expect(nextTripsSpy).toHaveBeenCalledWith("51434");
  cleanup();
});

test("expect getStop to be called with the provided stop id when the 'enter' key is pressed", async () => {
  // suppress react-query logger to keep output clean
  setLogger({
    log: () => {},
    warn: () => {},
    error: () => {},
  });

  const nextTripsSpy = jest
    .spyOn(apiModule, "getStop")
    .mockImplementation(() => {
      throw axiosError;
    });

  customRender(<App />, { providerProps }, ["/byStopId"]);

  const stopIdSearchInput = screen.getByTestId("search-form");
  expect(stopIdSearchInput).toBeTruthy();

  const field = screen.getByLabelText("Stop Id");
  expect(field).toBeInTheDocument();

  userEvent.type(field, "11111{enter}");

  expect(field).toHaveValue(11111);

  await waitFor(async () => {
    return await expect(
      screen.getByTestId("invalid-stop-id-alert")
    ).toHaveTextContent("Stop id #11111 doesn't exist.");
  });

  expect(nextTripsSpy).toHaveBeenCalledWith("11111");
  cleanup();
});
