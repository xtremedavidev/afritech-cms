import { useDeleteMetric } from "@/src/commons/api/home"
import { IMetric } from "@/src/commons/api/home/index.interface"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@components/CustomButton"
import DataTable from "@components/data-table"
import { useRouter } from "@router"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

export function statusColor(status: IMetric["status"], text?: boolean) {
	switch (status) {
		case "published":
			return !text ? "bg-primary/20" : "text-primary dark:text-primary"
		default:
			return !text ? "bg-gray-500/20" : "text-gray-700 dark:text-gray-400"
	}
}

function MetricActionButtons({ metric }: { metric: IMetric }) {
	const { mutate: deleteMetric, isPending } = useDeleteMetric(metric?._id)
	const router = useRouter()
	
	return (
		<div className="flex w-full items-center justify-center gap-x-2 px-4">
			<CustomButton
				variant={"outlined"}
				onClick={() => router.push(`/home/${metric?._id}/edit`)}
				startIcon={<HugeIcons.Edit02Icon />}
				className={""}
				text={"Edit"}
			/>
			<CustomButton
				loading={isPending}
				onClick={() => deleteMetric()}
				startIcon={<HugeIcons.Delete01Icon />}
				className={"bg-red-800 text-white"}
				text={"Delete"}
			/>
		</div>
	)
}

export default function MetricsTable({ data }: { data: IMetric[] }) {
	const columns: ColumnDef<IMetric>[] = [
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "value",
			header: "Value",
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			accessorKey: "order",
			header: "Order",
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status: IMetric["status"] = row.original.status
				return (
					<div className={`${statusColor(status)} rounded-lg px-2 py-2 text-center capitalize`}>
						<p className={`capitalize`}>{status}</p>
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
				const metric = row.original as IMetric
				return <MetricActionButtons metric={metric} />
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
