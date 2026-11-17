import { isUnlimitedQuota } from "@/composables/useFormatters";

/** The quota the page assumes before storage_info has answered. */
const DEFAULT_QUOTA_MB = 10;

/**
 * The Knowledge Base subtitle: "3 documents · 2.5 of 10 MB used", or "… · 2.5 MB used · Unlimited" for a
 * plan with no storage limit (quota_mb -1 from FAC Cloud). storage_info returns
 * { used_mb, quota_mb, usage_percentage }; quota_mb is the limit.
 */
export function storageSummary(count, storage) {
	const docWord = count === 1 ? "document" : "documents";
	const used = storage ? (storage.used_mb ?? 0).toFixed(1) : "0.0";
	const quota = storage ? (storage.quota_mb ?? DEFAULT_QUOTA_MB) : DEFAULT_QUOTA_MB;
	if (isUnlimitedQuota(quota)) {
		const unlimited = window.__ ? window.__("Unlimited") : "Unlimited";
		return `${count} ${docWord} · ${used} MB used · ${unlimited}`;
	}
	return `${count} ${docWord} · ${used} of ${quota} MB used`;
}
