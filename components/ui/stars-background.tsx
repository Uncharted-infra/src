"use client";
import { cn } from "@/lib/utils";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
}

interface StarBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  className?: string;
}

export const StarsBackground: React.FC<StarBackgroundProps> = memo(
  ({
    starDensity = 0.00015,
    allStarsTwinkle = true,
    twinkleProbability = 0.7,
    minTwinkleSpeed = 0.5,
    maxTwinkleSpeed = 1,
    className,
  }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [stars, setStars] = useState<StarProps[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsInitializedRef = useRef(false);
    const starsRef = useRef<StarProps[]>([]);

    const generateStars = useCallback(
      (width: number, height: number): StarProps[] => {
        const area = width * height;
        const numStars = Math.floor(area * starDensity);
        return Array.from({ length: numStars }, () => {
          const shouldTwinkle =
            allStarsTwinkle || Math.random() < twinkleProbability;
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 0.05 + 0.5,
            opacity: Math.random() * 0.5 + 0.5,
            twinkleSpeed: shouldTwinkle
              ? minTwinkleSpeed +
                Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
              : null,
          };
        });
      },
      [
        starDensity,
        allStarsTwinkle,
        twinkleProbability,
        minTwinkleSpeed,
        maxTwinkleSpeed,
      ]
    );

    useEffect(() => {
      const updateCanvas = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const rect = canvas.getBoundingClientRect();
          const width = rect.width || window.innerWidth;
          const height = rect.height || window.innerHeight;

          const isMobile = width <= 768;
          const pixelRatio = isMobile
            ? Math.min(window.devicePixelRatio || 1, 1.5)
            : window.devicePixelRatio || 1;

          canvas.width = width * pixelRatio;
          canvas.height = height * pixelRatio;
          ctx.scale(pixelRatio, pixelRatio);

          if (!starsInitializedRef.current) {
            const newStars = generateStars(width, height);
            starsRef.current = newStars;
            setStars(newStars);
            starsInitializedRef.current = true;
          }
        }
      };

      updateCanvas();

      const resizeObserver = new ResizeObserver(() => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const rect = canvas.getBoundingClientRect();
          const width = rect.width || window.innerWidth;
          const height = rect.height || window.innerHeight;

          const isMobile = width <= 768;
          const pixelRatio = isMobile
            ? Math.min(window.devicePixelRatio || 1, 1.5)
            : window.devicePixelRatio || 1;

          canvas.width = width * pixelRatio;
          canvas.height = height * pixelRatio;
          ctx.scale(pixelRatio, pixelRatio);
        }
      });
      if (canvasRef.current) {
        resizeObserver.observe(canvasRef.current);
      }

      const handleOrientationChange = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const rect = canvas.getBoundingClientRect();
          const width = rect.width || window.innerWidth;
          const height = rect.height || window.innerHeight;

          const isMobile = width <= 768;
          const pixelRatio = isMobile
            ? Math.min(window.devicePixelRatio || 1, 1.5)
            : window.devicePixelRatio || 1;

          canvas.width = width * pixelRatio;
          canvas.height = height * pixelRatio;
          ctx.scale(pixelRatio, pixelRatio);
        }
      };
      window.addEventListener("orientationchange", handleOrientationChange);

      return () => {
        const canvas = canvasRef.current;
        if (canvas) {
          resizeObserver.unobserve(canvas);
        }
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
      };
    }, [generateStars]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || stars.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationFrameId: number;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const starsToRender =
          starsRef.current.length > 0 ? starsRef.current : stars;
        starsToRender.forEach((star) => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          const starColor = isDark ? 255 : 30;
          const currentOpacity =
            star.twinkleSpeed !== null
              ? 0.5 +
                Math.abs(
                  Math.sin(
                    (Date.now() * 0.001) / star.twinkleSpeed
                  ) * 0.5
                )
              : star.opacity;
          ctx.fillStyle = `rgba(${starColor}, ${starColor}, ${starColor}, ${currentOpacity})`;
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
      };

      render();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [stars, isDark]);

    return (
      <canvas
        ref={canvasRef}
        className={cn("h-full w-full absolute inset-0", className)}
      />
    );
  }
);

StarsBackground.displayName = "StarsBackground";
