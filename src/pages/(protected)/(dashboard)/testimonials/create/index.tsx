import { useCreateTestimonial } from "@/src/commons/api/testimonials"
import { useRouter } from "@router"
import { useGlobalStore } from "@store"
import { __DEV__ } from "@utils"
import { useEffect } from "react"
import TestimonialEditor from "../_component/Editor.component"

export default function CreateTestimonial({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createTestimonial, isPending: isCreating } = useCreateTestimonial()

	const onSubmit = ({ data, files, draft }: { data: any; files: Record<string, File>; draft: boolean }) => {
		loader.start()
		createTestimonial({ ...data, files, status: draft ? "draft" : "published" })
			.then((res) => {
				router.push(`/testimonials`)
			})
			.finally(() => loader.reset())
	}

	useEffect(() => {
		if (__DEV__) {
			/*form.setValue("title", "BTC is available on clyp")
			form.setValue("description", "BTC will be available for trading on clyp")
			form.setValue("body", "<p>Sample Content</p>")*/
		}
	}, [])

	return (
		<TestimonialEditor
			title="Add Testimonial"
			subtitle="Write a new testimonial."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
