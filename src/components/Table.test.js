import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./Table";

const mockData = [
  { id: 1, funded: "150%", pledged: "10000" },
  { id: 2, funded: "100%", pledged: "8000" },
  { id: 3, funded: "90%", pledged: "7000" },
  { id: 4, funded: "80%", pledged: "6000" },
  { id: 5, funded: "70%", pledged: "5000" },
  { id: 6, funded: "60%", pledged: "4000" },
];

describe("Table Component", () => {
  test("renders the table with correct headers", () => {
    render(<Table data={mockData} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("S.No.")).toBeInTheDocument();
    expect(screen.getByText("Percentage Funded")).toBeInTheDocument();
    expect(screen.getByText("Amount Pledged")).toBeInTheDocument();
  });

  test("displays the first page of data (5 records)", () => {
    render(<Table data={mockData} itemsPerPage={5} />);

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(6);

    expect(rows[1]).toHaveTextContent("1");
    expect(rows[1]).toHaveTextContent("150%");
    expect(rows[1]).toHaveTextContent("10000");
  });

  test("handles pagination (next and previous buttons)", () => {
    render(<Table data={mockData} itemsPerPage={5} />);

    const nextButton = screen.getByRole("button", { name: /next page/i });
    const prevButton = screen.getByRole("button", { name: /previous page/i });

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(prevButton).toBeDisabled();

    fireEvent.click(nextButton);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test("renders a message when there are no projects", () => {
    render(<Table data={[]} />);

    expect(screen.getByText(/no projects available/i)).toBeInTheDocument();
  });
});
