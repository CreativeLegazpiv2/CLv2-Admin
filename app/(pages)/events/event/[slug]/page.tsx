import { useRouter } from "next/router";

export default function EventPage() {
  const router = useRouter();
  const { id, title, desc, location } = router.query;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Title:</strong> {title}</p>
      <p><strong>Description:</strong> {desc}</p>
      <p><strong>Location:</strong> {location}</p>
    </div>
  );
}
