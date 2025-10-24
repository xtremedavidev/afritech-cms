import { useDeleteTestimonial, useGetTestimonial, useUpdateTestimonial } from "@/src/commons/api/testimonials"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { useParams, useRouter } from "@router"
import { useGlobalStore } from "@store"
import { toast } from "sonner"
import ProjectEditor from "../_component/Editor.component"

export default function EditTestimonial({}) {
	const router = useRouter()
	const { id } = useParams()

	const { loader } = useGlobalStore()

	const { mutateAsync: updateTestimonial, isPending: isUpdating } = useUpdateTestimonial(id)
	const { mutateAsync: deleteTestimonial, isPending: isDeleting } = useDeleteTestimonial(id)
	const { data: testimonial } = useGetTestimonial(id)

	const onSubmit = ({ data, files }: { data: any; files: Record<string, File>; draft }) => {
		loader.start()
		updateTestimonial({ ...data, files })
			.then((res) => toast.success("Testimonial updated!"))
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Testimonial",
			message: "Are you sure you want to delete this testimonial? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteTestimonial()
					.then(() => {
						toast.success("Testimonial deleted successfully")
						router.push("/testimonials")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<ProjectEditor
			title="Edit Testimonial"
			subtitle="Edit and make changes to your testimonial."
			viewType="edit"
			initialData={testimonial}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isLoading={isUpdating}
		/>
	)
}
