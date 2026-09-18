import React, { useMemo, useState } from "react";
import { Star, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import { reviews, getReviewSummary, getReviewClient, formatRelativeDate } from "@/lib/reviews";

function Stars({ rating, size = "w-4 h-4" }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`${size} ${index < Number(rating || 0) ? "fill-warning text-warning" : "text-muted"}`} />
      ))}
    </span>
  );
}

export default function ReviewsView() {
  const summary = useMemo(() => getReviewSummary(reviews), []);
  // Locally-scoped demo interaction only — "featuring" a review doesn't
  // persist or call anything, it just toggles a badge in this session's
  // component state, same as any other frontend-only demo control here.
  const [featured, setFeatured] = useState(() => new Set());

  const toggleFeatured = (id) => {
    setFeatured((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortedReviews = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Reputation"
        title="Reviews"
        description="Customer feedback pulled from the same review data shown on the public site."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),minmax(0,1.6fr)]">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <p className="font-display text-4xl font-bold text-foreground leading-none">{summary.average.toFixed(1)}</p>
              <Stars rating={Math.round(summary.average)} size="w-5 h-5" />
              <p className="text-sm text-muted-foreground mt-1.5">Based on {summary.count} reviews</p>
            </div>
            <div className="space-y-1.5">
              {summary.distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-muted-foreground">{row.stars} star</span>
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-warning" style={{ width: `${row.percent}%` }} />
                  </div>
                  <span className="w-8 text-right text-muted-foreground tabular-nums">{row.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            icon={Sparkles}
            label="Featured this session"
            value={featured.size}
            sublabel="Local demo toggle — resets on reload"
          />
          <MetricCard
            label="5-star share"
            value={`${summary.distribution.find((d) => d.stars === 5)?.percent || 0}%`}
            sublabel="Of all reviews"
            tone="success"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sortedReviews.map((review) => {
          const client = getReviewClient(review);
          const isFeatured = featured.has(review.id);
          return (
            <Card key={review.id} className={isFeatured ? "border-primary/40" : undefined}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{review.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {review.service} · {client ? "Verified client" : "Public review"} · {review.source}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Stars rating={review.rating} />
                    <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeDate(review.date)}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.body}</p>
                <div className="flex items-center justify-between pt-1">
                  {isFeatured ? <Badge variant="default">Featured</Badge> : <span />}
                  <Button
                    variant={isFeatured ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => toggleFeatured(review.id)}
                  >
                    {isFeatured ? "Unfeature" : "Feature review"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
