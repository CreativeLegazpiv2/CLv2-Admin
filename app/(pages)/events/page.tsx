"use client"
import CreativeTable from "@/components/custom-ui/reusable/CreativeTable";
import EventsTable from "@/components/custom-ui/reusable/EventsTable";
import useAuthRedirect from "@/services/authGurad/authDirect";
import { ToastContainer } from "react-toastify";


export default function Eventspage() {
    useAuthRedirect();
    return (
        <main className="flex w-full h-full  items-center justify-center">
            {/* duman maedit sa table duman ma fetch... outlet lang ini */}
            <div className="w-full pt-[5dvh]">
            <EventsTable />
            </div>
        </main>
    );
}

