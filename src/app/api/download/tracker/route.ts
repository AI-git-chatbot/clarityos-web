import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

// Serves the standalone tracker.py file as a download
export async function GET() {
    try {
        // Read the standalone tracker script
        const filePath = join(process.cwd(), "public", "tracker.py");
        const fileContent = readFileSync(filePath, "utf-8");

        return new NextResponse(fileContent, {
            status: 200,
            headers: {
                "Content-Type": "text/x-python",
                "Content-Disposition": 'attachment; filename="tracker.py"',
            },
        });
    } catch {
        return NextResponse.json({ error: "Tracker file not found" }, { status: 404 });
    }
}
