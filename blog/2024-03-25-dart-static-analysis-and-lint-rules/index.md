---
slug: dart-static-analysis-and-lint-rules
title: Dart static analysis and lint rules
authors: [charles]
tags: [dart, flutter, static analysis, lint rules]
keywords: [dart, flutter, static analysis, lint rules, dart analyzer, analysis options]
image: cover.png
description: Static analysis and lint rules are essential tools for maintaining code quality and consistency in Dart and Flutter projects. In this article, we will discuss the importance of static analysis and lint rules, how they work, and how you can leverage them to improve the quality of your codebase.
---

import cover from './cover.png';

<img src={cover} alt="Cover" class="cover"> </img>

Static analysis and lint rules are essential tools for maintaining code quality and consistency in Dart and Flutter projects. In this article, we will discuss the importance of static analysis and lint rules, how they work, and how you can leverage them to improve the quality of your codebase.

<!-- truncate -->

## Static analysis

Static analysis is the process of analyzing the source code of a program at compile time without executing it. It is a powerful tool that can help developers identify potential issues in their code and improve code quality.

In Dart, static analysis is performed by the [Dart analyzer][analyzer], which is a built-in tool that comes with the Dart SDK. During static analysis, the Dart analyzer parses the code to an [abstract syntax tree (AST)][ast] (syntactic structure) and an [element]/[type] model (semantic structure), analyzes the structure of the code, and provides diagnostic messages for potential issues.

Consider the following code snippet:

```dart
int sum(int a, int b) {
  a + b;
}
```

The Dart analyzer will highlight the `sum` function with a red squiggly line and display the following warning:

> The body might complete normally, causing 'null' to be returned, but the return type, 'int', is a potentially non-nullable type.
> Try adding either a return or a throw statement at the end. body_might_complete_normally

The analyzer has identified a potential issue in the code: the `sum` function does not have a `return` nor a `throw` statement, which means that the function will implicitly return `null`. However, the return type of the function is `int`, which is a non-nullable type.

:::info

You can view the full list of available Diagnostic messages [here][diagnotic-messages].

:::

### Analysis options file

When creating a new Dart/Flutter project, an analysis options file `analysis_options.yaml` is created in the project directory. This file allows you to configure the behavior of the Dart analyzer for your project. You can use this file to:

- Enable or disable specific diagnostic messages or lint rules
- Set the severity level for diagnostic messages or lint rules
- Exclude files from analysis
- Enable analysis for experimental features
- Enable stricter type checking

An example of an `analysis_options.yaml` file might look like this:

```yaml title="analysis_options.yaml"
include: package:lints/recommended.yaml

analyzer:
  errors:
    todo: ignore

  exclude:
    - "**/*.g.dart"

  enable-experiment:
    - macros

  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true
```

### Diagnostic message severity

The Dart analyzer provides diagnostic messages for potential issues in your code. Each diagnostic message has a severity level, which indicates the importance of the message:

- `error`
- `warning`
- `info`
- `ignore`

You can configure the severity level for each diagnostic message in the `analysis_options.yaml` file.

For example, to change the severity level of the `body_might_complete_normally` diagnostic message to `warning` and ignore the `todo` comments, you can add the following configuration to the `analysis_options.yaml` file:

```yaml title="analysis_options.yaml"
analyzer:
  errors:
    body_might_complete_normally: warning
    todo: ignore
```

### Excluding files from analysis

You can exclude specific files or directories from being analyzed by the Dart analyzer by adding an `exclude` configuration to the `analysis_options.yaml` file.

For example, to exclude all generated files (files with the `.g.dart` extension) from being analyzed, you can add the following configuration:

```yaml title="analysis_options.yaml"
analyzer:
  exclude:
    - "**/*.g.dart"
```

### Experiment flags

Dart has experimental features that are not yet stable and may change in future releases. You can enable static analysis for these experimental features by adding an `enable-experiment` configuration to the `analysis_options.yaml` file.

For example, to enable the static analysis for experimental feature `macros`, you can add the following configuration:

```yaml title="analysis_options.yaml"
analyzer:
  enable-experiment:
    - macros
```

:::info

You can read more about Experiment flags [here][experiment-flags].

:::

### Stricter type checking

There are three additional type checking that can be enabled in the Dart analyzer:

- strict-casts
- strict-inference
- strict-raw-types

To enable stricter type checking in your project, add the following configuration to your `analysis_options.yaml` file:

```yaml title="analysis_options.yaml"
analyzer:
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true
```

Currently, these type checking are not enabled by default. There are discussion on whether to enable these type checking in the official lint set. You can follow the discussion [here][strict-casts-issue] (strict-casts), [here][strict-inference-issue] (strict-inference) and [here][strict-raw-types-issue] (strict-raw-types).

#### strict-casts

Enabling `strict-casts` will prohibit implicit type casts from `dynamic` to a specific type which can lead to unintended runtime errors.

For example, the following code will trigger a warning since there is no implicit type cast from `dynamic` to `int` or `String`.

> The argument type 'dynamic' can't be assigned to the parameter type 'int'. argument_type_not_assignable

