import { twMerge } from "tailwind-merge"
import CustomText from "@components/CustomText"
import React, { useEffect } from "react"
import FormInput from "@/src/commons/components/FormInput"
import { useForm } from "react-hook-form"
import CONFIG from "@commons/config"
import { MinimalTiptapEditor } from "@components/ui/minimal-tiptap"
import CustomButton from "@/src/commons/components/CustomButton"
import { useDeleteBlog, useGetBlog, useUpdateBlog } from "@commons/api/blogs"
import { useGlobalStore } from "@store"
import { useParams, useRouter } from "@router"
import FormTextArea from "@components/FormTextArea"
import { HugeIcons } from "@/src/commons/assets/icons"
import { TagInput } from "@components/TagInput"
import DropdownSelect from "@components/DropdownSelect"
import { capitalize } from "@utils"
import { toast } from "sonner"
import { showConfirmationModal } from "@commons/components/ConfirmationModal"

export default function PreviewBlogPost({}) {
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

	const onSubmit = (data) => {
		loader.start()
		updateBlogPost({ ...data, image: files[0] })
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
		<div className={twMerge("flex w-full flex-col gap-y-4 px-[5%] pb-[5%]")}>
			<div className={"my-6 flex flex-row gap-x-4"}>
				<div className="flex w-[65%] flex-col">
					<div className="mt-4 flex items-center justify-between">
						<div className="flex flex-1 flex-col justify-center">
							<CustomButton
								variant={"text"}
								onClick={() => router.push("/blogs")}
								className={"mb-3 w-fit rounded-lg"}
								text={"Back"}
								startIcon={<HugeIcons.ArrowLeft02Icon />}
							/>
							<CustomText
								className="font-heading mb-2 text-3xl font-bold"
								text={"View Article"}
							/>
							<CustomText
								className="my-1 mb-6 text-gray-500"
								text={"Edit and make changes to your blog article."}
							/>
						</div>
					</div>
					<MinimalTiptapEditor
						value={form.watch("body")}
						onChange={(value) => form.setValue("body", value as any)}
						className="border-outline h-full w-full rounded-xl border"
						editorContentClassName="p-5"
						output={"html"}
						placeholder="Type your content here..."
						autofocus={true}
						editable={false}
						editorClassName="focus:outline-none"
					/>
				</div>

				<div className="flex w-[35%] flex-col">
					<div className={"mb-6 flex flex-1 flex-row justify-end gap-x-2"}>
						<CustomButton
							loading={isDeleting}
							variant={"outlined"}
							onClick={form.handleSubmit(onDelete)}
							className={"mb-3  w-fit rounded-lg border-red-800 dark:border-red-500"}
							text={"Delete"}
							endIcon={<HugeIcons.Delete01Icon />}
						/>
						<CustomButton
							loading={isUpdating}
							onClick={() => router.push(`/blogs/${id}/edit`)}
							className={"w-fit rounded-lg"}
							text={"Make Edits"}
							endIcon={<HugeIcons.PencilEdit01Icon />}
						/>
					</div>
					<div className="border-outline flex w-full flex-col gap-y-2 rounded-xl border p-4">
						<div className={"flex flex-col"}>
							<CustomText
								text={"Change Status"}
								className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
							/>
							<DropdownSelect
								disabled
								className={"-mt-4 w-[5vw] py-1"}
								prompt={"Status"}
								items={["Published", "Draft", "Archived"]}
								selected={{ label: capitalize(form.watch("status")), value: form.watch("status") }}
								setSelected={(status) => form.setValue("status", status, { shouldValidate: true })}
							/>
						</div>

						<div className="flex w-full flex-1 flex-col">
							<CustomText
								text={"Cover Image"}
								className="font-heading my-2 mb-3  text-sm  text-gray-700 dark:text-gray-400"
							/>

							<img
								alt={blogPost?.title}
								src={blogPost?.coverImage}
								className="h-48 w-full rounded-xl object-cover"
							/>
						</div>

						<FormInput
							disabled
							className="flex-1"
							errors={form.formState?.errors?.title}
							register={form.register("title")}
							label={"Title"}
							placeholder={"SEO friendly title..."}
						/>

						<FormTextArea
							disabled
							className="flex-1"
							errors={form.formState?.errors?.description}
							register={form.register("description")}
							label={"Meta Description"}
							placeholder={"Start writing..."}
						/>

						<div className="flex flex-col">
							<CustomText
								text={"Tags"}
								className="font-heading mb-2 text-sm text-gray-700 dark:text-gray-400"
							/>
							<TagInput
								disabled
								value={form.watch("tags") || []}
								onChange={(newTags) => form.setValue("tags", newTags, { shouldValidate: true })}
							/>
						</div>

						<FormInput
							disabled
							className="flex-1"
							errors={form.formState?.errors?.author}
							register={form.register("author")}
							label={"Author"}
							placeholder={"ex: John Doe"}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
