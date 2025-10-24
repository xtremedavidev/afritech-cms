import React from "react"

export {}

export type TableRowType<T = any> =
	| {
	label?: string
	visible: boolean
	view: (row: T) => React.ReactNode
}
	| {
	format: (row: T) => string
	visible: boolean
	label?: string
}
	| {
	value: Extract<keyof T, string>
	visible: boolean
	label?: string
}

export type ICurrencyType = IFiatCurrency | ICryptoCurrency

export enum UserStatus {
	Active = "ACTIVE",
	InActive = "INACTIVE",
	Blocked = "BLOCKED",
	Terminated = "TERMINATED",
}

type Details =
	| {
	type: "timeline"
	details: {
		description: string
		timestamp: string
	}[]
}
	| {
	type: "message"
	details: string
}
	| {
	type: "object"
	details: Record<string, string>
}

export interface IFiatTransaction {
	transaction: "FIAT"
	id: string
	currency: string
	transaction_id?: string //todo: confirm with api
	method?: string //todo: confirm with api
	amount: number
	fee: number
	status: "SUCCESSFUL" | "PROCESSING" | "FAILED" | "CREATED"
	reference: string
	type: "DEBIT" | "CREDIT"
	receiver_account: string
	receiver_name: string
	receiver_bank: string
	user_id: string
	meta: any | null
	date: string
	details: Details
	account_name: string
	beneficiary: { bank: string; account: string }
}

export interface ICryptoTransaction {
	transaction: "CRYPTO"
	id: string
	account_name: string
	type: "CREDIT" | "DEBIT" | "SWAP-DEBIT" | "SWAP-CREDIT"
	counterparty: string
	method?: string
	narration: string
	status: "SUCCESSFUL" | "PROCESSING" | "FAILED" | "CREATED"
	transfer_type: string
	amount: number
	currency: string
	created_at: string | Date
	date: string
	image: string
	transaction_id: string
	details: Details
	beneficiary: { address: string; network: string }
}

export interface ISwapTransaction {
	transaction: "SWAP"
	from_currency: string
	to_currency: string
	method?: string
	from_amount: string
	to_amount: string
	fee_currency: string
	fee: number
	status: "SUCCESSFUL" | "PROCESSING" | "FAILED" | "CREATED"
	type: "FIAT/CRYPTO" | "CRYPTO/FIAT" | "CRYPTO/CRYPTO" | "FIAT/FIAT"
	date: string
	rate: string
	transaction_id: string
	details: Details
}

type ITransaction<T = any> = T extends "fiat"
	? IFiatTransaction
	: T extends "crypto"
		? ICryptoTransaction
		: T extends "swap"
			? ISwapTransaction
			: IFiatTransaction | ICryptoTransaction | ISwapTransaction

declare global {


	interface IOption<T = any> {
		id?: string
		icon?: string | Element
		label: string
		value: any
		raw?: T
	}

	interface IFiatCurrency {
		id?: string
		name: string
		currency: string
		listing_date: string
		status?: "active" | "flagged" | "blocked"
		total_pay_out: string
		total_pay_in: string
	}

	interface ICryptoCurrency {
		id?: string
		name: string
		currency: string
		listing_date: string
		status?: "active" | "flagged" | "blocked"
		total_pay_out: string
		total_pay_in: string
	}

}