```dart
factory User.fromJson(Map<String, dynamic> json) {
  return User(
    id: json['id'],
    name: json['name'],
  );
}
```

Instead, explicit type casts are required to cast `json['id']` (dynamic) and `json['name']` (dynamic) to `int` and `String` respectively.

```dart
factory User.fromJson(Map<String, dynamic> json) {
  return User(
    id: json['id'] as int,
    name: json['name'] as String,
  );
}
```

#### strict-inference

Enabling `strict-inference` will prohibit the analyzer from inferring `dynamic` type due to omitted types.

Consider the following code:

```dart
sum(a, b) {
  return a + b;
}

final numbers = [];
```

which is equivalent to

```dart
dynamic sum(dynamic a, dynamic b) {
  return a + b;
}

final numbers = <dynamic>[];
```

With `strict-inference` enabled, the analyzer will trigger the following warnings:

> The return type of 'sum' cannot be inferred.
> Declare the return type of 'sum'.dart(inference_failure_on_function_return_type)
>
> The type of a can't be inferred; a type must be explicitly provided.
> Try specifying the type of the parameter.dart(inference_failure_on_untyped_parameter)
>
> The type argument(s) of 'List' can't be inferred.
> Use explicit type argument(s) for 'List'.dart(inference_failure_on_collection_literal)

Developers are required to either

- specify a specific type, or
- explicitly specify the type as `dynamic` (when using `dynamic` is necessary)

```dart
int sum(int a, int b) {
  return a + b;
}

final numbers = <int>[];
```

#### strict-raw-types

Enabling `strict-raw-types` will prohibit the analyzer from inferring `dynamic` type due to omitted type arguments.

Consider the following code:

```dart
List letters = ['a', 'b', 'c']; // which is equivalent to List<dynamic> letters = ['a', 'b', 'c'];
```

With `strict-raw-types` enabled, the analyzer will trigger the following warning:

> The generic type `List<dynamic>` should have explicit type arguments but doesn't.
> Use explicit type arguments for `List<dynamic>`.dart(strict_raw_type)

To fix this, developers are required to specify the type argument for the `List`:

```dart
List<String> letters = ['a', 'b', 'c'];
```

:::tip

Note that the analyzer can infer the type of letters as `List<string>` for `final letters = ['a', 'b', 'c'];`

:::

## Lint rules

Have you ever use the `print` statement for debugging your code? I'm sure you have. But have you ever noticed a squiggly line appearing under your print statement? If you hover over that line, a little window pops up with a message that says:

> Don't invoke 'print' in production code. Try using a logging framework. avoid_print

This message comes from the Dart analyzer and it is warning you that a lint rule called `avoid_print` has been violated. Lint rules (or lints) are a set of rules that help developers identify potential issues in their code, enforce best practices and maintain consistency across their codebase.

:::tip

If you click on the avoid_print [link][avoid_print], it will take you to the documentation page, where you can find the explanation and common fixes for the lint rule.

:::

As of Dart SDK 3.3.0, there are 217 lints available in the Dart SDK. You might be tempted to enable all of these lints at once. However, it's important to note that not all lints are compatible with one another.

For instance, `always_use_package_imports` is incompatible with `avoid_relative_lib_imports`. The former enforces the use of absolute imports, while the latter enforce the use of relative imports.

Besides, each lint rule has its own level of strictness and enforces different coding styles.

For example, `prefer_single_quotes` enforces the use of single quotes for string literals, while `prefer_double_quotes` enforces the use of double quotes.

Therefore, it's important to carefully select the lint rules that align with your project's requirements and your team's coding style.

:::info

You can find the full list of available lints in the Dart SDK [here][all-available-lints].

:::

### Official lints packages

The Dart and Flutter teams have provided a set of official lint rules that you can use in your projects.

The official Dart lint package is [lints], which contains two sets of lints: `core` and `recommended`. The `core` set contains a set of lints that are considered essential for all Dart projects, while the `recommended` set includes additional lints that are recommended for most Dart projects.

The official Flutter lint package is [flutter_lints], which contains a set of lints called `flutter`. The `flutter` set builds on top of the `recommended` set and includes additional lints that are specific to Flutter projects.

With Dart SDK 3.3.0 and Flutter SDK 3.19.2, the default lint set are:

| Project | Package         | Set         | Version |
| ------- | --------------- | ----------- | ------- |
| Dart    | lints           | recommended | ^3.0.0  |
| Flutter | flutter_lints   | flutter     | ^3.0.0  |

When you create a new Dart or Flutter project, `lints` or `flutter_lints` will be added as a dev dependency in the `pubspec.yaml` file and included in the `analysis_options.yaml` file.

```yaml title="pubspec.yaml"
dev_dependencies:
    lints: ^3.0.0 # or flutter_lints: ^3.0.0
```

```yaml title="analysis_options.yaml"
include: package:lints/recommended.yaml # or package:flutter_lints/flutter.yaml
```

### Third-party lint packages

There are also third-party lint packages available on pub.dev. Some popular third-party lint packages include:

- [lint]
- [very_good_analysis]
- [pedantic_mono]

Below is a comparison of the official and third-party lint packages:

