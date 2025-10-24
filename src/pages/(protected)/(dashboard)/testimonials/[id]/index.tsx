import { useDeleteTestimonial, useGetTestimonial } from "@/src/commons/api/testimonials"
import { useGlobalStore } from "@/src/commons/store"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { useParams, useRouter } from "@router"
import { toast } from "sonner"
import TestimonialEditor from "../_component/Editor.component"

export default function EditProject({}) {
	const { id } = useParams()

	const { data: testimonial } = useGetTestimonial(id)

	const { loader } = useGlobalStore()
	const router = useRouter()
	const { data: deleteTestimonial } = useDeleteTestimonial(id)

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
		<TestimonialEditor
			title="View Testimonial"
			subtitle="View the details of your testimonial."
			viewType="view"
			initialData={testimonial}
			onSubmit={() => {}}
			isLoading={false}
		/>
	)
}
