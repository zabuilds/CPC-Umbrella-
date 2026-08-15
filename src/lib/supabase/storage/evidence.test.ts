import { describe, expect, it } from "vitest";
import { evidenceStoragePath } from "./evidence";

describe("evidenceStoragePath", () => {
  it("builds the canonical property/inspection/evidence path", () => {
    expect(evidenceStoragePath("property-1", "inspection-2", "evidence-3", "photo.jpg")).toBe(
      "properties/property-1/inspections/inspection-2/evidence/evidence-3/photo.jpg",
    );
  });

  it("sanitizes filenames without changing ownership segments", () => {
    expect(evidenceStoragePath("property-1", "inspection-2", "evidence-3", "front door/photo 1.png")).toBe(
      "properties/property-1/inspections/inspection-2/evidence/evidence-3/front_door_photo_1.png",
    );
  });

  it("keeps different properties in different namespaces", () => {
    const first = evidenceStoragePath("property-1", "inspection-2", "evidence-3", "photo.jpg");
    const second = evidenceStoragePath("property-9", "inspection-2", "evidence-3", "photo.jpg");
    expect(first).not.toBe(second);
    expect(first.startsWith("properties/property-1/")).toBe(true);
    expect(second.startsWith("properties/property-9/")).toBe(true);
  });
});
