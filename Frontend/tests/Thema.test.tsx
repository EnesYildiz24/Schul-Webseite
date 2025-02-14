import { render, screen } from "@testing-library/react";
import { themen } from "../src/backend/testdata";
import { Thema } from "../src/components/Thema";

test("Daten werden angezeigt", () => {
  render(<Thema thema={themen[0]} />);
  const elementsTitel = screen.getAllByText(themen[0].titel, { exact: false });
  expect(elementsTitel.length).toBeGreaterThan(0);
});

test("Falsche Daten", () => {
  render(<Thema thema={themen[0]} />);

  const quatshc = screen.queryByText("quatsch");
  expect(quatshc).not.toBeInTheDocument();
});
