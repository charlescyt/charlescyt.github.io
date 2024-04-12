---
slug: riverpod-code-generation
title: Riverpod Code Generation
authors: [charles]
tags: [flutter, riverpod, state management]
keywords: [flutter, riverpod, state management, code generation]
image: /img/covers/riverpod-code-generation.png
description: Riverpod offers a code generation tool that helps to enhance the developer experience. Through code generation, Riverpod simplifies the syntax to define providers and notifiers, reducing the amount of boilerplate code and enhancing the developer experience. It also provides support for multiple family parameters, including named parameters and positional parameters.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ProviderSyntax from './provider-syntax.png';
import NotifierSyntax from './notifier-syntax.png';
import ProviderSnippetDemo from './provider-snippet-demo.gif';
import NotifierSnippetDemo from './notifier-snippet-demo.gif';
import ExplorerFileNesting from './explorer-file-nesting.png';

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/covers/riverpod-code-generation.png')} alt="Cover" class="cover"> </img>

Riverpod offers a code generation tool that helps to enhance the developer experience. Through code generation, Riverpod simplifies the syntax to define providers and notifiers, reducing the amount of boilerplate code and enhancing the developer experience. It also provides support for multiple family parameters, including named parameters and positional parameters.

<!-- truncate -->

In the previous article, we covered the fundamental concepts of Riverpod. In this article, we will dive deeper into the topic of code generation in Riverpod, exploring how it can improve the overall developer experience.

## Introduction

Riverpod offers a diverse range of providers and notifiers, along with their modifiers, to cater to various use cases. However, manually defining providers and notifiers can be tedious and error-prone. Code generation can significantly simplify the syntax needed to define providers and notifiers, reducing the amount of boilerplate code and enhancing the overall developer experience.

To use code generation in Riverpod, run the following command:

- [riverpod_annotation]: provides annotations for [riverpod_generator].
- [riverpod_generator]: generates code for providers and notifiers.
- [build_runner]: provides a concrete way of generating files using Dart code.

To use Riverpod with code generation, run the following command:

<Tabs groupId="environment" defaultValue="flutter">
<TabItem value="dart" label="Dart">
```shell
dart pub add riverpod_annotation
dart pub add dev:riverpod_generator
dart pub add dev:build_runner
```
</TabItem>

<TabItem value="flutter" label="Flutter">
```shell
flutter pub add riverpod_annotation
flutter pub add dev:riverpod_generator
flutter pub add dev:build_runner
```
</TabItem>
</Tabs>

## build_runner

Similar to other code generation packages in Dart such as [json_serializable] and [freezed], [riverpod_generator] uses [build_runner] to generate the files.

You can either perform a one-time generation of the files or set up a watch mode to automatically generate the files when the source files change.

To generate the files manually, run the following command:

```shell
dart run build_runner build -d
```

If you want to enable the watch mode, which continuously monitors your source files and generates the updated files automatically, you can use the following command instead:

```shell
dart run build_runner watch -d
```

To stop the watch mode, simply press <kbd>Ctrl</kbd> + <kbd>C</kbd> in the terminal.

:::info

The `-d` flag is used to skip the user prompt and delete any conflicting files from previous builds.

:::

## Explorer File Nesting

If you find that the generated files are cluttering your project structure, you can leverage the [Explorer File Nesting] feature in Visual Studio Code to keep the generated files organised.

To enable file nesting in Visual Studio Code, add the following configuration to your `settings.json` file:

```json title="settings.json"
{
    "explorer.fileNesting.enabled": true,
    "explorer.fileNesting.expand": false,
    "explorer.fileNesting.patterns": {
        "*.dart": "$(capture).g.dart,
    },
}
```

This will group all the generated Dart files (those with the .g.dart extension) with their corresponding source files in a single directory within the Visual Studio Code file explorer.

The `explorer.fileNesting.expand` setting is set to false, which means the nested files will be initially collapsed, reducing the visual clutter in the file explorer. You can then expand the nested files as needed.

<img src={ExplorerFileNesting} alt="Explorer File Nesting" class="screenshot"> </img>

JetBrains IDEs like IntelliJ IDEA and Android Studio also support file nesting. For more information, check out the [File Nesting Rules] documentation.

By grouping the generated files with their corresponding sources, you can maintain a clean and organised project structure. This can improve the overall navigability and readability of your codebase, making it easier to work with and maintain over time.

:::tip

You can also group other related files. For example, the pubspec.yaml with pubspec.lock, build.yaml and analysis_options.yaml.

:::

## Syntax

To define providers and notifiers with code generation, you need to import the [riverpod_annotation] package and add the `@riverpod` annotation to the function or class.