| Package                  | Version | Set                | Lints enabled | % of total lints | strict-casts | strict-inference | strict-raw-types |
| ------------------------ |:-------:| ------------------ |:-------------:|:----------------:|:------------:|:----------------:|:----------------:|
| lints (official)         |  3.0.0  | core               |      33       |       15%        |      ❌      |        ❌        |        ❌        |
| lints (official)         |  3.0.0  | recommended        |      88       |       41%        |      ❌      |        ❌        |        ❌        |
| flutter_lints (official) |  3.0.1  | flutter            |      101      |       47%        |      ❌      |        ❌        |        ❌        |
| lint                     |  2.3.0  | strict             |      166      |       76%        |      ✅      |        ❌        |        ❌        |
| very_good_analysis       |  5.1.0  | very_good_analysis |      188      |       87%        |      ✅      |        ✅        |        ✅        |
| pedantic_mono            | 1.26.0  | pedantic_mono      |      154      |       71%        |      ✅      |        ✅        |        ✅        |

### Enabling and disabling lints

To enable a lint rule, you can add the rule to the `analysis_options.yaml` file. Similar to diagnostic messages, you can configure the severity level for each lint rule.

For example, to enable the `avoid_print` lint rule and set the severity level to `warning`, you can add the following configuration to the `analysis_options.yaml` file:

```yaml title="analysis_options.yaml"
linter:
  rules:
    - avoid_print: warning
```

To enable a lint set, you can use the `include` followed by the path to the lint set yaml file:

```yaml title="analysis_options.yaml"
include: package:lints/recommended.yaml
```

To disable a lint rule, you can add the rule to the `analysis_options.yaml` file followed by `: false`:

```yaml title="analysis_options.yaml"
include: package:lints/recommended.yaml

linter:
  rules:
    - avoid_print: false
```

### Lint suppression

You can ignore a specific lint for a particular line of code by adding an `ignore` comment above the line of code that you want to suppress.

For example, to suppress the `avoid_print` lint for a `print` statement, you can add the following `ignore` comment:

```dart
// ignore: avoid_print
print('Hello, World!');
```

You can also suppress a lint for the entire file by adding an `ignore_for_file` comment at the top of the file:

```dart
// ignore_for_file: avoid_print
```

## Command-line tools

The Dart SDK comes with a `dart analyze` command that allows you to run static analysis on your Dart and Flutter projects. This is particularly useful in CI/CD pipelines, where you can run static analysis as part of your build process to ensure that your code meets the required quality standards.

To run static analysis on your project, you can use the following command:

```shell
dart analyze
```

To treat info level issues as fatal, you can use the `--fatal-infos` flag:

```shell
dart analyze --fatal-infos
```

:::info

You can find more information about the `dart analyze` command [here][dart-analyze]

:::

There is also a convenient `dart fix` command that automatically fixes issues (if automated fixes are available) identified by the Dart analyzer.

To preview the fixes, you can run the following command:

```shell
dart fix -n
```

To apply the changes, you can run the following command:

```shell
dart fix --apply
```

:::info

You can find more information about the `dart fix` command [here][dart-fix].

:::

## Conclusion

In this article, we have discussed the importance of static analysis and lint rules in Dart and Flutter projects. By leveraging these powerful tools, developers can identify potential issues in their code, enforce best practices, and maintain consistency across their codebase.

Establishing a set of lint rules that align with your project's requirements and your team's coding style early on can help you maintain a high level of code quality and improve the overall maintainability of your codebase.

If you would like to learn more about static analysis and lint rules, you can refer to the official Dart documentation on [static analysis][static-analysis] and [lint rules][lint-rules].

<!-- Links -->

[analyzer]: https://pub.dev/packages/analyzer
[ast]: https://pub.dev/documentation/analyzer/latest/dart_ast_ast/dart_ast_ast-library.html
[element]: https://pub.dev/documentation/analyzer/latest/dart_element_element/dart_element_element-library.html
[type]: https://pub.dev/documentation/analyzer/latest/dart_element_type/dart_element_type-library.html
[diagnotic-messages]: https://dart.dev/tools/diagnostic-messages
[experiment-flags]: https://dart.dev/tools/experiment-flags
[strict-casts-issue]: https://github.com/dart-lang/lints/issues/125
[strict-inference-issue]: https://github.com/dart-lang/lints/issues/149
[strict-raw-types-issue]: https://github.com/dart-lang/lints/issues/151
[avoid_print]: https://dart.dev/tools/linter-rules/avoid_print
[all-available-lints]: https://dart.dev/tools/linter-rules/all
[lints]: https://pub.dev/packages/lints
[flutter_lints]: https://pub.dev/packages/flutter_lints
[lint]: https://pub.dev/packages/lint
[very_good_analysis]: https://pub.dev/packages/very_good_analysis
[pedantic_mono]: https://pub.dev/packages/pedantic_mono
[dart-analyze]: https://dart.dev/tools/dart-analyze
[dart-fix]: https://dart.dev/tools/dart-fix
[static-analysis]: https://dart.dev/tools/analysis
[lint-rules]: https://dart.dev/tools/linter-rules
