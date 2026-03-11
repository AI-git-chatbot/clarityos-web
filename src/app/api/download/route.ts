import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

// Serves the ClarityOS-Tracker.zip as a direct download
export async function GET() {
    try {
        const filePath = join(process.cwd(), "public", "ClarityOS-Tracker.zip");
        const fileContent = readFileSync(filePath);

        return new NextResponse(fileContent, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": 'attachment; filename="ClarityOS-Tracker.zip"',
                "Content-Length": fileContent.length.toString(),
            },
        });
    } catch {
        return NextResponse.json({ error: "Tracker package not found" }, { status: 404 });
    }
}
