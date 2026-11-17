import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import StorageBar from "@/components/knowledge/StorageBar.vue";
import { storageSummary } from "@/components/knowledge/storageSummary";

// FAC Cloud sends quota_mb -1 for a plan with no storage limit: the page said "0.00 MB / -1.00 MB"
// and "0.0 of -1 MB used" (UI test, 2026-11-17).
const UNLIMITED = { used_mb: 0.13, quota_mb: -1, usage_percentage: 0 };
const LIMITED = { used_mb: 2.5, quota_mb: 10, usage_percentage: 25 };

beforeAll(() => {
	window.__ = (s) => s;
});

describe("StorageBar with no storage limit", () => {
	it("says Unlimited in the top bar, never -1", () => {
		const text = mount(StorageBar, { props: { storage: UNLIMITED, compact: true } }).text();
		expect(text).toContain("Unlimited");
		expect(text).not.toContain("-1");
	});

	it("says Unlimited on the card, never -1", () => {
		const text = mount(StorageBar, { props: { storage: UNLIMITED } }).text();
		expect(text).toContain("Unlimited");
		expect(text).not.toContain("-1");
	});

	it("still shows the limit of a plan that has one", () => {
		const text = mount(StorageBar, { props: { storage: LIMITED, compact: true } }).text();
		expect(text).toContain("10.0 MB");
		expect(text).not.toContain("Unlimited");
	});
});

describe("storageSummary", () => {
	it("gives the limit of a plan that has one", () => {
		expect(storageSummary(3, LIMITED)).toBe("3 documents · 2.5 of 10 MB used");
	});

	it("names no limit when there is none", () => {
		const text = storageSummary(1, UNLIMITED);
		expect(text).toBe("1 document · 0.1 MB used · Unlimited");
		expect(text).not.toContain("-1");
	});

	it("falls back to the default limit before storage has loaded", () => {
		expect(storageSummary(0, null)).toBe("0 documents · 0.0 of 10 MB used");
	});
});
