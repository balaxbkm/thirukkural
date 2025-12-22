import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const size = {
    width: 512,
    height: 512,
};
export const contentType = "image/png";

// Image generation
export default async function Icon() {
    try {
        const filePath = path.join(process.cwd(), "public/valluvar-logo-v2.jpg");
        const file = await fs.readFile(filePath);
        const base64 = `data:image/jpeg;base64,${file.toString("base64")}`;

        return new ImageResponse(
            (
                // ImageResponse JSX element
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        overflow: "hidden",
                        backgroundColor: 'transparent',
                    }}
                >
                    <img
                        src={base64}
                        alt="Icon"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            ),
            // ImageResponse options
            {
                ...size,
            }
        );
    } catch (e) {
        // Fallback if image load fails
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 256,
                        background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        borderRadius: '50%',
                    }}
                >
                    T
                </div>
            ),
            { ...size }
        );
    }
}
