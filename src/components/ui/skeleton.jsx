import React from "react";
import { cn } from "@/lib/utils"; // Asegúrate de tener esta función en tu proyecto

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  );
}

export default Skeleton;
