"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAvailability } from "@/app/lib/features/avalibility/avalibilityThunk";
import { toast } from "react-toastify";
import { supabase } from "@/app/lib/supabaseClient";

export default function AvailabilityManager() {
  const dispatch = useDispatch();
  const { data: bookings } = useSelector((state) => state.availability);
  const [openView, setOpenView] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [reason, setReason] = useState("");

  const roomId = "your-room-id"; // TODO: Replace with real dynamic roomId

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  const handleEventClick = (info) => {
    if (info.event.title === "Blocked") {
      setSelectedEvent(info.event);
      setOpenView(true);
    }
  };

  const handleSelectDates = (info) => {
    setSelectedRange({ start: info.start, end: info.end });
    setOpenBlock(true);
  };

  const handleBlockDates = async () => {
    if (!selectedRange) return;

    const { error } = await supabase.from("bookings").insert([
      {
        room_id: roomId,
        user_id: null,
        check_in_date: selectedRange.start.toISOString(),
        check_out_date: selectedRange.end.toISOString(),
        status: "blocked",
        reason: reason,
      },
    ]);

    if (error) {
      console.error("Failed to block dates:", error.message);
      toast.error("Failed to block dates");
    } else {
      setOpenBlock(false);
      setReason("");
      dispatch(fetchAvailability());
      toast.success("Dates blocked successfully!");
    }
  };

  const events = bookings.map((booking) => ({
    title: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    start: booking.check_in_date,
    end: booking.check_out_date,
    color:
      booking.status === "blocked"
        ? "#ef4444"
        : booking.status === "reserved"
        ? "#3b82f6"
        : "#10b981",
  }));

  return (
    <>
      <Card className="p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Availability Management</h2>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          dayMaxEventRows={true}
          editable={false}
          selectable={true}
          selectMirror={true}
          eventDisplay="block"
          eventClick={handleEventClick}
          select={handleSelectDates}
        />
      </Card>

      {/* View Blocked Dates Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Blocked Dates</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>
              Blocked from <strong>{selectedEvent?.startStr}</strong> to{" "}
              <strong>{selectedEvent?.endStr}</strong>.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block New Dates Dialog */}
      <Dialog open={openBlock} onOpenChange={setOpenBlock}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Block Dates</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">Selected Dates:</p>
              <p className="font-medium">
                {selectedRange?.start.toDateString()} →{" "}
                {selectedRange?.end.toDateString()}
              </p>
            </div>

            <Input
              placeholder="Reason for blocking (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <Button
              onClick={handleBlockDates}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              Block Dates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
