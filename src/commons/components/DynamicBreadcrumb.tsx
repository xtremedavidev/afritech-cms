import { usePathname } from "@router"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@components/ui/breadcrumb"
import React from "react"
import Link from "@router/link"

const DynamicBreadcrumb = ({ className = "" }) => {
	const pathname = usePathname()

	// Get pathname and split into segments
	const pathNames = pathname.split("/").filter((x) => x)

	if (pathNames.length === 0) return <div></div>

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				{/* Home link */}
				<BreadcrumbItem>
					<Link href="/">Home</Link>
				</BreadcrumbItem>

				{pathNames.map((value, index) => {
					const isLast = index === pathNames.length - 1
					const to = `/${pathNames.slice(0, index + 1).join("/")}`

					return (
						<React.Fragment key={to}>
							<BreadcrumbSeparator />
							<BreadcrumbItem className={"cursor-pointer"}>
								{/* If it's the last item, render as a non-clickable breadcrumb */}
								{isLast ? (
									<BreadcrumbPage className={"capitalize text-primary"}>{value}</BreadcrumbPage>
								) : (
									<Link
										className={"capitalize"}
										href={to as any}>
										{value}
									</Link>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

export default DynamicBreadcrumb