Then add the `part` directive to specify the generated file that will contain the provider or notifier. The generated file will have the same name as the source file with the suffix `.g.dart`.

```dart title="file_name.dart"
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'file_name.g.dart';

@riverpod
int number(NumberRef ref) {
  return 0;
}
```

The syntax to define a [Provider], [FutureProvider] and [StreamProvider] is similar to the vanilla approach with one key difference:

- No explicit provider type

Instead, Riverpod will automatically infer the provider type from the return type of the function.

- Provider: If the function returns a type that is not a Future or Stream.
- FutureProvider: If the function returns a Future.
- StreamProvider: If the function returns a Stream.

Note that the generated provider will have the same name as the function with the suffix `Provider`. For example, the generated provider name for the function `number` will be `numberProvider`.

<img src={ProviderSyntax} alt="Provider Syntax" class="screenshot"> </img>

The syntax to define a [Notifier], [AsyncNotifier], [StreamNotifier] and their corresponding providers is similar to the vanilla approach. However, there are a couple of key differences:

- No explicit notifier type: Riverpod will automatically infer the notifier type from the return type of the `build` method.
- No explicit provider declaration: Riverpod will automatically generate the provider for you.

Note that the generated provider will have the same name as the notifier class with the suffix Provider. For instance, the generated provider name for the `CounterNotifier` class will be `counterNotifierProvider`.

<img src={NotifierSyntax} alt="Notifier Syntax" class="screenshot"> </img>

:::info

[StateProvider], [ChangeNotifier], [ChangeNotifierProvider], [StateNotifier], [StateNotifierProvider] are not supported by [riverpod_generator].

:::

The below examples demonstrate how to define providers and notifiers with code generation:

### Provider

<Tabs groupId="code-generation" defaultValue="with code generation">
<TabItem value="with code generation" label="With Code Generation">

```dart title="number_provider.dart"
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'number_provider.g.dart';

@riverpod
int number(NumberRef ref) {
  return 0;
}
```

</TabItem>

<TabItem value="without code generation" label="Without Code Generation">

```dart title="number_provider.dart"
import 'package:riverpod/riverpod.dart';

final numberProvider = Provider.autoDispose<int>((ref) {
  return 0;
});
```

</TabItem>
</Tabs>

### FutureProvider

<Tabs groupId="code-generation" defaultValue="with code generation">
<TabItem value="with code generation" label="With Code Generation">

```dart title="users_provider.dart"
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'users_provider.g.dart';

@riverpod
Future<List<User>> users(UsersRef ref) async {
  final uri = Uri.https('jsonplaceholder.typicode.com', '/users');
  final response = await http.get(uri);
  final json = jsonDecode(utf8.decode(response.bodyBytes)) as List<dynamic>;
  final users = json.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
  return users;
}
```

</TabItem>

<TabItem value="without code generation" label="Without Code Generation">

```dart title="users_provider.dart"
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:riverpod/riverpod.dart';

final usersProvider = FutureProvider.autoDispose<List<User>>((ref) async {
  final uri = Uri.https('jsonplaceholder.typicode.com', '/users');
  final response = await http.get(uri);
  final json = jsonDecode(utf8.decode(response.bodyBytes)) as List<dynamic>;
  final users = json.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
  return users;
});
```

</TabItem>
</Tabs>

### StreamProvider

<Tabs groupId="code-generation" defaultValue="with code generation">
<TabItem value="with code generation" label="With Code Generation">

```dart title="timer_provider.dart"
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'timer_provider.g.dart';

@riverpod
Stream<int> timer(TimerRef ref) {
  return Stream.periodic(const Duration(seconds: 1), (x) => x);
}
```

</TabItem>

<TabItem value="without code generation" label="Without Code Generation">

```dart title="timer_provider.dart"
import 'package:riverpod/riverpod.dart';

final timerProvider = StreamProvider.autoDispose<int>((ref) {
  return Stream.periodic(const Duration(seconds: 1), (x) => x);
});
```

</TabItem>
</Tabs>

### NotifierProvider

Notice that we do not have to declare the `NotifierProvider` explicitly with code generation. The code generation tool will generate the `NotifierProvider` for us.

<Tabs groupId="code-generation" defaultValue="with code generation">
<TabItem value="with code generation" label="With Code Generation">

```dart title="counter_notifier_provider.dart"
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'counter_notifier_provider.g.dart';

@riverpod
class CounterNotifier extends _$CounterNotifier {
  @override
  int build() {
    return 0;
  }

  void increment() {
    state++;
  }
}
```

</TabItem>

<TabItem value="without code generation" label="Without Code Generation">

