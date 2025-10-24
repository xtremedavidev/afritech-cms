import React from "react"
import { useCreateBlog } from "@commons/api/blogs"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"
import BlogEditor from "@src/pages/(protected)/(dashboard)/blogs/_component/BlogEditor.component"

export default function CreateBlogPost({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createBlogPost, isPending: isCreating } = useCreateBlog()

	const onSubmit = ({ data, files, draft }: { data: any; files: Record<string, File>; draft: boolean }) => {
		loader.start()
		createBlogPost({ ...data, files })
			.then((res) => {
				router.push(`/blogs`)
			})
			.finally(() => loader.reset())
	}

	return (
		<BlogEditor
			title="New Article"
			subtitle="Select a category and write a new blog article."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
