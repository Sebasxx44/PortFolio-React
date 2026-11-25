import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CartAssembly, LaptopScreen } from "./StudioScreens";
import { exteriorTime, immersion, visualTime } from "./flowScenes";

import { duration, sceneAt } from "./studioTimeline";

describe("studio camera", () => {
  it("holds each device open during assembly and releases it between visits", () => {
    for (const [at, device] of [
      [0.18, "laptop"],
      [0.5, "monitor"],
      [0.77, "menu"],
    ] as const) {
      expect(immersion(at)).toEqual({ device, amount: 1 });
      expect(immersion(visualTime(at, true))?.device).toBe(device);
    }
    for (const at of [0.3, 0.6, 0.91]) expect(immersion(at)).toBeNull();
    let last = 0;
    for (let sample = 1; sample <= 1000; sample++) {
      const time = exteriorTime(sample / 1000);
      expect(time).toBeGreaterThanOrEqual(last);
      expect(time - last).toBeLessThan(0.006);
      last = time;
    }
    expect(last).toBe(1);
  });

  it("keeps each finished composition visible and crosses the network in short beats", () => {
    expect(duration).toBe(38);
    for (const [start, end, device] of [
      [6.35, 7.25, "laptop"],
      [17.15, 18.1, "monitor"],
      [27.95, 29, "menu"],
    ] as const) {
      const position = sceneAt(start);
      expect(sceneAt((start + end) / 2)).toBe(position);
      expect(sceneAt(end)).toBe(position);
      expect(immersion(position)).toEqual({ device, amount: 1 });
    }
    for (const [start, end] of [
      [8.15, 10.35],
      [19, 21.2],
    ]) {
      expect(end - start).toBeCloseTo(2.2);
      expect(immersion(sceneAt(start + 0.35))).toBeNull();
      expect(immersion(sceneAt(end - 0.35))).toBeNull();
      expect(sceneAt(start + 0.35)).toBeLessThan(sceneAt(end - 0.35));
    }
    let previous = 0;
    for (let tenth = 0; tenth <= duration * 10; tenth++) {
      const position = sceneAt(tenth / 10);
      expect(position).toBeGreaterThanOrEqual(previous);
      expect(position - previous).toBeLessThan(0.01);
      previous = position;
    }
    expect(previous).toBe(1);
  });

  it("reverses the quantity and subtotal together when scrolling back", () => {
    for (const [t, quantity, total] of [
      [0.493, "1", "$20.000"],
      [0.53, "2", "$40.000"],
      [0.493, "1", "$20.000"],
    ] as const) {
      const doc = new DOMParser().parseFromString(
        renderToStaticMarkup(createElement(CartAssembly, { t })),
        "text/html",
      );
      expect(doc.querySelector(".stepper b")?.textContent).toBe(quantity);
      expect(doc.querySelector(".cart-total strong")?.textContent).toBe(total);
    }
  });

  it("identifies releases and finished pages by name in every language", () => {
    for (const locale of ["es", "en", "pt"] as const) {
      for (const t of [0.94, 0.978, 1]) {
        const html = renderToStaticMarkup(
          createElement(LaptopScreen, { t, locale }),
        );
        const doc = new DOMParser().parseFromString(html, "text/html");
        expect(doc.querySelectorAll(".release-info strong")).toHaveLength(3);
        expect(
          doc.querySelector(".finished-screen .chrome-title")?.textContent,
        ).toMatch(/Salchiwarrior|Everest Cocktails|MilkShake Bogotá/);
        expect(doc.body.textContent).not.toMatch(/https?:|\.vercel\.app/i);
      }
    }
  });
});
