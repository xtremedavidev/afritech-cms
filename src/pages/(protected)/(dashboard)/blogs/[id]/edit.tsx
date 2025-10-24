import { twMerge } from "tailwind-merge"
import CustomText from "@components/CustomText"
import React, { useEffect } from "react"
import FormInput from "@/src/commons/components/FormInput"
import { useForm } from "react-hook-form"
import CONFIG from "@commons/config"
import { MinimalTiptapEditor } from "@components/ui/minimal-tiptap"
import CustomButton from "@/src/commons/components/CustomButton"
import FileUploader from "@components/FileUploader"
import { useDeleteBlog, useGetBlog, useUpdateBlog } from "@commons/api/blogs"
import { useGlobalStore } from "@store"
import { useParams, useRouter } from "@router"
import FormTextArea from "@components/FormTextArea"
import { HugeIcons } from "@/src/commons/assets/icons"
import { TagInput } from "@components/TagInput"
import DropdownSelect from "@components/DropdownSelect"
import { capitalize } from "@utils"
import { toast } from "sonner"
import { showConfirmationModal } from "@/src/commons/components/ConfirmationModal"
import BlogEditor from "@src/pages/(protected)/(dashboard)/blogs/_component/BlogEditor.component"

export default function EditBlogPost({}) {
	const { id } = useParams()

	const router = useRouter()
	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				title: z.string().min(1, "Title is required"),
				status: z.enum(["published", "draft", "archived"], {
					errorMap: () => ({ message: "Status is required" }),
				}),
				author: z.string().min(1, "Author is required"),
				description: z.string().min(1, "Description is required"),
				body: z.string().min(1, "Content is required"),
				tags: z.array(z.string()).min(1, "At least one tag is required").max(8),
			}),
		}),
	)
	const { loader } = useGlobalStore()

	const { mutateAsync: updateBlogPost, isPending: isUpdating } = useUpdateBlog(id)
	const { mutateAsync: deleteBlogPost, isPending: isDeleting } = useDeleteBlog(id)
	const { data: blogPost } = useGetBlog(id)

	const [files, setFiles] = React.useState([])

	useEffect(() => {
		console.log("blogPost", blogPost)
		if (!blogPost) return

		form.setValue("author", blogPost?.author)
		form.setValue("title", blogPost?.title)
		form.setValue("description", blogPost?.description)
		form.setValue("body", blogPost?.body)
		form.setValue("status", blogPost?.status || "draft")
		form.setValue("tags", blogPost?.tags || [])
		if (blogPost?.coverImage) {
			fetch(blogPost?.coverImage)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "coverImage.jpg", { type: blob.type })
					setFiles([file] as any)
				})
		}
	}, [blogPost])

	const onSubmit = ({data, files}) => {
		loader.start()
		updateBlogPost({ ...data, files })
			.then((res) => {
				toast.success("Blog post updated successfully")
			})
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Blog Post",
			message: "Are you sure you want to delete this blog post? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteBlogPost()
					.then(() => {
						toast.success("Blog post deleted successfully")
						router.push("/blogs")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<BlogEditor
			title="Edit Article"
			subtitle="Edit and make changes to your blog article."
			viewType="edit"
			initialData={blogPost}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isLoading={isUpdating}
		/>
	)
}
