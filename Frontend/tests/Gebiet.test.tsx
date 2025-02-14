import { render, screen } from "@testing-library/react";
import { Gebiet } from "../src/components/Gebiet";
import { ErrorBoundary } from "react-error-boundary";
test("Falsche Gebietsdaten", () => {
  render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Gebiet />
    </ErrorBoundary>
  );
  

  const elementsName = screen.queryByText("wuatsci");
  expect(elementsName).not.toBeInTheDocument();
});
