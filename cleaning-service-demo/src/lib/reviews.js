// Canonical review helpers — both the public review module and the Admin
// Reviews screen read src/content/reviews.json through this file so the
// aggregate rating, distribution, and per-review presentation never drift
// between the two surfaces.
import reviewsData from "@/content/reviews.json";
import { getDemoClientById } from "@/data/demoClients";

export const reviews = reviewsData;

export function getReviewerInitial(name) {
  const trimmed = String(name || "").trim();
  return trimmed ? trimmed[0].toUpperCase() : "?";
}

export function getReviewClient(review) {
  return review.clientId ? getDemoClientById(review.clientId) : null;
}

export function formatRelativeDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  const now = new Date("2026-09-18T12:00:00");
  const diffMs = now - date;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths <= 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.round(diffMonths / 12);
  return diffYears <= 1 ? "1 year ago" : `${diffYears} years ago`;
}

export function getReviewSummary(list = reviews) {
  const count = list.length;
  const sum = list.reduce((total, review) => total + Number(review.rating || 0), 0);
  const average = count ? sum / count : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const starCount = list.filter((review) => Number(review.rating) === stars).length;
    return {
      stars,
      count: starCount,
      percent: count ? Math.round((starCount / count) * 100) : 0,
    };
  });

  return {
    count,
    average: Math.round(average * 10) / 10,
    distribution,
  };
}
