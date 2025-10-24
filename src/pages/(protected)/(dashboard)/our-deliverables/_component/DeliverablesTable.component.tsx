import { useDeleteDeliverable } from "@/src/commons/api/our-deliverables"
import { IDeliverable } from "@/src/commons/api/our-deliverables/index.interface"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@components/CustomButton"
import DataTable from "@components/data-table"
import { useRouter } from "@router"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

export function statusColor(status: IDeliverable["status"], text?: boolean) {
	switch (status) {
		case "published":
			return !text ? "bg-primary/20" : "text-primary dark:text-primary"
		default:
			return !text ? "bg-gray-500/20" : "text-gray-700 dark:text-gray-400"
	}
}

export default function DeliverablesTable({ data }: { data: IDeliverable[] }) {
	const router = useRouter()

	const columns: ColumnDef<IDeliverable>[] = [
		{
			accessorKey: "sectionTitle",
			header: "Title",
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status: IDeliverable["status"] = row.original.status
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
				const deliverable = row.original as IDeliverable
				const { mutate, isPending } = useDeleteDeliverable(deliverable?._id)
				return (
					<div className="flex w-full items-center justify-center gap-x-2 px-4">
						<CustomButton
							variant={"outlined"}
							onClick={() => router.push(`/our-deliverables/${deliverable?._id}/edit`)}
							startIcon={<HugeIcons.Edit02Icon />}
							className={""}
							text={"Edit"}
						/>
						<CustomButton
							loading={isPending}
							onClick={() => mutate()}
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
