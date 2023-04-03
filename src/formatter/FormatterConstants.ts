import { Category, ExampleKind, JavaFormatterSettingMetadata, Value, ValueKind } from "./types";

export const CURRENT_FORMATTER_SETTINGS_VERSION = "23";

export enum FormatterSchemes {
    eclipse = "eclipse"
}

export interface FormatterScheme {
    style: string;
    path?: string;
    profile?: string;
    configurations?: any[];
}

export function getInvalidFormatterSchemeMessage(formatterScheme: string): string {
    return `The configured formatter scheme: ${formatterScheme} is invalid, please check your setting 'java.format.scheme' and try again.`;
}

export function isFormatterSchemeConfigurable(formatterScheme: string): boolean {
    return formatterScheme === FormatterSchemes.eclipse;
}

export namespace JavaConstants {
    export const JAVA_CORE_FORMATTER_ID = "org.eclipse.jdt.core.formatter";
    export const SETTINGS_URL_KEY = "format.settings.url";
    export const SETTINGS_PROFILE_KEY = "format.settings.profile";
    export const JAVA_FORMATTER_SCHEME = "format.scheme";
}

export namespace VSCodeSettings {
    export const INSERT_SPACES = "editor.insertSpaces";
    export const TAB_SIZE = "editor.tabSize";
    export const DETECT_INDENTATION = "editor.detectIndentation";
}

/**
 * VS Code formatter settings
 */
export enum FormatterSettings {
    insertSpaceAfterClosingAngleBracketInTypeArguments = "insert.space.after.closing.angle.bracket.in.type.arguments",
    insertSpaceAfterOpeningBraceInArrayInitializer = "insert.space.after.opening.brace.in.array.initializer",
    insertSpaceBeforeClosingBraceInArrayInitializer = "insert.space.before.closing.brace.in.array.initializer",
    parenthesesPositionsInMethodInvocation = "parentheses.positions.in.method.invocation",
    keepLoopBodyBlockOnOneLine = "keep.loop.body.block.on.one.line",
    keepAnonymousTypeDeclarationOnOneLine = "keep.anonymous.type.declaration.on.one.line",
    keepTypeDeclarationOnOneLine = "keep.type.declaration.on.one.line",
    keepMethodBodyOnOneLine = "keep.method.body.on.one.line",
    bracePositionForBlock = "brace.position.for.block",
    clearBlankLinesInJavadocComment = "clear.blank.lines.in.javadoc.comment",
    blankLinesBetweenImportGroups = "blank.lines.between.import.groups",
    commentLineLength = "comment.line.length",
    useOnOffTags = "use.on.off.tags",
    disablingTag = "disabling.tag",
    enablingTag = "enabling.tag",
    indentParameterDescription = "indent.parameter.description",
    indentRootTags = "indent.root.tags",
    alignTagsDescriptionsGrouped = "align.tags.descriptions.grouped",
    alignTagsNamesDescriptions = "align.tags.names.descriptions",
    formatLineComments = "format.line.comments",
    formatBlockComments = "format.block.comments",
    formatJavadocComments = "format.javadoc.comments",
    lineSplit = "lineSplit",
    joinWrappedLines = "join.wrapped.lines",
    alignmentForEnumConstants = "alignment.for.enum.constants",
    alignmentForParametersInMethodDeclaration = "alignment.for.parameters.in.method.declaration",
}

