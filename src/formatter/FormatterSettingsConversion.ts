// profile version 20, JDT version 3.24.0
const JAVA_CORE_PLUGIN_ID = "org.eclipse.jdt.core";

class FormatterSettingsConversion {
	private settingsMap: Map<string, string[]> = new Map<string, string[]>();

	constructor() {
		// clientValue, ServerValue[]
		this.settingsMap.set(`java.format.insertSpace.after.binaryOperator`, [
			`${JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_multiplicative_operator`,
			`${JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_additive_operator`,
			`${JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_string_concatenation`,
			`${JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_shift_operator`,
			`${JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_relational_operator`,
			`${JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_bitwise_operator`,
			`${JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_logical_operator`
		]);
	}

	public convert(setting: string): string[] | undefined {
		return this.settingsMap.get(setting);
	}
}

export const formatterSettingsConversion: FormatterSettingsConversion = new FormatterSettingsConversion();