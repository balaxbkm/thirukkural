"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface KolamItem {
    id: number;
    src: string;
    top: string;
    left: string;
    size: number;
    rotation: number;
    opacity: number;
}

const TOTAL_KOLAMS = 11;

// 10 distinct, widely-separated spatial anchor zones around margins and gutters
const SPATIAL_ZONES = [
    // Top corners and upper margins
    { minX: 4, maxX: 20, minY: 5, maxY: 16 },    // Zone 0: Top-Left
    { minX: 80, maxX: 94, minY: 5, maxY: 16 },   // Zone 1: Top-Right

    // Upper-mid sides
    { minX: 3, maxX: 18, minY: 22, maxY: 35 },   // Zone 2: Upper-Mid Left
    { minX: 82, maxX: 95, minY: 22, maxY: 35 },  // Zone 3: Upper-Mid Right

    // Center-mid sides
    { minX: 4, maxX: 19, minY: 42, maxY: 56 },   // Zone 4: Mid Left
    { minX: 81, maxX: 95, minY: 42, maxY: 56 },  // Zone 5: Mid Right

    // Lower-mid sides
    { minX: 3, maxX: 20, minY: 62, maxY: 76 },   // Zone 6: Lower-Mid Left
    { minX: 80, maxX: 95, minY: 62, maxY: 76 },  // Zone 7: Lower-Mid Right

    // Bottom margins (offset from center footer)
    { minX: 8, maxX: 26, minY: 82, maxY: 93 },   // Zone 8: Bottom-Left
    { minX: 74, maxX: 92, minY: 82, maxY: 93 },  // Zone 9: Bottom-Right
];

// Generate 6 to 8 miniature kolams with strict collision avoidance
function generateKolams(): KolamItem[] {
    // 6 to 8 designs per page
    const targetCount = 6 + Math.floor(Math.random() * 3); // 6, 7, or 8

    // Shuffle zones randomly so each page picks a varied subset
    const shuffledZones = [...SPATIAL_ZONES].sort(() => Math.random() - 0.5);

    const placedKolams: KolamItem[] = [];
    const usedKolams = new Set<number>();
    const MIN_DISTANCE = 18; // Minimum 18% Euclidean distance to prevent crowding

    for (const zone of shuffledZones) {
        if (placedKolams.length >= targetCount) break;

        // Try candidate positions inside this zone
        let candidateX = 0;
        let candidateY = 0;
        let valid = false;

        for (let attempt = 0; attempt < 5; attempt++) {
            candidateX = Math.round(zone.minX + Math.random() * (zone.maxX - zone.minX));
            candidateY = Math.round(zone.minY + Math.random() * (zone.maxY - zone.minY));

            // Check distance to all already placed kolams to prevent overlap/clustering
            const isTooClose = placedKolams.some((k) => {
                const kX = parseFloat(k.left);
                const kY = parseFloat(k.top);
                const dist = Math.hypot(candidateX - kX, (candidateY - kY) * 1.3);
                return dist < MIN_DISTANCE;
            });

            if (!isTooClose) {
                valid = true;
                break;
            }
        }

        if (valid) {
            // Pick a unique motif 1-10
            let kolamNum = Math.floor(Math.random() * TOTAL_KOLAMS) + 1;
            while (usedKolams.has(kolamNum) && usedKolams.size < TOTAL_KOLAMS) {
                kolamNum = (kolamNum % TOTAL_KOLAMS) + 1;
            }
            usedKolams.add(kolamNum);

            // Graceful medium watermark size: 64px to 92px
            const size = Math.round(64 + Math.random() * 28);
            const rotation = Math.round(Math.random() * 8) * 45;
            // Subtle opacity (6% to 9%)
            const opacity = Math.round((0.06 + Math.random() * 0.03) * 1000) / 1000;

            placedKolams.push({
                id: placedKolams.length,
                src: `/kolams/kolam-${kolamNum}.png`,
                top: `${candidateY}%`,
                left: `${candidateX}%`,
                size,
                rotation,
                opacity,
            });
        }
    }

    return placedKolams;
}

export default function KolamBackground() {
    const pathname = usePathname();
    const [kolams, setKolams] = useState<KolamItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Generate new random positions whenever navigating to any page or on load
        setKolams(generateKolams());
    }, [pathname]);

    if (!mounted) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-opacity duration-1000"
            aria-hidden="true"
        >
            {kolams.map((item) => (
                <div
                    key={`${pathname}-${item.id}`}
                    className="absolute transition-all duration-700 ease-out"
                    style={{
                        top: item.top,
                        left: item.left,
                        width: `${item.size}px`,
                        height: `${item.size}px`,
                        transform: `rotate(${item.rotation}deg)`,
                    }}
                >
                    {/* Masked Kolam with active theme color */}
                    <div
                        className="w-full h-full transition-colors duration-500"
                        style={{
                            WebkitMaskImage: `url(${item.src})`,
                            WebkitMaskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskImage: `url(${item.src})`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            backgroundColor: "var(--theme-primary)",
                            opacity: item.opacity,
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
