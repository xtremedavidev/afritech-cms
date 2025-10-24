import { useDeleteTestimonial } from "@/src/commons/api/testimonials"
import { HugeIcons } from "@/src/commons/assets/icons"
import CustomButton from "@components/CustomButton"
import DataTable from "@components/data-table"
import { useRouter } from "@router"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

export function statusColor(status: ITestimonial["status"], text?: boolean) {
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

export default function TestimonialsTable({ data }: { data: ITestimonial[] }) {
	const router = useRouter()

	const columns: ColumnDef<ITestimonial>[] = [
		{
			accessorKey: "username",
			header: "User",
		},
		{
			accessorKey: "userPosition",
			header: "Position",
		},
		{
			accessorKey: "message",
			header: "Message",
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
				const testimonial = row.original as ITestimonial
				const { mutate: deleteTestimonial, isPending } = useDeleteTestimonial(testimonial?._id)
				return (
					<div className="flex w-full items-center justify-center gap-x-2 px-4">
						<CustomButton
							variant={"outlined"}
							onClick={() => router.push(`/testimonials/${testimonial?._id}/edit`)}
							startIcon={<HugeIcons.Edit02Icon />}
							className={""}
							text={"Edit"}
						/>
						<CustomButton
							loading={isPending}
							onClick={() => deleteTestimonial()}
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
