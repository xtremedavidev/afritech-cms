import { twMerge } from "tailwind-merge"
import React, { useState } from "react"
import CustomText from "@components/CustomText"
import { useGetBlogs } from "src/commons/api/blogs"
import { useRouter } from "@router"
import DynamicPagination from "@components/DynamicPagination"
import Loading from "@/src/commons/components/Loading"
import { useSearchParams } from "react-router-dom"
import FormInput from "@/src/commons/components/FormInput"
import { Search01Icon, Search02Icon } from "hugeicons-react"
import moment from "moment"
import BlogsTable from "@src/pages/(protected)/(dashboard)/blogs/_component/BlogsTable.component"
import CustomButton from "@components/CustomButton"
import { PenLine } from "lucide-react"

interface Props {
	className?: string
	search?: string
	startDate?: string
	endDate?: string
	limit?: number
	sortBy?: string
	sortOrder?: "DESC" | "ASC"
}

const BlogsPage = ({ className }: Props) => {
	const router = useRouter()
	const [params, setParams] = useSearchParams()
	const { data = [], stats, isPending } = useGetBlogs({ status: "all" })

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
					<p className="font-heading text-2xl font-bold">Blog Posts ({stats?.totalDocs || 0})</p>
					<p className={"text-sm"}>Compose and publish blog articles to your store.</p>
				</div>
				<div className={"flex w-[60%] items-end justify-end gap-x-4 "}>
					<CustomButton
						className={""}
						startIcon={<PenLine />}
						text={"Write Article"}
						variant={"primary"}
						onClick={() => router.push("/blogs/create")}
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
						placeholder={"Search by article name..."}
					/>

					{/*	<DropdownSelect
						className={"-mt-5 w-[10vw] py-1"}
						prompt={"Tags"}
						items={tags}
						selected={{ label: limit, value: limit }}
						setSelected={(limit) => {
							setLimit(limit)
							setParams({ ...Object.fromEntries(params.entries()), limit: limit, page: "1" })
						}}
					/>*/}
				</div>
			</div>

			{!!searchQuery?.length ? (
				<SearchedBlogs {...sharedProps} />
			) : (
				<>{isPending ? <Loading.Spinner /> : <AllBlogs />}</>
			)}
		</div>
	)
}

export default BlogsPage

const AllBlogs = ({ startDate, endDate, limit, className }: Props) => {
	const [page, setPage] = React.useState(1)

	const { data = [], isPending } = useGetBlogs({ page, limit })
	return (
		<div className={""}>
			{isPending ? <Loading.Spinner /> : <BlogsTable data={data} />}
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

const SearchedBlogs = ({ startDate, endDate, limit, search, className }: Props) => {
	const [page, setPage] = React.useState(1)

	const { data = [], isPending } = useGetBlogs({ page, limit, search }, { enabled: search?.length > 2 })
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

					<BlogsTable data={data} />
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
