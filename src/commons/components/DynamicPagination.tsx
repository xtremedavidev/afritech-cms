import { twMerge } from "tailwind-merge"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@components/ui/pagination"
import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

interface Props {
	className?: string
	pages: number
	activePage: number
	setActivePage: (page: number) => void
}

const DynamicPagination = ({ className, pages, activePage, setActivePage }: Props) => {
	const [params, setParams] = useSearchParams()

	const handlePrevious = () => {
		if (activePage > 1) {
			setActivePage(activePage - 1)
			setParams({ page: (activePage - 1).toString() })
		}
	}

	const handleNext = () => {
		if (activePage < pages) {
			setActivePage(activePage + 1)
			setParams({ ...Object.fromEntries(params.entries()), page: (activePage + 1).toString() })
		}
	}

	const activeClassName = "bg-primary text-white"

	const onSelectActivePage = (page: number) => {
		setActivePage(page)
		setParams({ ...Object.fromEntries(params.entries()), page: page.toString() })
	}

	const renderPageLinks = () => {
		if (pages <= 5) {
			return Array.from({ length: pages }, (_, i) => (
				<PaginationItem
					key={i}
					className="cursor-pointer">
					<PaginationLink
						onClick={() => onSelectActivePage(i + 1)}
						className={twMerge("p-4", activePage === i + 1 ? activeClassName : "")}>
						{i + 1}
					</PaginationLink>
				</PaginationItem>
			))
		}

		return (
			<div className={"relative flex "}>
				{/* First two pages */}
				<PaginationItem className="cursor-pointer">
					<PaginationLink
						onClick={() => onSelectActivePage(1)}
						className={twMerge("p-4", activePage === 1 ? activeClassName : "")}>
						1
					</PaginationLink>
				</PaginationItem>
				<PaginationItem className="cursor-pointer">
					<PaginationLink
						onClick={() => onSelectActivePage(2)}
						className={twMerge("p-4", activePage === 2 ? activeClassName : "")}>
						2
					</PaginationLink>
				</PaginationItem>

				{/* Ellipsis before active page */}
				{activePage > 3 && <PaginationEllipsis />}

				{/* Active page if it’s greater than 2 and less than pages - 1 */}
				{activePage > 2 && activePage < pages - 1 && (
					<PaginationItem className="cursor-pointer">
						<PaginationLink
							onClick={() => onSelectActivePage(activePage)}
							className={twMerge("p-4", activeClassName)}>
							{activePage}
						</PaginationLink>
					</PaginationItem>
				)}

				{/* Ellipsis after active page */}
				{activePage < pages - 2 && <PaginationEllipsis />}

				{/* Last two pages */}
				<PaginationItem className="cursor-pointer">
					<PaginationLink
						onClick={() => onSelectActivePage(pages - 1)}
						className={twMerge("p-4", activePage === pages - 1 ? activeClassName : "")}>
						{pages - 1}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem className="cursor-pointer">
					<PaginationLink
						onClick={() => onSelectActivePage(pages)}
						className={twMerge("p-4", activePage === pages ? activeClassName : "")}>
						{pages}
					</PaginationLink>
				</PaginationItem>
			</div>
		)
	}

	useEffect(() => {
		if (params.get("page")) {
			setActivePage(parseInt(params.get("page") || "1"))
		}
	}, [])

	return (
		<div className={twMerge("", className)}>
			<Pagination>
				<PaginationContent>
					<PaginationItem className="cursor-pointer">
						<PaginationPrevious onClick={handlePrevious} />
					</PaginationItem>

					{renderPageLinks()}

					<PaginationItem className="cursor-pointer">
						<PaginationNext onClick={handleNext} />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}

export default DynamicPagination
