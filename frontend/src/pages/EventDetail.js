import { useRouteLoaderData, redirect } from "react-router-dom";

import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

import getAuthToken from "../util/auth";

function EventDetailPage() {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <EventItem event={event} />
      <EventsList events={events} />
    </>
  );
}

export default EventDetailPage;

// Belirli bir etkinliğin detaylarını API'dan çeker
async function loadEvent(id) {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: "Could not fetch details for selected event.",
      }),
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

// Tüm etkinliklerin listesini API'dan çeker
async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
      status: 500,
    });
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

// Route Loader Fonksiyonu
export async function loader({ request, params }) {
  const id = params.eventId; 

  return {
    event: await loadEvent(id),
    events: await loadEvents(),
  };
}

// Delete Request
export async function action({ params, request }) {
  const eventId = params.id;
  const token = getAuthToken();

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not delete event." }), {
      status: 500,
    });
  }
  return redirect("/events");
}
