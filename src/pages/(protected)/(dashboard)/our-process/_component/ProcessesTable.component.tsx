import { useDeleteProcess } from "@/src/commons/api/our-process"
import { IProcess } from "@/src/commons/api/our-process/index.interface"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@components/CustomButton"
import DataTable from "@components/data-table"
import { useRouter } from "@router"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

function ProcessActionButtons({ process }: { process: IProcess }) {
	const { mutate: deleteProcess, isPending } = useDeleteProcess(process?._id)
	const router = useRouter()
	
	return (
		<div className="flex w-full items-center justify-center gap-x-2 px-4">
			<CustomButton
				variant={"outlined"}
				onClick={() => router.push(`/our-process/${process?._id}/edit`)}
				startIcon={<HugeIcons.Edit02Icon />}
				className={""}
				text={"Edit"}
			/>
			<CustomButton
				loading={isPending}
				onClick={() => deleteProcess()}
				startIcon={<HugeIcons.Delete01Icon />}
				className={"bg-red-800 text-white"}
				text={"Delete"}
			/>
		</div>
	)
}

export default function ProcessesTable({ data }: { data: IProcess[] }) {
	const router = useRouter()

	const columns: ColumnDef<IProcess>[] = [
		{
			accessorKey: "processTitle",
			header: "Title",
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
			accessorKey: "created_at",
			header: "Date",
			cell: ({ row }) => moment(row?.original?.createdAt).format("DD/MM/yyyy"),
		},
		{
			id: "Actions",
			header: "",
			cell: ({ row }) => {
				const process = row.original as IProcess
				return <ProcessActionButtons process={process} />
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
