 
import React from "react"
import {
	Table,
	TableHeader,
	TableBody,
	// TableFooter,
	TableHead,
	TableRow,
	TableCell,
} from "./table"
import { cn } from "@utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Types for column and props
export type DataTableColumn<T> = {
	label: string
	accessor: keyof T | string
	sortable?: boolean
	render?: (row: T) => React.ReactNode
	className?: string
	headerClassName?: string
}

export type DataTableProps<T> = {
	columns: DataTableColumn<T>[]
	data: T[]
	page: number
	pageSize: number
	total: number
	onPageChange: (page: number) => void
	sortBy?: string
	sortDirection?: "asc" | "desc"
	onSortChange?: (sortBy: string, sortDirection: "asc" | "desc") => void
	loading?: boolean
	emptyMessage?: string
	className?: string
	onRowClick?: (row: T) => void
}

function getValue<T>(row: T, accessor: keyof T | string) {
	if (typeof accessor === "string" && accessor.includes(".")) {
		// Support nested accessors like 'user.name'
		return accessor.split(".").reduce((acc, key) => acc?.[key], row as any)
	}
	return row[accessor as keyof T]
}

export function DataTable<T extends object>({
	columns,
	data,
	page,
	pageSize,
	total,
	onPageChange,
	sortBy,
	sortDirection,
	onSortChange,
	loading,
	emptyMessage = "No data found.",
	className,
	onRowClick,
}: DataTableProps<T>) {
	// Sorting handler
	const handleSort = (col: DataTableColumn<T>) => {
		if (!col.sortable || !onSortChange) return
		let direction: "asc" | "desc" = "asc"
		if (sortBy === (col.accessor as string) && sortDirection === "asc") {
			direction = "desc"
		}
		onSortChange(col.accessor as string, direction)
	}

	// Pagination
	const totalPages = Math.ceil(total / pageSize)
	const canPrev = page > 1
	const canNext = page < totalPages

	// Render
	return (
		<div className={cn("rounded-2xl border border-gray-200 bg-white p-2 dark:bg-background md:p-4 ", className)}>
			<Table>
				<TableHeader>
					<TableRow className="bg-gray-8 hover:bg-gray-8 overflow-hidden">
						{columns.map((col, idx) => (
							<TableHead
								key={col.accessor as string}
								className={cn(
									"group cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-800 sm:py-4",
									col.headerClassName,
									col.sortable && "hover:text-orange",
									sortBy === col.accessor && "text-orange",
									idx === 0 && "rounded-bl-2xl rounded-tl-2xl border-none",
									idx === columns.length - 1 && "rounded-br-2xl rounded-tr-2xl border-none",
								)}
								onClick={() => handleSort(col)}
								aria-sort={
									sortBy === col.accessor
										? sortDirection === "asc"
											? "ascending"
											: "descending"
										: undefined
								}>
								<span className="flex items-center gap-1">
									{col.label}
									{col.sortable && (
										<span className="text-xs">
											{sortBy === col.accessor ? (
												sortDirection === "asc" ? (
													<>&uarr;</>
												) : (
													<>&darr;</>
												)
											) : (
												<span className="opacity-30">&uarr;&darr;</span>
											)}
										</span>
									)}
								</span>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>

				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="py-8 text-center">
								Loading...
							</TableCell>
						</TableRow>
					) : data.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="py-8 text-center">
								{emptyMessage}
							</TableCell>
						</TableRow>
					) : (
						data.map((row, i) => (
							<TableRow
								key={i}
								className={cn("hover:bg-orange/5", onRowClick && "hover:bg-orange/10 cursor-pointer")}
								onClick={onRowClick ? () => onRowClick(row) : undefined}>
								{columns.map((col) => (
									<TableCell
										key={col.accessor as string}
										className={cn(
											"group cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-light text-gray-500 sm:py-4 sm:text-sm",
											col.className,
										)}>
										{col.render ? col.render(row) : getValue(row, col.accessor)}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			{/* Pagination */}
			<div className="mt-6 flex items-center justify-center gap-2">
				<button
					className="bg-orange/10 text-orange rounded-full p-2 disabled:opacity-40"
					onClick={() => canPrev && onPageChange(page - 1)}
					disabled={!canPrev}
					aria-label="Previous page">
					<ChevronLeft className="size-4" />
				</button>
				{Array.from({ length: totalPages }, (_, idx) => (
					<button
						key={idx + 1}
						className={cn(
							"flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
							page === idx + 1 ? "bg-orange text-white" : "bg-orange/10 text-orange",
						)}
						onClick={() => onPageChange(idx + 1)}
						aria-current={page === idx + 1 ? "page" : undefined}>
						{idx + 1}
					</button>
				))}
				<button
					className="bg-orange/10 text-orange rounded-full p-2 disabled:opacity-40"
					onClick={() => canNext && onPageChange(page + 1)}
					disabled={!canNext}
					aria-label="Next page">
					<ChevronRight className="size-4" />
				</button>
			</div>
		</div>
	)
}
