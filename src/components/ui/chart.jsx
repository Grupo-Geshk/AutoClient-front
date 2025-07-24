import { Tooltip } from "recharts"

export function ChartContainer({ className, children, ...props }) {
  return (
    <div
      role="figure"
      aria-roledescription="chart"
      className={`recharts-responsive-container ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({ className, content, ...props }) {
  return (
    <Tooltip
      wrapperClassName={className}
      content={content}
      {...props}
    />
  )
}

export function ChartTooltipContent({ active, payload, label, hideLabel }) {
  if (!active || !payload || payload.length === 0) return null

  const { name, value, fill } = payload[0]

  return (
    <div className="rounded-md border bg-popover p-2 text-popover-foreground shadow-sm">
      {!hideLabel && (
        <p className="text-[0.70rem] uppercase text-muted-foreground">{label}</p>
      )}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: fill }} />
        <span className="text-sm font-medium">{name}</span>
        <span className="ml-auto text-sm font-bold">{value}</span>
      </div>
    </div>
  )
}
