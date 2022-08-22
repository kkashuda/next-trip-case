import React from "react";
import {
  render,
  screen,
  waitFor,
  cleanup,
  within,
} from "@testing-library/react";
import Form from "../components/Form";
import { Router } from "react-router-dom";
import DepartureDataContext from "../context/DepartureDataContext";
import { QueryClientProvider, QueryClient } from "react-query";
import userEvent from "@testing-library/user-event";
import * as apiModule from "../api";
import { mockDirectionData, mockStopsData, mockRouteData } from "./mockData";
import { InitialEntry, createMemoryHistory } from "history";

afterEach(jest.clearAllMocks);

const customRender = (
  ui: React.ReactElement<any>,
  { providerProps, ...renderOptions }: { providerProps: any },
  initialEntries: InitialEntry[]
) => {
  const history = createMemoryHistory();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <Router navigator={history} location={initialEntries[0]}>
          <DepartureDataContext {...providerProps}>{ui}</DepartureDataContext>
        </Router>
      </QueryClientProvider>,
      renderOptions
    ),
    history,
  };
};

const queryClient = new QueryClient();
const providerProps = {};

const getMaterialUiSelectListBox = async (selectElement: any) => {
  const button = await within(selectElement).findByRole("button");
  userEvent.click(button);
  return await within(document.body).findByRole("listbox");
};

const selectMaterialUiSelectOption = async (
  selectElement: any,
  optionText: string
) => {
  const listBox = await getMaterialUiSelectListBox(selectElement);
  const listItem = await within(listBox).findByText(optionText);

  userEvent.click(listItem);
};

jest.mock("../api");
test("selecting route sets a value and enables directions input", async () => {
  const routesSpy = jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  const directionsSpy = jest
    .spyOn(apiModule, "getDirections")
    .mockImplementation(() => Promise.resolve(mockDirectionData));

  customRender(
    <Form />,
    {
      providerProps,
    },
    ["/"]
  );

  await waitFor(async () =>
    expect(await screen.findByTestId("route-input")).toBeEnabled()
  );

  expect(routesSpy).toHaveBeenCalled();
  const routeSelect = screen.getByTestId("route-select");

  await waitFor(async () => {
    await selectMaterialUiSelectOption(routeSelect, "METRO Blue Line");
    return expect(await screen.findByTestId("direction-input")).toBeEnabled();
  });

  expect(await screen.findByTestId("route-input")).toHaveValue("901");
  expect(await screen.findByTestId("direction-select")).toBeEnabled();
  expect(routesSpy).toHaveBeenCalled();
  expect(directionsSpy).toHaveBeenCalled();

  cleanup();
});

test("selecting direction sets a value and enables stops input", async () => {
  jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  const directionsSpy = jest
    .spyOn(apiModule, "getDirections")
    .mockImplementation(() => Promise.resolve(mockDirectionData));

  const stopsSpy = jest
    .spyOn(apiModule, "getStops")
    .mockImplementation(() => Promise.resolve(mockStopsData));

  customRender(
    <Form />,
    {
      providerProps,
    },
    ["/?route=901"]
  );

  expect(directionsSpy).toHaveBeenCalled();

  await waitFor(async () =>
    expect(await screen.findByTestId("direction-input")).toBeEnabled()
  );

  const directionSelect = screen.getByTestId("direction-select");

  await waitFor(async () => {
    await selectMaterialUiSelectOption(directionSelect, "Northbound");
    return expect(await screen.findByTestId("stop-input")).toBeEnabled();
  });

  expect(await screen.findByTestId("direction-input")).toHaveValue("0");
  expect(await screen.findByTestId("stop-input")).toBeEnabled();
  expect(stopsSpy).toHaveBeenCalled();

  cleanup();
});

test("selecting stop sets a value", async () => {
  jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  jest
    .spyOn(apiModule, "getDirections")
    .mockImplementation(() => Promise.resolve(mockDirectionData));

  const stopsSpy = jest
    .spyOn(apiModule, "getStops")
    .mockImplementation(() => Promise.resolve(mockStopsData));

  customRender(
    <Form />,
    {
      providerProps,
    },
    ["/?route=901&direction=0"]
  );

  expect(stopsSpy).toHaveBeenCalled();

  await waitFor(async () =>
    expect(await screen.findByTestId("stop-input")).toBeEnabled()
  );

  const stopSelect = await screen.findByTestId("stop-select");

  await waitFor(async () => {
    await selectMaterialUiSelectOption(
      stopSelect,
      "MSP Airport Terminal 2 - Humphrey Station"
    );
    return expect(await screen.findByTestId("stop-input")).toBeEnabled();
  });

  expect(await screen.findByTestId("stop-input")).toHaveValue("HHTE");

  cleanup();
});

test("unsetting direction value disabled stop input", async () => {
  jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  const directionsSpy = jest
    .spyOn(apiModule, "getDirections")
    .mockImplementation(() => Promise.resolve(mockDirectionData));

  const stopsSpy = jest
    .spyOn(apiModule, "getStops")
    .mockImplementation(() => Promise.resolve(mockStopsData));

  customRender(
    <Form />,
    {
      providerProps,
    },
    ["/?route=901"]
  );

  expect(directionsSpy).toHaveBeenCalled();

  await waitFor(async () =>
    expect(await screen.findByTestId("direction-input")).toBeEnabled()
  );

  const directionSelect = screen.getByTestId("direction-select");

  await waitFor(async () => {
    await selectMaterialUiSelectOption(directionSelect, "Northbound");
    return expect(await screen.findByTestId("stop-input")).toBeEnabled();
  });

  expect(await screen.findByTestId("direction-input")).toHaveValue("0");
  expect(await screen.findByTestId("stop-input")).toBeEnabled();

  await waitFor(async () =>
    expect(await screen.findByTestId("direction-input")).toBeEnabled()
  );

  await waitFor(async () => {
    await selectMaterialUiSelectOption(directionSelect, "Select direction...");
    return expect(await screen.findByTestId("stop-input")).not.toBeEnabled();
  });

  expect(directionsSpy).toHaveBeenCalled();

  cleanup();
});

test("unsetting stop value clears out the selected stop", async () => {
  jest
    .spyOn(apiModule, "getRoutes")
    .mockImplementation(() => Promise.resolve(mockRouteData));

  const directionsSpy = jest
    .spyOn(apiModule, "getDirections")
    .mockImplementation(() => Promise.resolve(mockDirectionData));

  const stopsSpy = jest
    .spyOn(apiModule, "getStops")
    .mockImplementation(() => Promise.resolve(mockStopsData));

  const { history } = customRender(
    <Form />,
    {
      providerProps,
    },
    ["/?route=902&direction=0&stop=HHTE"]
  );

  await waitFor(async () =>
    expect(await screen.findByTestId("stop-input")).toBeEnabled()
  );

  const stopSelect = screen.getByTestId("stop-select");

  await waitFor(async () => {
    await selectMaterialUiSelectOption(stopSelect, "Select stop...");
    return expect(await screen.findByTestId("stop-input")).toBeEnabled();
  });

  expect(history.location.search).toBe("?route=902&direction=0");

  cleanup();
});
