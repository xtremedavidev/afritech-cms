// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client"

export type Path =
	| `/`
	| `/about-us`
	| `/blogs`
	| `/blogs/:id`
	| `/blogs/:id/edit`
	| `/blogs/create`
	| `/call-to-action`
	| `/contact-us`
	| `/dashboard`
	| `/footer`
	| `/forgot-password`
	| `/home`
	| `/home/:id`
	| `/home/:id/edit`
	| `/home/create`
	| `/login`
	| `/our-deliverables`
	| `/our-deliverables/:id`
	| `/our-deliverables/:id/edit`
	| `/our-deliverables/create`
	| `/our-process`
	| `/our-process/:id`
	| `/our-process/:id/edit`
	| `/our-process/create`
	| `/projects`
	| `/projects/:id`
	| `/projects/:id/edit`
	| `/projects/create`
	| `/services`
	| `/services/:id`
	| `/services/:id/edit`
	| `/services/create`
	| `/settings`
	| `/team`
	| `/team/:id`
	| `/team/:id/edit`
	| `/team/create`
	| `/testimonials`
	| `/testimonials/:id`
	| `/testimonials/:id/edit`
	| `/testimonials/create`

export type Params = {
	"/blogs/:id": { id: string }
	"/blogs/:id/edit": { id: string }
	"/home/:id": { id: string }
	"/home/:id/edit": { id: string }
	"/our-deliverables/:id": { id: string }
	"/our-deliverables/:id/edit": { id: string }
	"/our-process/:id": { id: string }
	"/our-process/:id/edit": { id: string }
	"/projects/:id": { id: string }
	"/projects/:id/edit": { id: string }
	"/services/:id": { id: string }
	"/services/:id/edit": { id: string }
	"/team/:id": { id: string }
	"/team/:id/edit": { id: string }
	"/testimonials/:id": { id: string }
	"/testimonials/:id/edit": { id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
