import CreativeTable from "@/components/custom-ui/reusable/CreativeTable";


export default function CreativesPage() {
    return (
        <main className="flex w-full h-dvh items-center justify-center">
            {/* duman maedit sa table duman ma fetch... outlet lang ini */}
            <CreativeTable />
        </main>
    );
}

