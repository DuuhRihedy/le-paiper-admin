import { cn } from "@/lib/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-2xl bg-foreground/[0.06]",
                className
            )}
            {...props}
        />
    );
}

function CardSkeleton() {
    return (
        <div className="glass rounded-3xl border border-foreground/5 p-5">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="mt-4 h-7 w-20" />
            <Skeleton className="mt-2 h-3 w-32" />
        </div>
    );
}

function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 border-b border-foreground/5 px-6 py-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
            {Array.from({ length: columns - 2 }).map((_, i) => (
                <Skeleton key={i} className="hidden h-4 w-16 sm:block" />
            ))}
            <Skeleton className="h-8 w-16" />
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div className="glass rounded-3xl border border-foreground/5 p-5">
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-1.5 h-3 w-20" />
                </div>
            </div>
            <div className="mt-6 flex items-end gap-2">
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                    <Skeleton key={i} className="flex-1 rounded-lg" style={{ height: `${h}%`, minHeight: `${h * 2}px` }} />
                ))}
            </div>
        </div>
    );
}

function PageSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="mt-2 h-4 w-64" />
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* Chart */}
            <ChartSkeleton />

            {/* Table */}
            <div className="glass rounded-3xl border border-foreground/5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export { Skeleton, CardSkeleton, TableRowSkeleton, ChartSkeleton, PageSkeleton };
