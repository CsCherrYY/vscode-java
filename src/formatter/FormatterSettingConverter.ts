// profile version 20, JDT version 3.24.0

import { FormatterSettingConstants } from "./FormatterSettingConstants";

class FormatterSettingConverter {
	private settingsMap: Map<string, string[]> = new Map<string, string[]>();

	constructor() {
		// clientValue, ServerValue[]
		this.settingsMap.set(FormatterSettingConstants.AFTER_BINARY_OPERATOR, [
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_multiplicative_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_additive_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_string_concatenation`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_shift_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_relational_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_bitwise_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_after_logical_operator`
		]);

		this.settingsMap.set(FormatterSettingConstants.BEFORE_BINARY_OPERATOR, [
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_before_multiplicative_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_before_additive_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_before_string_concatenation`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_before_shift_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_before_relational_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_before_bitwise_operator`,
			`${FormatterSettingConstants.JAVA_CORE_PLUGIN_ID}.formatter.insert_space_before_logical_operator`
		]);
	}

	public convert(setting: string): string[] | undefined {
		return this.settingsMap.get(setting);
	}

	public valueConvert(setting: string, value: string): string {
		let valueString: string;
		switch (setting) {
			case FormatterSettingConstants.AFTER_BINARY_OPERATOR:
			case FormatterSettingConstants.BEFORE_BINARY_OPERATOR:
				valueString = (value === "true") ? "insert" : "do not insert";
				break;
		}
		return valueString;
	}
}

export const formatterSettingConverter: FormatterSettingConverter = new FormatterSettingConverter();