export const supportedFormatterOptions: Map<string, string> = new Map<string, string>([
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.insert_space_after_closing_angle_bracket_in_type_arguments`, FormatterSettings.insertSpaceAfterClosingAngleBracketInTypeArguments],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.insert_space_after_opening_brace_in_array_initializer`, FormatterSettings.insertSpaceAfterOpeningBraceInArrayInitializer],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.insert_space_before_closing_brace_in_array_initializer`, FormatterSettings.insertSpaceBeforeClosingBraceInArrayInitializer],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.parentheses_positions_in_method_invocation`, FormatterSettings.parenthesesPositionsInMethodInvocation],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.keep_loop_body_block_on_one_line`, FormatterSettings.keepLoopBodyBlockOnOneLine],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.keep_anonymous_type_declaration_on_one_line`, FormatterSettings.keepAnonymousTypeDeclarationOnOneLine],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.keep_type_declaration_on_one_line`, FormatterSettings.keepTypeDeclarationOnOneLine],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.keep_method_body_on_one_line`, FormatterSettings.keepMethodBodyOnOneLine],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.brace_position_for_block`, FormatterSettings.bracePositionForBlock],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.clear_blank_lines_in_javadoc_comment`, FormatterSettings.clearBlankLinesInJavadocComment],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.blank_lines_between_import_groups`, FormatterSettings.blankLinesBetweenImportGroups],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.line_length`, FormatterSettings.commentLineLength],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.use_on_off_tags`, FormatterSettings.useOnOffTags],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.disabling_tag`, FormatterSettings.disablingTag],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.enabling_tag`, FormatterSettings.enablingTag],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.indent_parameter_description`, FormatterSettings.indentParameterDescription],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.indent_root_tags`, FormatterSettings.indentRootTags],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.align_tags_descriptions_grouped`, FormatterSettings.alignTagsDescriptionsGrouped],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.align_tags_names_descriptions`, FormatterSettings.alignTagsNamesDescriptions],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.format_line_comments`, FormatterSettings.formatLineComments],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.format_block_comments`, FormatterSettings.formatBlockComments],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.comment.format_javadoc_comments`, FormatterSettings.formatJavadocComments],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.lineSplit`, FormatterSettings.lineSplit],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.join_wrapped_lines`, FormatterSettings.joinWrappedLines],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.alignment_for_enum_constants`, FormatterSettings.alignmentForEnumConstants],
    [`${JavaConstants.JAVA_CORE_FORMATTER_ID}.alignment_for_parameters_in_method_declaration`, FormatterSettings.alignmentForParametersInMethodDeclaration],
]);

export function getDefaultJavaFormatterSettings(): Map<string, JavaFormatterSettingMetadata> {
    return new Map<string, JavaFormatterSettingMetadata>([
        [FormatterSettings.lineSplit, {
            id: FormatterSettings.lineSplit,
            defaultValue: "120",
            category: Category.wrapping,
            description: "Specify the length of the page. Beyond this length, the formatter will try to split the code. Defaults to `120`.",
            exampleKind: ExampleKind.wrapping,
            valueKind: ValueKind.numberValue,
        }], [FormatterSettings.commentLineLength, {
            id: FormatterSettings.commentLineLength,
            defaultValue: "80",
            category: Category.comment,
            description: "Specify the line length for comments. Defaults to `80`.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.numberValue,
        }], [FormatterSettings.joinWrappedLines, {
            id: FormatterSettings.joinWrappedLines,
            defaultValue: "true",
            category: Category.wrapping,
            description: "Specify whether the formatter can join wrapped lines or not.",
            exampleKind: ExampleKind.wrapping,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.useOnOffTags, {
            id: FormatterSettings.useOnOffTags,
            defaultValue: "true",
            category: Category.comment,
            description: "Use the disabling and enabling tags defined respectively by the `disabling_tag` and the `enabling_tag` options.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.disablingTag, {
            id: FormatterSettings.disablingTag,
            defaultValue: "@formatter:off",
            category: Category.comment,
            description: "Define the tag to put in a comment to disable the formatting. Defaults to `@formatter:off`.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.stringValue,
        }], [FormatterSettings.enablingTag, {
            id: FormatterSettings.enablingTag,
            defaultValue: "@formatter:on",
            category: Category.comment,
            description: "Define the tag to put in a comment to enable the formatting. Defaults to `@formatter:on`.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.stringValue,
        }], [FormatterSettings.indentParameterDescription, {
            id: FormatterSettings.indentParameterDescription,
            defaultValue: "false",
            category: Category.comment,
            description: "Control whether description of Javadoc parameters are indented.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.indentRootTags, {
            id: FormatterSettings.indentRootTags,
            defaultValue: "false",
            category: Category.comment,
            description: "Control whether Javadoc root tags are indented.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.alignTagsDescriptionsGrouped, {
            id: FormatterSettings.alignTagsDescriptionsGrouped,
            defaultValue: "false",
            category: Category.comment,
            description: "Control whether descriptions and names in Javadoc root tags, should be aligned and grouped by tag type.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.alignTagsNamesDescriptions, {
            id: FormatterSettings.alignTagsNamesDescriptions,
            defaultValue: "false",
            category: Category.comment,
            description: "Control whether names and descriptions in Javadoc root tags should be aligned.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.clearBlankLinesInJavadocComment, {
            id: FormatterSettings.clearBlankLinesInJavadocComment,
            defaultValue: "false",
            category: Category.blankLine,
            description: "Control whether blank lines are cleared inside Javadoc comments.",
            exampleKind: ExampleKind.blankLine,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.blankLinesBetweenImportGroups, {
            id: FormatterSettings.blankLinesBetweenImportGroups,
            defaultValue: "1",
            category: Category.blankLine,
            description: "Control blank lines between import groups.",
            exampleKind: ExampleKind.blankLine,
            valueKind: ValueKind.numberValue,
        }], [FormatterSettings.formatLineComments, {
            id: FormatterSettings.formatLineComments,
            defaultValue: "true",
            category: Category.comment,
            description: "Control whether single line comments are formatted.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.formatBlockComments, {
            id: FormatterSettings.formatBlockComments,
            defaultValue: "true",
            category: Category.comment,
            description: "Control whether multiple lines comments are formatted.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.formatJavadocComments, {
            id: FormatterSettings.formatJavadocComments,
            defaultValue: "true",
            category: Category.comment,
            description: "Control whether javadoc comments are formatted.",
            exampleKind: ExampleKind.comment,
            valueKind: ValueKind.booleanValue,
        }], [FormatterSettings.parenthesesPositionsInMethodInvocation, {
            id: FormatterSettings.parenthesesPositionsInMethodInvocation,
            defaultValue: "commonLines",
            category: Category.insertLine,
            description: "Position parentheses in method invocations. Defaults to `commonLines`.",
            exampleKind: ExampleKind.insertLine,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.keepLoopBodyBlockOnOneLine, {
            id: FormatterSettings.keepLoopBodyBlockOnOneLine,
            defaultValue: "never",
            category: Category.insertLine,
            description: "Control when a loop body block should be kept on one line. Defaults to `never`.",
            exampleKind: ExampleKind.insertLine,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.keepAnonymousTypeDeclarationOnOneLine, {
            id: FormatterSettings.keepAnonymousTypeDeclarationOnOneLine,
            defaultValue: "never",
            category: Category.insertLine,
            description: "Control when an anonymous type declaration should be kept on one line. Defaults to `never`.",
            exampleKind: ExampleKind.insertLine,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.keepTypeDeclarationOnOneLine, {
            id: FormatterSettings.keepTypeDeclarationOnOneLine,
            defaultValue: "never",
            category: Category.insertLine,
            description: "Control when a type declaration should be kept on one line. Defaults to `never`.",
            exampleKind: ExampleKind.insertLine,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.keepMethodBodyOnOneLine, {
            id: FormatterSettings.keepMethodBodyOnOneLine,
            defaultValue: "never",
            category: Category.insertLine,
            description: "Control when a method body should be kept on one line. Defaults to `never`.",
            exampleKind: ExampleKind.insertLine,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.insertSpaceAfterClosingAngleBracketInTypeArguments, {
            id: FormatterSettings.insertSpaceAfterClosingAngleBracketInTypeArguments,
            defaultValue: "doNotInsert",
            category: Category.whitespace,
            description: "Insert a space after the closing angle bracket in explicit type arguments on method/constructor invocations.",
            exampleKind: ExampleKind.whitespace,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.insertSpaceBeforeClosingBraceInArrayInitializer, {
            id: FormatterSettings.insertSpaceBeforeClosingBraceInArrayInitializer,
            defaultValue: "insert",
            category: Category.whitespace,
            description: "Insert a space before the closing brace in an array initializer.",
            exampleKind: ExampleKind.whitespace,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.insertSpaceAfterOpeningBraceInArrayInitializer, {
            id: FormatterSettings.insertSpaceAfterOpeningBraceInArrayInitializer,
            defaultValue: "doNotInsert",
            category: Category.whitespace,
            description: "Insert a space after the opening brace in an array initializer.",
            exampleKind: ExampleKind.whitespace,
            valueKind: ValueKind.enumValue,
        }], [FormatterSettings.bracePositionForBlock, {
            id: FormatterSettings.bracePositionForBlock,
            defaultValue: "endOfLine",
            category: Category.insertLine,
            description: "Position the braces of a block. Defaults to `endOfLine`",
            exampleKind: ExampleKind.insertLine,
            valueKind: ValueKind.enumValue,
        }]
    ]);
}

export function getEnumValues(id: string): Value[] {
    switch (id) {
        case FormatterSettings.parenthesesPositionsInMethodInvocation:
            return [
                {
                    value: "commonLines",
                    description: "Set opening and closing parentheses location in common lines with their contents (or simply a single line if the parentheses are empty)."
                },
                {
                    value: "separateLinesIfNotEmpty",
                    description: "Set opening and closing parentheses location on a common line if the parentheses are empty and otherwise in separate lines from their contents."
                },
                {
                    value: "separateLinesIfWrapped",
                    description: "Set opening and closing parentheses location on separate lines from their contents if the contents are wrapped, and in common line if they fit in line width."
                },
                {
                    value: "separateLines",
                    description: "Set parentheses location on separate lines from their contents, that is put a line break after the opening parenthesis and before the closing parenthesis."
                },
                {
                    value: "preservePositions",
                    description: "Set opening and closing parentheses location to be preserved from the original source."
                }
            ];
        case FormatterSettings.keepLoopBodyBlockOnOneLine:
        case FormatterSettings.keepAnonymousTypeDeclarationOnOneLine:
        case FormatterSettings.keepTypeDeclarationOnOneLine:
        case FormatterSettings.keepMethodBodyOnOneLine:
            return [
                {
                    value: "never",
                    description: "Never keep braced code on one line."
                },
                {
                    value: "ifEmpty",
                    description: "Keep braced code on one line only if it's empty."
                },
                {
                    value: "ifSingleItem",
                    description: "Keep braced code on one line if it contains at most a single item."
                },
                {
                    value: "always",
                    description: "Always keep braced code on one line, as long as it doesn't exceed the line width limit."
                },
                {
                    value: "preserve",
                    description: "Keep braced code on one line as long as it doesn't exceed the line width limit and it was already in one line in the original source."
                }
            ];
        case FormatterSettings.insertSpaceAfterClosingAngleBracketInTypeArguments:
        case FormatterSettings.insertSpaceAfterOpeningBraceInArrayInitializer:
        case FormatterSettings.insertSpaceBeforeClosingBraceInArrayInitializer:
            return [
                {
                    value: "doNotInsert"
                },
                {
                    value: "insert"
                }
            ];
        case FormatterSettings.bracePositionForBlock:
            return [
                {
                    value: "endOfLine",
                    description: "Set a brace location at the end of a line."
                },
                {
                    value: "nextLine",
                    description: "Set a brace location at the start of the next line with the right indentation."
                },
                {
                    value: "nextLineIndented",
                    description: "Set a brace location at the start of the next line with an extra indentation."
                },
                {
                    value: "nextLineOnWrap",
                    description: "Set a brace location at the start of the next line if a wrapping occurred."
                }
            ];
        default:
            return [];
    }
}

export namespace Example {

    export const INDENTATION_EXAMPLE = "package com.example;\n" +
        "\n" +
        "class Example {\n" +
        "\tint[] myArray = { 1, 2, 3, 4, 5, 6 };\n" +
        "\tvoid foo(int a, int b, int c) {\n" +
        "\t\tswitch (a) {\n" +
        "\t\tcase 0: Other.doFoo(); break;\n" +
        "\t\tdefault: Other.doBaz();\n" +
        "\t\t}\n" +
        "\t}\n" +
        "}\n";

    export const BLANKLINE_EXAMPLE = "package com.example;\n" +
        "\n" +
        "import java.util.List;\n" +
        "import java.util.Arrays;\n" +
        "\n" +
        "import org.eclipse.jdt.core.dom.ASTParser;\n" +
        "\n" +
        "public class Example {\n" +
        "\tpublic interface ExampleProvider {\n" +
        "\t\tExample getExample();\n" +
        "\t\t// Between here...\n" +
        "\n" +
        "\n" +
        "\n" +
        "\t\t// and here are 3 blank lines\n" +
        "\t\tList<Example> getManyExamples();\n" +
        "\t}\n" +
        "\n" +
        "\tpublic class Foo {\n" +
        "\t\tint a;\n" +
        "\t}\n" +
        "}\n" +
        "class Another {\n" +
        "\n" +
        "}\n";

    export const COMMENT_EXAMPLE = "/**\n" +
        "* An example for comment formatting. This example is meant to illustrate the various possibilities offered by Eclipse in order to format comments\n" +
        "*/\n" +
        "package mypackage;\n" +
        "\n" +
        "interface Example {\n" +
        "\t/*\n" +
        "\t *\n" +
        "\t *block comment          on first column\n" +
        "\t */\n" +
        "\tint bar();\n" +
        "\n" +
        "\t/**\n" +
        "\t *\n" +
        "\t *\n" +
        "\t *\n" +
        "\t * Descriptions of parameters and return values are best appended at end of the javadoc comment.\n" +
        "\t * @param first The first parameter. For an optimum result, this should be an odd number between 0 and 100.\n" +
        "\t * @param second The second parameter.\n" +
        "\t * @return The result of the foo operation, usually an even number within 0 and 1000.\n" +
        "\t */ int foo(int first, int second);\n" +
        "// This is a long comment that should be split in multiple line comments in case the line comment formatting is enabled\n" +
        "\t int foo2();\n" +
        "\t // @formatter:off\n" +
        "\t void method2(int     a,   int   b);\n" +
        "\t // @formatter:on\n" +
        "}\n";

    export const INSERTLINE_EXAMPLE = "@Deprecated package com.example;\n" +
        "class Example {\n" +
        "\tstatic int [] fArray= {1, 2, 3, 4, 5 };\n" +
        // eslint-disable-next-line @typescript-eslint/quotes
        `\tvoid bar(@SuppressWarnings("unused") int i) {\n` +
        "\t\tdo { } while (true);\n" +
        "\t\ttry { } catch (Exception e) { } finally { }\n" +
        "\t\tif (true) { return; } else if (false) { return; }\n" +
        "\t\t;;\n" +
        "\t}\n" +
        "}\n" +
        "enum MyEnum {\t@Deprecated UNDEFINED(0) { }}\n";

    export const BRACED_CODE_TYPE_EXAMPLE = "public class EmptyClass {}\n" +
        "public class TinyClass {\n" +
        "\tint a;}\n" +
        "public class SmallClass {int a; String b;\n" +
        "\tpublic void doNoting() {}\n" +
        "\tpublic void doOneThing() { System.out.println();\n" +
        "\t}\n" +
        "\tpublic void doMoreThings() { something = 4; doOneThing(); doOneThing(); }\n" +
        "}\n";

    export const BRACED_CODE_RECORD_EXAMPLE = "public record EmptyRecord(int a, int b) {}\n" +
        "public record TinyRecord(int a, int b) {\n" +
        "\tstatic int field;\n" +
        "}\n" +
        "public record SmallRecord(int a, int b) { static int field1; static int field2; }\n" +
        "public record EmptyCompactConstructor(int a, int b) { public EmptyCompactConstructor {} }\n" +
        "public record TinyCompactConstructor(int a, int b) { public TinyCompactConstructor {\n" +
        "\tthis.a = a;\n" +
        "}}\n" +
        "public record SmallCompactConstructor(int a, int b) { public SmallCompactConstructor { this.a = a; this.b = b; } }\n";

    export const BRACED_CODE_ENUM_EXAMPLE = "public enum EmptyEnum {}\n" +
        "public enum TinyEnum{ A;\n" +
        "}\n" +
        "public enum SmallEnum{ VALUE(0); SmallEnum(int val) {}; }\n" +
        "\n" +
        "public enum EnumConstants {\n" +
        "\tEMPTY {\n" +
        "\t},\n" +
        "\tTINY { int getVal() { return 2; }},\n" +
        "\tSMALL { int val = 3; int getVal() { return 3; }};\n" +
        "\tint getVal() { return 1; }\n" +
        "}\n";

    export const ANNOTATION_AND_ANONYMOUS_EXAMPLE = "public @interface EmptyInterface {}\n" +
        "public @interface TinyInterface {\n" +
        "\tvoid run(); }\n" +
        "public @interface SmallInteface { int toA(); String toB(); }\n" +
        "\n" +
        "public class AnonymousClasses {\n" +
        "\tEmptyClass emptyAnonymous = new EmptyClass() {\n" +
        "\t};\n" +
        "\tTinyClass tinyAnonymous = new TinyClass() { String b; };\n" +
        "\tObject o = new SmallClass() { int a; int getA() { return a; } };\n" +
        "}\n";

    export const WHITESPACE_EXAMPLE = "package example;\n" +
        "class Example {\n" +
        "public int[] array1 = new int[]{ 1, 2, 3 };\n" +
        "public String s = ((String)object);\n" +
        "public void foo(){\n" +
        "x.<String, Element>foo();\n" +
        "}\n" +
        "}\n";

    export const WRAPPING_EXAMPLE = "public class Example {\n" +
        "\n" +
        "\tpublic List<Integer> list = Arrays.asList(\n" +
        "\t\t111111, 222222, 333333,\n" +
        "\t\t444444, 555555, 666666,\n" +
        "\t\t777777, 888888, 999999, 000000);\n" +
        "}\n";

    export function getExample(example: ExampleKind): string {
        switch (example) {
            case ExampleKind.indentation:
                return Example.INDENTATION_EXAMPLE;
            case ExampleKind.blankLine:
                return Example.BLANKLINE_EXAMPLE;
            case ExampleKind.comment:
                return Example.COMMENT_EXAMPLE;
            case ExampleKind.insertLine:
                return Example.INSERTLINE_EXAMPLE;
            case ExampleKind.bracedType:
                return Example.BRACED_CODE_TYPE_EXAMPLE;
            case ExampleKind.bracedRecord:
                return Example.BRACED_CODE_RECORD_EXAMPLE;
            case ExampleKind.bracedEnum:
                return Example.BRACED_CODE_ENUM_EXAMPLE;
            case ExampleKind.annotationAndAnonymous:
                return Example.ANNOTATION_AND_ANONYMOUS_EXAMPLE;
            case ExampleKind.whitespace:
                return Example.WHITESPACE_EXAMPLE;
            case ExampleKind.wrapping:
                return Example.WRAPPING_EXAMPLE;
            default:
                return "";
        }
    }
}
