import DataTable from "@components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import CustomButton from "@components/CustomButton"
import { HugeIcons } from "@/src/commons/assets/icons"
import { useDeleteBlog } from "@commons/api/blogs"
import moment from "moment"
import { useRouter } from "@router"

export function statusColor(status: IBlog["status"], text?: boolean) {
	switch (status) {
		case "published":
			return !text ? "bg-primary/20" : "text-primary dark:text-primary"
		case "draft":
			return !text ? "bg-primary/20" : "text-primary dark:text-primary"
		case "archived":
		default:
			return !text ? "bg-gray-500/20" : "text-gray-700 dark:text-gray-400"
	}
}

export default function BlogsTable({ data }: { data: IBlog[] }) {
	const { mutate: deleteBlog } = useDeleteBlog()
	const router = useRouter()

	const columns: ColumnDef<IBlog>[] = [
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "tags",
			header: "Tags",
			cell: ({ row }) => {
				const tags: string[] = row?.original?.tags
				return tags?.map((tag) => `${tag}, `)
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status: IBlog["status"] = row?.original?.status
				return (
					<div className={`${statusColor(status)} rounded-lg px-2 py-2 text-center capitalize`}>
						<p className={`capitalize`}>{status?.toLowerCase()}</p>
					</div>
				)
			},
		},
		{
			accessorKey: "created_at",
			header: "Date",
			cell: ({ row }) => moment(row?.original?.createdAt).format("DD/MM/yyyy"),
		},
		{
			id: "Actions",
			header: "",
			cell: ({ row }) => {
				const blog = row.original as IBlog
				const { mutate: deleteBlog, isPending } = useDeleteBlog(blog?.id)
				return (
					<div className="flex w-full items-center justify-center px-4 gap-x-2">
						<CustomButton
							variant={"outlined"}
							onClick={() => router.push(`/blogs/${blog?.id}/edit`)}
							startIcon={<HugeIcons.Edit02Icon />}
							className={""}
							text={"Edit"}
						/>
						<CustomButton
							loading={isPending}
							onClick={() => deleteBlog()}
							startIcon={<HugeIcons.Delete01Icon />}
							className={"bg-red-800 text-white"}
							text={"Delete"}
						/>
					</div>
				)
			},
		},
	]

	return (
		<DataTable
			columns={columns}
			data={data}
		/>
	)
}
