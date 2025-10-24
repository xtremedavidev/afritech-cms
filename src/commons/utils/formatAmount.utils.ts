function determineDecimalPlaces(currency: string): number {
	switch (currency?.toUpperCase()) {
		case "BTC":
			return 8
		case "ETH":
			return 6
		case "USDT":
			return 2
		default:
			return 2
	}
}

export function formatAmount(
	value: number | string = 0,
	currency: string = "null",
	options?: {
		rawFormat?: boolean
		overrideMinDecimalPlaces?: number
		overrideMaxDecimalPlaces?: number
	}
): string {
	const minDecimalPlaces = options?.overrideMinDecimalPlaces || determineDecimalPlaces(currency)
	let maxDecimalPlaces = options?.overrideMaxDecimalPlaces || determineDecimalPlaces(currency)

	//ensure that minDecimalPlaces is less than or equal to maxDecimalPlaces, else override maxDecimalPlaces
	if (minDecimalPlaces > maxDecimalPlaces) {
		maxDecimalPlaces = minDecimalPlaces
	}


	if (options?.rawFormat) {
		// Return formatted number without currency symbol
		return new Intl.NumberFormat(undefined, {
			minimumFractionDigits: minDecimalPlaces,
			maximumFractionDigits: maxDecimalPlaces,
		}).format(Number(value))
	}
	return Number(value).toLocaleString("en", {
		minimumFractionDigits: minDecimalPlaces,
		maximumFractionDigits: maxDecimalPlaces,
	})
}