```dart title="counter_notifier_provider.dart"
import 'package:riverpod/riverpod.dart';

class CounterNotifier extends AutoDisposeNotifier<int> {
  @override
  int build() {
    return 0;
  }

  void increment() {
    state++;
  }
}

final counterProvider = NotifierProvider.autoDispose<CounterNotifier, int>(CounterNotifier.new);
```

</TabItem>
</Tabs>

### AsyncNotifierProvider

<Tabs groupId="code-generation" defaultValue="with code generation">
<TabItem value="with code generation" label="With Code Generation">

```dart title="users_provider.dart"
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'users_provider.g.dart';

@riverpod
class Users extends _$Users {
  @override
  Future<List<User>> build() async {
    final uri = Uri.https('jsonplaceholder.typicode.com', '/users');
    final response = await http.get(uri);
    final json = jsonDecode(utf8.decode(response.bodyBytes)) as List<dynamic>;
    final users = json.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
    return users;
  }

  Future<void> add(User user) async {
    final uri = Uri.https('jsonplaceholder.typicode.com', '/users');
    await http.post(uri, body: jsonEncode(user.toJson()));
  }
}
```

</TabItem>

<TabItem value="without code generation" label="Without Code Generation">

```dart title="users_provider.dart"
import 'package:riverpod/riverpod.dart';

class Users extends AutoDisposeAsyncNotifier<List<User>> {
  @override
  Future<List<User>> build() async {
    final uri = Uri.https('jsonplaceholder.typicode.com', '/users');
    final response = await http.get(uri);
    final json = jsonDecode(utf8.decode(response.bodyBytes)) as List<dynamic>;
    final users = json.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
    return users;
  }

  Future<void> add(User user) async {
    final uri = Uri.https('jsonplaceholder.typicode.com', '/users');
    await http.post(uri, body: jsonEncode(user.toJson()));
  }
}

final usersProvider = AsyncNotifierProvider.autoDispose<Users, List<User>>(Users.new);
```

</TabItem>
</Tabs>

### StreamNotifierProvider

<Tabs groupId="code-generation" defaultValue="with code generation">
<TabItem value="with code generation" label="With Code Generation">

```dart title="users_provider.dart"
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'users_provider.g.dart';

@riverpod
class UsersNotifier extends _$UsersNotifier {
  @override
  Stream<List<User>> build() {
    return ...
  }

  Future<void> add(User user) async {
    ...
  }
}
```

</TabItem>

<TabItem value="without code generation" label="Without Code Generation">

```dart title="users_provider.dart"
import 'package:riverpod/riverpod.dart';

class UsersNotifier extends AutoDisposeStreamNotifier<List<User>> {
  @override
  Stream<List<User>> build() {
    return ...
  }

  Future<void> add(User user) async {
    ...
  }
}

final usersProvider = StreamNotifierProvider.autoDispose<UsersNotifier, List<User>>(UsersNotifier.new);
```

</TabItem>
</Tabs>

### AutoDispose

[riverpod_generator] promotes the auto-dispose behavior for providers and therefore providers created with code generation have **auto-dispose enabled by default**. This means that the provider will automatically be disposed when it is no longer being subscribed to.

The auto-dispose behavior is designed to help optimise your application's memory usage by ensuring that providers are only kept alive as long as they are needed. When a provider is no longer being used, it will be automatically disposed, freeing up resources and preventing potential memory leaks.

However, there may be cases where you want to disable the auto-dispose behavior and keep the provider alive, even if it's not being actively used. To do this, you can use the `@Riverpod` annotation and set the `keepAlive` parameter to true:

```dart
@Riverpod(keepAlive: true)
int number(NumberRef ref) => 0;
```

### Family

Riverpod's code generation supports defining family providers and notifiers with multiple parameters, including named parameters and positional parameters.

To define a family provider, you can specify the parameters in the function:

```dart title="Family Provider with Named Parameters"
@riverpod
String foo(FooRef ref, int a, {required int b, int? c, int d = 0}) {
  return 'I am a family provider with named parameters';
}
```

To define a family notifier, you can specify the parameters in the `build` method:

```dart title="Family Notifier with Positional Parameters:"
@riverpod
class Bar extends _$Bar {
  @override
  String build(int a, [int? b, int c = 0]) {
    return 'I am a family notifier with position parameters';
  }
}
```

## Generator configuration

[riverpod_generator] has a default naming convention for the generated providers: the provider name will have the suffix `Provider`. However, you can customise the prefix and suffix of the provider names to better align with your project's naming conventions.

To configure the naming convention for the generated providers, you can create a `build.yaml` file in the root of your project and specify prefix and suffix for the provider names.

For example, to change the provider name suffix from `Provider` to `Pod`, you can add the following configuration to your build.yaml file:

