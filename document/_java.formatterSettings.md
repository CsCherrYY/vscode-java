# Java Formatter Settings

## Table of Content
- [Introduction](#introduction)
- [Comments](#comments)
  - [Javadoc alignment](#javadoc-alignment)
  - [Off On Tag](#off-on-tag)
- [New Line](#new-line)
  - [Brace policy](#brace-policy)
  - [Braced code](#braced-code)
  - [Control statement](#control-statement)
  - [Keep simple](#keep-simple)
- [Whitespace](#whitespace)
  - [Before binary operator](#before-binary-operator)
  - [After binary operator](#after-binary-operator)
  - [Before comma](#before-comma)
  - [After comma](#after-comma)
  - [Before closing parenthesis](#before-closing-parenthesis)
  - [Before opening parenthesis in control statement](#before-opening-parenthesis-in-control-statement)
  - [Before opening parenthesis in declarations](#before-opening-parenthesis-in-declarations)
  - [After opening parenthesis](#after-opening-parenthesis)
  - [Before opening brace](#before-opening-brace)


---

## Introduction

VS Code Java offers some Java specific formatter settings to control the scheme of Java formatter. With your VS Code Java extension running, you can open VS Code Settings, input `java.format` in the filter and see them in `Extensions -> Java`.

---
## Comments
### Javadoc alignment
This setting decides the policy of alignment in Javadoc. The candidates are:
  - `Align names and descriptions`
  - `Align descriptions, grouped by type`
  - `Align descriptions to tag width`
  - `Don’t align`

The default value is `Align descriptions, grouped by type`.
#### Example code
```java
 /**
 * Descriptions of parameters and return values are best appended at end of the javadoc comment.
 * @param first The first parameter. For an optimum result, this should be an odd number
 * between 0 and 100.
 * @param second The second parameter.
 * @throws Exception when the foo operation cannot be performed for one reason or another.
 * @return The result of the foo operation, usually an even number within 0 and 1000.
 */ int foo(int first, int second) throws Exception;
```
#### Align names and descriptions
The Java formatter will align both the names and descriptions.
```java
	/**
	 * Descriptions of parameters and return values are best appended at end of the
	 * javadoc comment.
	 *
	 * @param  first     The first parameter. For an optimum result, this should be
	 *                   an odd number between 0 and 100.
	 * @param  second    The second parameter.
	 * @throws Exception when the foo operation cannot be performed for one reason
	 *                   or another.
	 * @return           The result of the foo operation, usually an even number
	 *                   within 0 and 1000.
	 */
	int foo(int first, int second) throws Exception;
```
#### Align descriptions, grouped by type
The Java formatter will group tags by type first, then align descriptions in a group.
```java
	/** Descriptions of parameters and return values are best appended at end of the
	 * javadoc comment.
	 *
	 * @param first  The first parameter. For an optimum result, this should be an
	 *               odd number between 0 and 100.
	 * @param second The second parameter.
	 * @throws Exception when the foo operation cannot be performed for one reason
	 *                   or another.
	 * @return The result of the foo operation, usually an even number within 0 and
	 *         1000.
	 */
	int foo(int first, int second) throws Exception;
```
#### Align names and descriptions
The Java formatter will align descriptions according to the tag width.
```java
	/** Descriptions of parameters and return values are best appended at end of the
	 * javadoc comment.
	 *
	 * @param first The first parameter. For an optimum result, this should be an
	 *        odd number between 0 and 100.
	 * @param second The second parameter.
	 * @throws Exception when the foo operation cannot be performed for one reason
	 *         or another.
	 * @return The result of the foo operation, usually an even number within 0 and
	 *         1000.
	 */
	int foo(int first, int second) throws Exception;
```
#### Don't align
Do not align the Javadoc comments, the result code will be the same as the example code.
### Off On Tag
Enable/disable the off tag `@formatter:off` and the on tag `@formatter:on`. Off/On tags can be used in any comments to turn the formatter off and on in a file. The default value is `false`.

#### Example code
```java
void foo() { int a=1+2;}
// @formatter:off
void bar() { int b=3+4;}
// @formatter:on
void pet() { int c=5+6;}
```
#### True(enable)
```java
void foo() {
	int a = 1 + 2;
}
// @formatter:off
void bar() { int b=3+4;}
// @formatter:on
void pet() {
	int c = 5 + 6;
}
```

#### False(disable)
```java
void foo() {
	int a = 1 + 2;
}
// @formatter:off
void bar() {
	int b = 3 + 4;
}
// @formatter:on
void pet() {
	int c = 5 + 6;
}
```
---
## New Line
### Brace policy
This setting decides how to put the opening brace toward the code. The candidates are:
  - `Same line`
  - `Next line`

The default value is `Same line`.
#### Example code
```java
void foo(int x) {
}

void bar(int x)
{
}
```
#### Same line
The Java formatter will put the opening brace in the same line as the code.
```java
void foo(int x) {
}

void bar(int x) {
}
```
#### Next line
The Java formatter will put the opening brace in the next line of the code.
```java
void foo(int x)
{
}

void bar(int x)
{
}
```
### Braced code
This setting decides when the format will keep the braced code on one line. The candidates are:
  - `Never`
  - `If empty`
  - `If at most one item`

The default value is `Never`.
#### Example code
```java
if(false) {}
if(a || b == true) {
	System.out.println("a|b"); }
if(a || c == true) { System.out.println("a|c"); return 0; }
```
#### Never
The Java formatter will never keep the braced code on one line.
```java
if(false) {
}
if(a || b == true) {
	System.out.println("a|b");
}
if(a || c == true) {
	System.out.println("a|c");
	return 0;
}
```
#### If empty
If the block is empty, the Java formatter will keep the braced code on one line.
```java
if(false) {}
if(a || b == true) {
	System.out.println("a|b");
}
if(a || c == true) {
	System.out.println("a|c");
	return 0;
}
```
#### If at most one item
If the block has at most one item, the Java formatter will keep the braced code on one line.
```java
if(false) {}
if(a || b == true) { System.out.println("a|b"); }
if(a || c == true) {
	System.out.println("a|c");
	return 0;
}
```
### Control statement
Enable/disable inserting an empty line in the following control statements. The default value is `false`. It will affect the following control statements:
  - before `else` in an `if` statement
  - before `catch` in a `try` statement
  - before `finally` in a `try` statement
  - before `while` in a `do` statement.
#### Example code
```java
void foo2() {
	if (true) { return; } else if (false) { return; } else { return; }
}
```
#### True(enable)
```java
void foo2(){
	if(true) {
		return;
	}
	else if(false) {
		return;
	}
	else {
		return;
	}
}
```
#### False(disable)
```java
void foo2(){
	if(true) {
		return;
	} else if(false) {
		return;
	} else {
		return;
	}
}
```
### Keep simple
Enable/disable keeping a simple control statement in the same line.
> Note: A simple control statement has only one item and no brace in its block.

The default value is `false`. It will affect the following statements:
  - simple `if` statement
  - simple `foor` loop body
  - simple `while` loop body
  - simple `do while` loop body
#### Example code
```java
void foo2(){
	while(!stop)num=0;
	for(int i : set) {num=num+i;}
}
```
#### True(enable)
```java
void foo2(){
	while (!stop) num = 0;
	for (int i : set) {
		num = num + i;
	}
}
```
#### False(disable)
```java
void foo2(){
	while (!stop)
		num = 0;
	for (int i : set) {
		num = num + i;
	}
}
```
---
## Whitespace
### Before binary operator
Enable/disable inserting a whitespace **before** a **binary operator**. The default value is `true`.

#### Example code
```java
int a = 1+2;
int b = 3 + 4;
```
#### True(enable)
```java
int a = 1 +2;
int b = 3 + 4;
```

#### False(disable)
```java
int a = 1+2;
int a = 3+ 4;
```
> Also see: [After binary operator](#after-binary-operator)
### After binary operator
Enable/disable inserting a whitespace **after** a **binary operator**. The default value is `true`.

#### Example code
```java
int a = 1+2;
int b = 3 + 4;
```
#### True(enable)
```java
int a = 1+ 2;
int b = 3 + 4;
```

#### False(disable)
```java
int a = 1+2;
int a = 3 +4;
```
> Also see: [Before binary operator](#before-binary-operator)
### Before comma
Enable/disable inserting a whitespace **before** a **comma**. The default value is `false`.

#### Example code
```java
int a = 1,b = 2;
int c = 3 , d = 4;
```
#### True(enable)
```java
int a = 1 ,b = 2;
int c = 3 , d = 4;
```

#### False(disable)
```java
int a = 1,b = 2;
int c = 3, d = 4;
```
> Also see: [After comma](#after-comma)
### After comma
Enable/disable inserting a whitespace **after** a **comma**. The default value is `true`.

#### Example code
```java
int a = 1,b = 2;
int c = 3 , d = 4;
```
#### True(enable)
```java
int a = 1, b = 2;
int c = 3 , d = 4;
```

#### False(disable)
```java
int a = 1,b = 2;
int c = 3 ,d = 4;
```
> Also see: [Before comma](#before-comma)
### Before closing parenthesis
Enable/disable inserting a whitespace **before** a **closing parenthesis**. The default value is `false`.

#### Example code
```java
void foo(int x) {
}

void bar(int x ) {
}
```
#### True(enable)
```java
void foo(int x ) {
}

void bar(int x ) {
}
```

#### False(disable)
```java
void foo(int x) {
}

void bar(int x) {
}
```
> Also see: [Before opening parenthesis in control statement](#before-opening-parenthesis-control-statement), [Before opening parenthesis in declarations](#before-opening-parenthesis-declarations), [After opening parenthesis](#after-opening-parenthesis)
### Before opening parenthesis in control statement
Enable/disable inserting a whitespace **before** an **opening parenthesis in control statement**. The default value is `true`. It will affect the following control statements:
  - `if` statement
  - `for` loop
  - `switch` statement
  - `while` and `do while` loop
  - `synchronized` statement
  - `try-with-resources` statement
  - `catch` statement

#### Example code
```java
if(condition1) {
	return foo;
}

if (condition2) {
	return bar;
}
```
#### True(enable)
```java
if (condition1) {
	return foo;
}

if (condition2) {
	return bar;
}
```

#### False(disable)
```java
if(condition1) {
	return foo;
}

if(condition2) {
	return bar;
}
```
> Also see: [Before closing parenthesis](#before-closing-parenthesis), [Before opening parenthesis in declarations](#before-opening-parenthesis-declarations), [After opening parenthesis](#after-opening-parenthesis)
### Before opening parenthesis in declarations
Enable/disable inserting a whitespace **before** an **opening parenthesis in declarations**. The default value is `false`.

#### Example code
```java
void foo(int x) {
};

void bar (int y) {
};
```
#### True(enable)
```java
void foo (int x) {
};

void bar (int y) {
};
```

#### False(disable)
```java
void foo(int x) {
};

void bar(int y) {
};
```
> Also see: [Before closing parenthesis](#before-closing-parenthesis), [Before opening parenthesis in control statement](#before-opening-parenthesis-control-statement), [After opening parenthesis](#after-opening-parenthesis)
### After opening parenthesis
Enable/disable inserting a whitespace **after** an **opening parenthesis**. The default value is `false`.

#### Example code
```java
void foo(int x) {
};

void bar( int y) {
};
```
#### True(enable)
```java
void foo( int x) {
};

void bar( int y) {
};
```

#### False(disable)
```java
void foo(int x) {
};

void bar(int y) {
};
```
> Also see: [Before closing parenthesis](#before-closing-parenthesis), [Before opening parenthesis in control statement](#before-opening-parenthesis-control-statement), [Before opening parenthesis in declarations](#before-opening-parenthesis-declarations)
### Before opening brace
Enable/disable inserting a whitespace **before** an **opening barce**. The default value is `true`.

#### Example code
```java
void foo(int x){
}

void bar(int x) {
}
```
#### True(enable)
```java
void foo(int x) {
}

void bar(int x) {
}
```

#### False(disable)
```java
void foo(int x){
}

void bar(int x){
}
```