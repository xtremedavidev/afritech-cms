import DataTable from "@components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import CustomButton from "@components/CustomButton"
import { HugeIcons } from "@/src/commons/assets/icons"
import { useDeleteService } from "@commons/api/services"
import moment from "moment"
import { useRouter } from "@router"

export function statusColor(status: IService["isActive"], text?: boolean) {
	switch (status) {
		case true:
			return !text ? "bg-primary/20" : "text-primary dark:text-primary"
		case false:
		default:
			return !text ? "bg-gray-500/20" : "text-gray-700 dark:text-gray-400"
	}
}

export default function ServicesTable({ data }: { data: IService[] }) {
	const { mutate: deleteService } = useDeleteService()
	const router = useRouter()

	const columns: ColumnDef<IService>[] = [
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status: IService["isActive"] = row.original.isActive
				console.log("status", status)
				return (
					<div className={`${statusColor(status)} rounded-lg px-2 py-2 text-center capitalize`}>
						<p className={`capitalize`}>{status ? "Active" : "Inactive"}</p>
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
				const service = row.original as IService
				const { mutate: deleteService, isPending } = useDeleteService(service?.id)
				return (
					<div className="flex w-full items-center justify-center gap-x-2 px-4">
						<CustomButton
							variant={"outlined"}
							onClick={() => router.push(`/services/${service?.id}/edit`)}
							startIcon={<HugeIcons.Edit02Icon />}
							className={""}
							text={"Edit"}
						/>
						<CustomButton
							loading={isPending}
							onClick={() => deleteService()}
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
