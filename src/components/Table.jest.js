import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table from "./Table";

const mockProjects = [
  { id: 1, "percentage.funded": 150, "amt.pledged": 10000 },
  { id: 2, "percentage.funded": 200, "amt.pledged": 20000 },
  { id: 3, "percentage.funded": 250, "amt.pledged": 30000 },
  { id: 4, "percentage.funded": 300, "amt.pledged": 40000 },
  { id: 5, "percentage.funded": 350, "amt.pledged": 50000 },
  { id: 6, "percentage.funded": 400, "amt.pledged": 60000 },
];

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn((cb) => cb()),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ projects: mockProjects }),
  })
);

describe("Table Component", () => {
  it("renders the table with correct headers", async () => {
    render(<Table />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("S.No.");
    expect(headers[1]).toHaveTextContent("Percentage Funded");
    expect(headers[2]).toHaveTextContent("Amount Pledged");
  });

  it("displays paginated data (5 records per page)", async () => {
    render(<Table />);
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(6);
  });

  it("shows correct data for the first page", async () => {
    render(<Table />);
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("1");
    expect(firstRow).toHaveTextContent("150");
    expect(firstRow).toHaveTextContent("10000");
  });

  it("handles pagination (next/previous buttons)", async () => {
    render(<Table />);
    const nextButton = screen.getByRole("button", { name: /Next Page/i });
    const prevButton = screen.getByRole("button", { name: /Previous Page/i });

    expect(prevButton).toBeDisabled();

    fireEvent.click(nextButton);
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("disables next/previous buttons at boundaries", async () => {
    render(<Table />);
    const nextButton = screen.getByRole("button", { name: /Next Page/i });
    const prevButton = screen.getByRole("button", { name: /Previous Page/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });

  it("renders a message when there are no projects", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({ projects: [] }) })
    );
    render(<Table />);
    expect(screen.getByText(/No projects available/i)).toBeInTheDocument();
  });
});
