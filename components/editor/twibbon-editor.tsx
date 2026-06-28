"use client";

import { useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import type Konva from "konva";
import { Download, ImagePlus, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SIZE = 800;

function useHtmlImage(src: string | null, crossOrigin?: string) {
  const [image, setImage] = useState<HTMLImageElement>();
  useEffect(() => {
    if (!src) {
      setImage(undefined);
      return;
    }
    const img = new window.Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => setImage(img);
    img.onerror = () => toast.error("Could not load image.");
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, crossOrigin]);
  return image;
}

export function TwibbonEditor({
  campaignId,
  campaignTitle,
  frameUrl,
}: {
  campaignId: string;
  campaignTitle: string;
  frameUrl: string;
}) {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: SIZE / 2, y: SIZE / 2 });
  const photo = useHtmlImage(photoUrl);
  const frame = useHtmlImage(frameUrl, "anonymous");

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const update = () => {
      const availableWidth = Math.floor(element.getBoundingClientRect().width);
      setDisplaySize(Math.max(1, Math.min(SIZE, availableWidth)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, action: "use" }),
    }).catch(() => undefined);
  }, [campaignId]);

  function choosePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("Image must be smaller than 12 MB.");
      return;
    }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setScale(1);
    setRotation(0);
    setPosition({ x: SIZE / 2, y: SIZE / 2 });
  }

  function photoDimensions() {
    if (!photo) return { width: SIZE, height: SIZE };
    const cover = Math.max(SIZE / photo.width, SIZE / photo.height);
    return { width: photo.width * cover, height: photo.height * cover };
  }

  async function download() {
    if (!photo || !stageRef.current || !displaySize) {
      toast.error("Upload your photo first.");
      return;
    }
    try {
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const dataUrl = stageRef.current.toDataURL({
        pixelRatio: (SIZE * 2) / displaySize,
        mimeType,
        quality: 0.94,
      });
      const link = document.createElement("a");
      link.download = `${campaignTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${format === "jpeg" ? "jpg" : "png"}`;
      link.href = dataUrl;
      link.click();
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, action: "download", format }),
      });
      toast.success("Your image is ready!");
    } catch {
      toast.error("Export failed. Check the frame storage CORS settings.");
    }
  }

  const dimensions = photoDimensions();
  return (
    <div className="relative min-w-0 max-w-full">
      <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-br from-violet-400/20 via-transparent to-sky-300/20 blur-2xl" />
      <div className="editor-grid glass-panel premium-border w-full min-w-0 max-w-full overflow-hidden rounded-[24px] p-1.5 shadow-[0_35px_80px_-35px_rgba(50,36,120,.45)] sm:rounded-[30px] sm:p-2">
        <div
          ref={containerRef}
          className="aspect-square w-full min-w-0 max-w-full overflow-hidden rounded-[19px] sm:rounded-[23px]"
        >
        {displaySize > 0 && (
        <Stage
          ref={stageRef}
          width={displaySize}
          height={displaySize}
        >
          <Layer scaleX={displaySize / SIZE} scaleY={displaySize / SIZE}>
            {photo && (
              <KonvaImage
                image={photo}
                x={position.x}
                y={position.y}
                width={dimensions.width}
                height={dimensions.height}
                offsetX={dimensions.width / 2}
                offsetY={dimensions.height / 2}
                scaleX={scale}
                scaleY={scale}
                rotation={rotation}
                draggable
                onDragEnd={(event) =>
                  setPosition({ x: event.target.x(), y: event.target.y() })
                }
              />
            )}
            {frame && (
              <KonvaImage
                image={frame}
                x={0}
                y={0}
                width={SIZE}
                height={SIZE}
                listening={false}
              />
            )}
          </Layer>
        </Stage>
        )}
        </div>
      </div>
      <div className="glass-panel mt-4 rounded-[22px] p-4 sm:mt-5 sm:rounded-[26px] sm:p-5">
        <label className="group flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-violet-50/80 to-white/70 p-4 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-primary shadow-clay transition group-hover:scale-105">
            <ImagePlus className="size-4.5" />
          </span>
          {photo ? "Change photo" : "Upload your photo"}
          <input type="file" accept="image/*" className="sr-only" onChange={choosePhoto} />
        </label>
        <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-[inset_0_1px_0_white]">
            <div className="mb-2 flex items-center justify-between">
              <Label>Zoom</Label>
              <span className="text-xs text-muted-foreground">{Math.round(scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="size-4" />
              <input
                aria-label="Zoom photo"
                type="range"
                min=".5"
                max="3"
                step=".05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
              <ZoomIn className="size-4" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-[inset_0_1px_0_white]">
            <div className="mb-2 flex items-center justify-between">
              <Label>Rotate</Label>
              <span className="text-xs text-muted-foreground">{rotation}°</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setRotation((v) => v - 15)}>
                <RotateCcw className="size-4" /> -15°
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setRotation((v) => v + 15)}>
                <RotateCw className="size-4" /> +15°
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[82px_1fr] items-center gap-2.5 sm:mt-5 sm:flex sm:gap-3">
          <select
            aria-label="Download format"
            value={format}
            onChange={(e) => setFormat(e.target.value as "png" | "jpeg")}
            className="h-11 rounded-xl border border-white/80 bg-white/80 px-3 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
          </select>
          <Button className="min-w-0 flex-1 px-3 sm:px-5" onClick={download} disabled={!photo}>
            <Download className="size-4" /> Download result
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Your photo stays in this browser and is never uploaded.
        </p>
      </div>
    </div>
  );
}
