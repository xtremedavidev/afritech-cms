import { useGetTestimonials } from "@/src/commons/api/testimonials"
import DropdownSelect from "@/src/commons/components/DropdownSelect"
import FormInput from "@/src/commons/components/FormInput"
import Loading from "@/src/commons/components/Loading"
import CustomButton from "@components/CustomButton"
import CustomText from "@components/CustomText"
import DynamicPagination from "@components/DynamicPagination"
import { useRouter } from "@router"
import { Search01Icon, Search02Icon } from "hugeicons-react"
import { PenLine } from "lucide-react"
import moment from "moment"
import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { twMerge } from "tailwind-merge"
import TestimonialsTable from "./_component/TestimonialsTable.component"

interface Props {
	className?: string
	search?: string
	startDate?: string
	endDate?: string
	limit?: number
	sortBy?: string
	sortOrder?: "DESC" | "ASC"
}

const TestimonialsPage = ({ className }: Props) => {
	const router = useRouter()
	const [params, setParams] = useSearchParams()

	const [limit, setLimit] = useState(params.get("limit") ? Number(params.get("limit")) : 20)
	const [startDate, setStartDate] = React.useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)))
	const [endDate, setEndDate] = React.useState<Date>(new Date())

	const [searchQuery, setSearchQuery] = React.useState<string>(params.get("search") || "")

	const sharedProps = {
		search: searchQuery,
		limit: Number(limit),
		startDate: moment(startDate).format("YYYY-MM-DD"),
		endDate: moment(endDate).format("YYYY-MM-DD"),
	}

	const onSearchText = (e) => {
		setSearchQuery(e.target.value)
		setParams({ ...Object.fromEntries(params.entries()), search: e.target.value, page: "1" })
	}

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-4 pb-[5%]", className)}>
			<div className="mt-4 flex w-full flex-row items-center justify-between">
				<div className="flex flex-col">
					<p className="font-heading text-2xl font-bold">Testimonials</p>
					<p className={"text-sm"}>Compose and publish testimonials to your website.</p>
				</div>
				<div className={"flex w-[60%] items-end justify-end gap-x-4 "}>
					<CustomButton
						className={""}
						startIcon={<PenLine />}
						text={"Create Testimonial"}
						variant={"primary"}
						onClick={() => router.push("/testimonials/create")}
					/>
				</div>
			</div>

			<div className="mt-[5%] flex items-center gap-x-2">
				<div className="flex w-[50%] items-center gap-x-2">
					<FormInput
						startIcon={<Search01Icon className={"mt-1 w-5"} />}
						variant={"primary"}
						value={searchQuery}
						onChange={onSearchText}
						className={"py-2"}
						placeholder={"Search by testimonial name..."}
					/>

					<DropdownSelect
						className={"-mt-5 w-[10vw] py-1"}
						prompt={"Tags"}
						items={["20", "50", "70", "100"]}
						selected={{ label: limit, value: limit }}
						setSelected={(limit) => {
							setLimit(limit)
							setParams({ ...Object.fromEntries(params.entries()), limit: limit, page: "1" })
						}}
					/>
				</div>
			</div>

			{!!searchQuery?.length ? <SearchedTestimonials {...sharedProps} /> : <AllTestimonials />}
		</div>
	)
}

export default TestimonialsPage

const AllTestimonials = ({ startDate, endDate, limit, className }: Props) => {
	const [page, setPage] = React.useState(1)

	const { data = [], isPending } = useGetTestimonials({ page, limit })
	return (
		<div className={""}>
			{isPending ? <Loading.Spinner /> : <TestimonialsTable data={data} />}
			<div className={"my-8 flex w-full items-center justify-end"}>
				<DynamicPagination
					pages={1}
					activePage={page}
					setActivePage={setPage}
				/>
			</div>
		</div>
	)
}

const SearchedTestimonials = ({ startDate, endDate, limit, search, className }: Props) => {
	const [page, setPage] = React.useState(1)

	const { data = [], isPending } = useGetTestimonials({ page, limit, search }, { enabled: search?.length > 2 })
	return (
		<>
			{isPending ? (
				<div className={twMerge(`flex h-[20vh] w-full flex-col items-center justify-center`, className)}>
					<Search02Icon className={"mt-1 h-12 w-12 animate-pulse"} />
					<CustomText
						className={"my-4"}
						text={`Searching for '${search}'`}
					/>
				</div>
			) : (
				<>
					<CustomText
						text={"Search Results"}
						className={"font-heading mt-4 text-xl"}
					/>

					<TestimonialsTable data={data} />
					<div className={"my-8 flex w-full  items-center justify-end"}>
						<DynamicPagination
							pages={1}
							activePage={page}
							setActivePage={setPage}
						/>
					</div>
				</>
			)}
		</>
	)
}
