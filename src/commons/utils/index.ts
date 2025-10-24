import { createTheme } from "@mui/material"
import { default as COLORS } from "./colors"
import moment from "moment"
import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { json2csv } from "json-2-csv"

export { formatAmount } from "./formatAmount.utils"

export { default as Keys } from "./query-keys"

export const sortArrayByDate = (array: any[], key, order: "asc" | "desc" = "desc") => {
	if (order === "asc") {
		// @ts-ignore
		return array?.sort((a, b) => new Date(a[key]) - new Date(b[key]))
	} else if (order === "desc") {
		// @ts-ignore
		return array?.sort((a, b) => new Date(b[key]) - new Date(a[key]))
	} else return array
}

export const __DEV__ = process.env.NODE_ENV === "development"

interface IFormatDateOptions {
	by: "hour" | "day"
}

export function formatDate(
	dateString: Date | string,
	options: IFormatDateOptions = {
		by: "hour",
	},
): string {
	const { by } = options

	if (by === "hour") return moment(dateString).fromNow()

	const date = moment(dateString)

	const now = moment() // Current date and time

	// Format for "11:00 pm yesterday"
	if (date.isSame(now.clone().subtract(1, "day"), "day")) {
		return date.format("h:mm a") + " yesterday"
	}

	// Format for "11:00 pm today"
	if (date.isSame(now, "day")) {
		return date.format("h:mm a") + " today"
	}

	// Format for "11:00 pm on Tuesday 27th, 2024"
	if (date.year() === now.year()) {
		return date.format("h:mm a [on] dddd Do")
	} else {
		return date.format("h:mm a [on] dddd Do, YYYY")
	}
}

export function calculateElapsedTimePercentage(startDate: Date | string, endDate: Date | string) {
	// Convert date strings to Date objects
	const start = new Date(startDate)
	const end = new Date(endDate)

	// Calculate total time difference in milliseconds
	// @ts-ignore
	const totalTimeDifference = end - start

	// Calculate elapsed time difference in milliseconds
	const elapsedTimeDifference = Date.now() - start.getTime()

	// Calculate the percentage of elapsed time
	const elapsedTimePercentage = (elapsedTimeDifference / totalTimeDifference) * 100

	// Return the elapsed time percentage
	return elapsedTimePercentage
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export let MuiTheme = createTheme({
	typography: {
		// transform: "none",
		fontFamily: ["Nunito"].join(","),
	},
	palette: {
		primary: {
			main: COLORS.primary,
		},
		secondary: {
			main: COLORS.primary,
		},
	},
})

export function getNestedProperty(obj: object, path: string) {
	const keys = path.split(".")
	let nestedObj: any = obj
	for (const key of keys) {
		if (!nestedObj || typeof nestedObj !== "object") {
			return undefined
		}
		nestedObj = nestedObj[key]
	}
	return nestedObj
}

const isNumber = (n) => {
	return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

const getArrayValues = (myList, number) => {
	let result = Array()
	let found = false

	for (let i = 0; i < myList.length; i++) {
		if (number.indexOf(myList[i]) !== -1) {
			result.push(myList[i])
		}
	}

	return result.length
}

export const validateMSISDN = (phone: string) => {
	let mobile = null
	if (phone.startsWith("234")) {
		mobile = phone.replace("234", "0")
	} else if (phone.startsWith("+234")) {
		mobile = phone.replace("+234", "0")
	} else mobile = phone

	let isValidNumber = false

	let prefix_array = [
		"0803",
		"0806",
		"0703",
		"0706",
		"0813",
		"0816",
		"0810",
		"0814",
		"0903",
		"0906",
		"0913",
		"0916",
		"07025",
		"07026",
		"0704",
		"0805",
		"0807",
		"0705",
		"0815",
		"0911",
		"0811",
		"0905",
		"0915",
		"0802",
		"0808",
		"0708",
		"0812",
		"0701",
		"0902",
		"0901",
		"0904",
		"0907",
		"0912",
		"0809",
		"0818",
		"0817",
		"0909",
		"0908",
		"0804",
		"0702",
	]

	if (isNumber(mobile) && /0\d+/.test(mobile) && mobile.length == 11) {
		//check for prefixes
		if (getArrayValues(prefix_array, mobile) <= 0) {
			isValidNumber = false
		} else {
			isValidNumber = true
		}
	} else {
		isValidNumber = false
	}
	return isValidNumber
}

export async function generateCsvFromJson(data: any, fileName: string = `export`) {
	const csv = json2csv(data).replace("undefined", "-")
	const blob = new Blob([csv], { type: "text/plain" })
	const url = URL.createObjectURL(blob)

	const a = document.createElement("a")
	a.href = url
	a.download = `${fileName}-${Date.now()}.csv` // File name
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)

	URL.revokeObjectURL(url)
}

export function capitalize(str: string) {
	if (!str) return ""
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatNumber(num: number) {
	return Number(num || 0).toLocaleString("en")
}

export { COLORS }
