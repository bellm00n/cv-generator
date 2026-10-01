import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { MonthPicker } from "./MonthPicker";

describe("MonthPicker", () => {
  it("selects a month in the previous year and closes the popover", async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const screen = await render(
      <MonthPicker
        id="start-date"
        label="Start date"
        value="2024-05"
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Start date" });
    await expect.element(trigger).toHaveTextContent("May 2024");

    await trigger.click();
    await screen.getByRole("button", { name: "Previous year" }).click();
    await expect.element(screen.getByText("2023")).toBeVisible();

    await screen.getByRole("button", { name: "Mar" }).click();

    expect(onChange).toHaveBeenCalledExactlyOnceWith("2023-03");
    expect(onBlur).toHaveBeenCalledOnce();
    await expect
      .element(screen.getByRole("button", { name: "Previous year" }))
      .not.toBeInTheDocument();
  });
});
