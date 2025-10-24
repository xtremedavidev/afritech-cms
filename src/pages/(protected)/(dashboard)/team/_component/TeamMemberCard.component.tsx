import React from "react"
import { Mail, MoreVertical, Phone } from "lucide-react"
import { useRouter } from "@/src/commons/router"

interface Props {
	member: ITeamMember
}

function TeamMemberCard({ member }: Props) {
	const router = useRouter()
	return (
		<div onClick={()=>router.push(member?.id)} className="mx-auto w-full overflow-hidden rounded-3xl bg-black/5 cursor-pointer dark:bg-gray-500/5 shadow-lg">
			{/* Header with three dots */}
			<div className="flex justify-end p-4">
				<MoreVertical className="h-6 w-6 text-gray-400" />
			</div>

			{/* Profile section */}
			<div className="px-6 pb-6">
				{/* Avatar */}
				<div className="relative mx-auto mb-4 h-24 w-24">
					{member?.profileImage ? (
						<img
							src={member?.profileImage}
							alt={member?.fullName}
							className="h-full w-full rounded-2xl object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
							<span className="text-2xl font-semibold text-white">
								{member?.fullName.slice(0,1)}
								{member?.fullName?.split("")[1]?.slice(0,1)}
							</span>
						</div>
					)}

					{/* Initials badge */}
					<div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-300">
						<span className="text-sm font-semibold text-white">
							{member?.fullName.slice(0,1)}
							{member?.fullName?.split("")[1]?.slice(0,1)}
						</span>
					</div>
				</div>

				{/* Name */}
				<h2 className="mb-2 text-center text-2xl font-bold ">{member?.fullName}</h2>

				{/* Title and Company */}
				<div className="mb-8 text-center">
					<p className="text-base text-gray-500">{member?.roleTitle}</p>
					<p className="text-base font-semibold text-purple-600">Team</p>
				</div>

				{/* Contact Information */}
				<div className="space-y-4">
					{/* Phone */}
					<div className="flex items-center space-x-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
							<Phone className="h-6 w-6 text-purple-600" />
						</div>
						<span className=" font-semibold ">{member?.phone}</span>
					</div>

					{/* Email */}
					<div className="flex items-center space-x-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
							<Mail className="h-6 w-6 text-purple-600" />
						</div>
						<span className=" font-semibold ">{member?.email}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TeamMemberCard