```yaml title="build.yaml"
targets:
  $default:
    builders:
      riverpod_generator:
        options:
          provider_name_prefix: ""
          provider_family_name_prefix: ""
          provider_name_suffix: "Pod"
          provider_family_name_suffix: "Pod"
```

With this configuration, the following provider declaration will result in a provider named `numberPod` instead of the default `numberProvider`.

```dart
@riverpod
int number(NumberRef ref) {
  return 0;
}
```

## Flutter Riverpod Snippets

[Flutter Riverpod Snippets] is a Visual Studio Code extension that provides a set of handy code snippets to create providers and notifiers.

The below GIFs demonstrate how to use the extension to create a `Provider` and a `NotifierProvider`:

<img src={ProviderSnippetDemo} alt="Provider Snippet Demo" class="screenshot"> </img>
<img src={NotifierSnippetDemo} alt="Notifier Snippet Demo" class="screenshot"> </img>

The table below summarises the snippets for creating providers and notifiers with code generation:

| Snippet                      | Provider/Notifier                       | Keep Alive |
| ---------------------------- | --------------------------------------- |:----------:|
| riverpod                     | Provider                                |     ❌     |
| riverpodKeepAlive            | Provider                                |     ✅     |
| riverpodFuture               | FutureProvider                          |     ❌     |
| riverpodFutureKeepAlive      | FutureProvider                          |     ✅     |
| riverpodStream               | StreamProvider                          |     ❌     |
| riverpodStreamKeepAlive      | StreamProvider                          |     ✅     |
| riverpodClass                | Notifier & NotifierProvider             |     ❌     |
| riverpodClassKeepAlive       | Notifier & NotifierProvider             |     ✅     |
| riverpodAsyncClass           | AsyncNotifier & AsyncNotifierProvider   |     ❌     |
| riverpodAsyncClassKeepAlive  | AsyncNotifier & AsyncNotifierProvider   |     ✅     |
| riverpodStreamClass          | StreamNotifier & StreamNotifierProvider |     ❌     |
| riverpodStreamClassKeepAlive | StreamNotifier & StreamNotifierProvider |     ✅     |

## Conclusion

Let's summarise the key topic we've covered:

- Setting up Riverpod with code generation
- Using [build_runner] to generate files
- Organising generated files
- Syntax for defining providers and notifiers with code generation
- Configuring the naming convention for generated providers
- Using the Flutter Riverpod Snippets extension

If you haven't already tried using Riverpod with code generation, I highly recommend giving it a try. The improved developer experience can make a significant difference in your Riverpod-based projects.

<!-- Link -->

[riverpod_generator]: https://pub.dev/packages/riverpod_generator
[riverpod_annotation]: https://pub.dev/packages/riverpod_annotation
[build_runner]: https://pub.dev/packages/build_runner
[json_serializable]: https://pub.dev/packages/json_serializable
[freezed]: https://pub.dev/packages/freezed
[Explorer File Nesting]: https://code.visualstudio.com/updates/v1_67#_explorer-file-nesting
[File Nesting Rules]: https://www.jetbrains.com/help/idea/file-nesting-dialog.html
[Provider]: https://pub.dev/documentation/riverpod/latest/riverpod/Provider-class.html
[FutureProvider]: https://pub.dev/documentation/riverpod/latest/riverpod/FutureProvider-class.html
[StreamProvider]: https://pub.dev/documentation/riverpod/latest/riverpod/StreamProvider-class.html
[Notifier]: https://pub.dev/documentation/riverpod/latest/riverpod/Notifier-class.html
[NotifierProvider]: https://pub.dev/documentation/riverpod/latest/riverpod/NotifierProvider.html
[AsyncNotifier]: https://pub.dev/documentation/riverpod/latest/riverpod/AsyncNotifier-class.html
[AsyncNotifierProvider]: https://pub.dev/documentation/riverpod/latest/riverpod/AsyncNotifierProvider.html
[StreamNotifier]: https://pub.dev/documentation/riverpod/latest/riverpod/StreamNotifier-class.html
[StreamNotifierProvider]: https://pub.dev/documentation/riverpod/latest/riverpod/StreamNotifierProvider.html
[StateProvider]: https://pub.dev/documentation/riverpod/latest/riverpod/StateProvider-class.html
[ChangeNotifier]: https://api.flutter.dev/flutter/foundation/ChangeNotifier-class.html
[ChangeNotifierProvider]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/ChangeNotifierProvider-class.html
[StateNotifier]: https://pub.dev/documentation/riverpod/latest/riverpod/StateNotifier-class.html
[StateNotifierProvider]: https://pub.dev/documentation/riverpod/latest/riverpod/StateNotifierProvider-class.html
[Flutter Riverpod Snippets]: https://marketplace.visualstudio.com/items?itemName=robert-brunhage.flutter-riverpod-snippets
