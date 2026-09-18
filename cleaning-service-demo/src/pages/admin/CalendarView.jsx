import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enUS } from "date-fns/locale";
import { CalendarDays, MapPin, NotebookText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import CalendarExportButtons from "@/components/calendar/CalendarExportButtons";
import { demoCalendarEvents } from "@/data/demoCalendarEvents";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

// Static demo "now" — this portfolio demo is pinned to 2026-09-18, never Date.now().
const TODAY = new Date("2026-09-18T08:00:00");

// Hex equivalents of the design-token HSL values (index.css --primary/--success/
// --warning/--destructive/navy-700), since react-big-calendar's inline event
// styles need resolved colors rather than Tailwind classes.
const STATUS_COLORS = {
  pending: "#AC7015",
  confirmed: "#277EB4",
  completed: "#2C6D4F",
  cancelled: "#B93D31",
  blocked: "#1A4362",
};

function money(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function CalendarView() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = useMemo(
    () =>
      demoCalendarEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      })),
    []
  );

  const upcoming = useMemo(
    () =>
      events
        .filter((event) => event.start >= TODAY)
        .sort((a, b) => a.start - b.start)
        .slice(0, 6),
    [events]
  );

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Operations"
        title="Calendar"
        description="Schedule populated from local sample appointments plus internal ops blocks."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="cp-calendar h-[620px]">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                views={["month", "week", "day", "agenda"]}
                onSelectEvent={setSelectedEvent}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: STATUS_COLORS[event.status] || STATUS_COLORS.confirmed,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "2px 6px",
                  },
                })}
              />
            </div>
            <style>{`
              .cp-calendar .rbc-toolbar { margin-bottom: 12px; gap: 8px; flex-wrap: wrap; }
              .cp-calendar .rbc-toolbar button {
                color: hsl(var(--foreground));
                border: 1px solid hsl(var(--border));
                border-radius: calc(var(--radius) - 3px);
                background: hsl(var(--card));
                font-size: 0.8125rem;
                padding: 0.375rem 0.75rem;
              }
              .cp-calendar .rbc-toolbar button:hover { background: hsl(var(--accent)); }
              .cp-calendar .rbc-toolbar button.rbc-active {
                background: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
                border-color: hsl(var(--primary));
              }
              .cp-calendar .rbc-toolbar-label { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 600; color: hsl(var(--foreground)); }
              .cp-calendar .rbc-header {
                background: hsl(var(--muted));
                color: hsl(var(--muted-foreground));
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.02em;
                padding: 8px 4px;
                border-color: hsl(var(--border));
              }
              .cp-calendar .rbc-month-view, .cp-calendar .rbc-time-view, .cp-calendar .rbc-agenda-view table.rbc-agenda-table {
                border-color: hsl(var(--border));
                border-radius: calc(var(--radius) - 3px);
                overflow: hidden;
              }
              .cp-calendar .rbc-day-bg + .rbc-day-bg, .cp-calendar .rbc-header + .rbc-header,
              .cp-calendar .rbc-time-content > * + * > *, .cp-calendar .rbc-timeslot-group,
              .cp-calendar .rbc-month-row + .rbc-month-row, .cp-calendar .rbc-day-slot .rbc-time-slot {
                border-color: hsl(var(--border));
              }
              .cp-calendar .rbc-today { background: hsl(var(--accent)); }
              .cp-calendar .rbc-off-range-bg { background: hsl(var(--muted)); }
              .cp-calendar .rbc-current-time-indicator { background: hsl(var(--primary)); height: 2px; }
              .cp-calendar .rbc-agenda-table thead > tr > th {
                color: hsl(var(--muted-foreground));
                border-color: hsl(var(--border));
                font-size: 0.75rem;
                text-transform: uppercase;
              }
              .cp-calendar .rbc-agenda-table tbody > tr > td { border-color: hsl(var(--border)); }
              .cp-calendar .rbc-event:focus { outline: 2px solid hsl(var(--ring)); }
              .cp-calendar .rbc-show-more { color: hsl(var(--primary)); font-weight: 600; }
            `}</style>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Upcoming jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing scheduled ahead.</p>
              ) : (
                upcoming.map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent ${
                      selectedEvent?.id === event.id ? "border-primary/50 bg-accent" : "border-border bg-muted/40"
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at{" "}
                      {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Event details</CardTitle>
              {!selectedEvent && <CardDescription>Select an event to view details.</CardDescription>}
            </CardHeader>
            {selectedEvent && (
              <CardContent className="space-y-3 text-sm pt-0">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Title</p>
                  <p className="font-medium text-foreground">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">When</p>
                  <p className="text-foreground">
                    {selectedEvent.start.toLocaleString()} –{" "}
                    {selectedEvent.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <p className="text-foreground">{selectedEvent.location || "Location on file"}</p>
                </div>
                {selectedEvent.notes && (
                  <div className="flex gap-2">
                    <NotebookText className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    <p className="text-muted-foreground">{selectedEvent.notes}</p>
                  </div>
                )}
                {selectedEvent.resource && (
                  <div className="rounded-lg bg-muted/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium text-foreground tabular-nums">
                        {money(selectedEvent.resource.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <StatusPill status={selectedEvent.resource.status} />
                    </div>
                  </div>
                )}
                <CalendarExportButtons
                  title={selectedEvent.title}
                  start={selectedEvent.start}
                  end={selectedEvent.end}
                  location={selectedEvent.location}
                  details={selectedEvent.notes}
                  uid={selectedEvent.id}
                  fileName={`cleanpro-${selectedEvent.id}.ics`}
                />
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
