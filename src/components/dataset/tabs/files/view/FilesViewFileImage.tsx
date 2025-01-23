import Image from "next/image";
import path from "path";
import { useEffect, useState } from "react";

import Spinner from "@/components/ui/spinner";

type ImageDimensions = {
  height?: number;
  width?: number;
};

const loadImageMetadata = (
  setImageDimensions: React.Dispatch<React.SetStateAction<ImageDimensions>>,
  imageUrl: string,
) => {
  const img = new window.Image();
  img.src = imageUrl;

  img.onload = () => {
    setImageDimensions({
      height: img.height,
      width: img.width,
    });
  };
};

export default function FilesViewFileImage({ source }: { source: string }) {
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({});

  useEffect(() => {
    loadImageMetadata(setImageDimensions, source);
  }, [source]);

  return (
    <div className="relative flex-1">
      <Image
        src={source}
        alt={path.basename(source)}
        fill
        className="object-contain"
      />
      <div className="absolute bottom-0 right-0 rounded-tl-lg bg-muted/70 px-1 py-0.5">
        {imageDimensions.height && imageDimensions.width ? (
          <div className="text-sm">
            {imageDimensions.width}x{imageDimensions.height}
          </div>
        ) : (
          <Spinner className="size-5" />
        )}
      </div>
    </div>
  );
}
