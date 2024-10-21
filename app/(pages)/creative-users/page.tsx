import CreativeTable from "@/components/custom-ui/reusable/CreativeTable";


export default function CreativesPage() {
    return (
        <main className="flex w-full h-full  items-center justify-center">
            {/* duman maedit sa table duman ma fetch... outlet lang ini */}
            <div className="w-full pt-[5dvh]">
            <CreativeTable />
            </div>
        </main>
    );
}

