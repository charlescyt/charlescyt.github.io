---
slug: riverpod-basics
title: Riverpod Basics
authors: [charles]
tags: [flutter, riverpod, state management]
keywords: [flutter, riverpod, state management, provider, notifier]
image: /img/covers/riverpod-basics.png
description: Riverpod is a state management library for Dart and Flutter applications. It offers exceptional flexibility, providing features such as provider-to-provider interaction and customisable lifecycles for individual providers. Riverpod is particularly useful for handling and caching asynchronous operations such as fetching data from an API.
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ProviderSyntax from './provider-syntax.png';
import NotifierSyntax from './notifier-syntax.png';

<img src={useBaseUrl('/img/covers/riverpod-basics.png')} alt="Cover" class="cover"> </img>

Riverpod is a state management library for Dart and Flutter applications. It offers exceptional flexibility, providing features such as provider-to-provider interaction and customisable lifecycles for individual providers. Riverpod is particularly useful for handling and caching asynchronous operations such as fetching data from an API. In this article, we will explore the basic concepts of Riverpod.

<!-- truncate -->

At the time of writing, the version of Riverpod and related packages are as follows:

| Package               | Version |
| --------------------- | ------- |
| [riverpod]            | 2.5.1   |
| [flutter_riverpod]    | 2.5.1   |
| [hooks_riverpod]      | 2.5.1   |
| [riverpod_annotation] | 2.3.5   |
| [riverpod_generator]  | 2.4.0   |
| [riverpod_lint]       | 2.3.10  |

## Which package to use?

What's the difference between [riverpod], [flutter_riverpod], and [hooks_riverpod]?

- [riverpod]: provides the core functionality of Riverpod. It doesn't depend on Flutter.
- [flutter_riverpod]: re-exports [riverpod] and provides integration with Flutter.
- [hooks_riverpod]: re-exports [flutter_riverpod] and provides integration with [flutter_hooks].

To add riverpod to your project, run the following command:

<Tabs groupId="environment" defaultValue="flutter">
<TabItem value="dart" label="Dart">
```shell
dart pub add riverpod
```
</TabItem>

<TabItem value="flutter" label="Flutter">
```shell
flutter pub add flutter_riverpod
```
</TabItem>

<TabItem value="flutter hooks" label="Flutter(with flutter_hooks)">
```shell
flutter pub add hooks_riverpod
flutter pub add flutter_hooks
```
</TabItem>
</Tabs>

Riverpod provides a code generation tool to reduce boilerplate code and enhance developer experience.

- [riverpod_annotation]: provides annotations for [riverpod_generator].
- [riverpod_generator]: generates code for providers and notifiers.
- [build_runner]: provides a concrete way of generating files using Dart code.

To use the code generation tool, run the following command:

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

:::tip

It is recommended to use code generation with Riverpod to reduce boilerplate code and enhance developer experience.

:::

[riverpod_lint] is a package that provides additional lint rules and quick fixes specific to Riverpod.

To use [riverpod_lint], run the following command:

<Tabs groupId="environment" defaultValue="flutter">
<TabItem value="dart" label="Dart">
```shell
dart pub add dev:custom_lint
dart pub add dev:riverpod_lint
```
</TabItem>

<TabItem value="flutter" label="Flutter">
```shell
flutter pub add dev:custom_lint
flutter pub add dev:riverpod_lint
```
</TabItem>
</Tabs>

Remember to enable [custom_lint]  in your `analysis_options.yaml` file.

```yaml title="analysis_options.yaml"
analyzer:
  plugins:
    - custom_lint
```

:::tip

It is recommended to use [riverpod_lint] to ensure that you are following best practices when using Riverpod.

:::

To keep things simple, we will not be using the code generation tool in this article.

### A deeper look into the packages

:::info

You could skip this section if you are not interested in the details of the packages.

:::

If we look at the source code of the [flutter_riverpod] package.

```dart title="flutter_riverpod/lib/flutter_riverpod.dart
export 'package:riverpod/riverpod.dart';

export 'src/change_notifier_provider.dart';
export 'src/consumer.dart';
export 'src/framework.dart' hide ProviderScopeState;
```

It re-exports [riverpod] along with 3 additional files:

- `change_notifier_provider.dart`: adds support for `ChangeNotifier`, a built-in class in the Flutter framework for simple state management.
- `consumer.dart`: adds `ConsumerWidget`, `ConsumerStatefulWidget`, and `Consumer` which are widgets that can interact with providers.
- `framework.dart`: adds `ProviderScope` which stores the state of the providers.

Let's also have a look at the [hooks_riverpod] package.

```dart title="hooks_riverpod/lib/hooks_riverpod.dart
export 'package:flutter_riverpod/flutter_riverpod.dart';

export 'src/consumer.dart';
```

It re-exports [flutter_riverpod] along with 1 additional file:

- `consumer.dart`: adds `HookConsumerWidget`, `StatefulHookConsumerWidget` and `HookConsumer` which are widgets that can both use hooks and interact with providers.

:::info

Notice that [hooks_riverpod] does not re-export [flutter_hooks] meaning that you need to add it separately to your `pubspec.yaml` file.

:::

## ProviderContainer and ProviderScope

[ProviderContainer] and [ProviderScope] are used to store the state of the providers. In a Flutter application,  you should wrap the root widget of your application with a `ProviderScope`.

<Tabs groupId="environment" defaultValue="flutter">
<TabItem value="dart" label="Dart">
```dart
Future<void> main() async {
  final container = ProviderContainer();
  try {
    final result = await container.read(futureProvider.future);
    ...
  } finally {
    container.dispose();
  }
}
```
</TabItem>

<TabItem value="flutter" label="Flutter">
```dart
void main() {
  runApp(ProviderScope(child: MyApp()));
}
```
</TabItem>
</Tabs>

## Providers and Notifiers

Providers are used to cache and provide objects to other providers or widgets. Notifiers are similar to providers, except that they expose a public api to mutate the state.

There are several types of providers and notifiers in Riverpod. Don't worry if you are confused by the different types of providers and notifiers. We will go through each of them and explain when to use them.

- [Provider]
- [FutureProvider]
- [StreamProvider]
- [Notifier] & [NotifierProvider] (an **stateful** version of Provider)
- [AsyncNotifier] & [AsyncNotifierProvider] (an **stateful** version of FutureProvider)
- [StreamNotifier] & [StreamNotifierProvider] (an **stateful** version of StreamProvider)
- [StateProvider] (discouraged)
- [ChangeNotifier] & [ChangeNotifierProvider] (discouraged)
- [StateNotifier] & [StateNotifierProvider] (discouraged)

Syntax to define a provider:

- Provider should be declared globally with the `final` keyword.
- The provider type could be `Provider`, `FutureProvider`, or `StreamProvider`.
- The optional modifier could be `autoDispose`, `family` or both.
- The provider should be initialised with a function that returns the initial state. The `Ref` object is available in the function to interact with other providers. It is recommended to use `Ref.watch` instead of `Ref.read` and `Ref.listen` in the function.

<img src={ProviderSyntax} alt="Provider Syntax" class="screenshot"> </img>

Syntax to define a notifier and its provider:

- Define a notifier class that extends either `Notifier`, `AsyncNotifier` or `StreamNotifier` (and their modifier variants) with the state type as the type argument.
- The notifier class should override the `build` method to return the initial state. Note that the `Ref` object is available inside the `Notifier` class. The `build` method is equivalent to the initialise function in a provider. It is recommended to use `Ref.watch` instead of `Ref.read` and `Ref.listen` in the `build` method.
- Define a public method to mutate the state. Generally, the method should return `void` or `Future<void>`.
- The notifier class should not have any constructor.
- The notifier class should not have any public properties.
- Define a notifier provider with the notifier class and the state type as the type arguments.
- The notifier provider should be declared globally with the `final` keyword.
- The optional modifier could be `autoDispose`, `family` or both. Note that the modifiers and the notifier type should match.
- The notifier provider should be initialised with a function that returns an instance of the notifier class. Typically a constructor tear-off is used.

<img src={NotifierSyntax} alt="Notifier Syntax" class="screenshot"> </img>

Manually defining providers and notifiers can be cumbersome and error-prone. If you are using vscode, consider using [Flutter Riverpod Snippets] to define providers and notifiers with code snippets.

### Provider

`Provider` is the most basic provider in Riverpod. It is used to provide an object (initialise synchronously) to others providers or widgets.

Below is an example to define a `Provider`:

```dart
final fooProvider = Provider<String>((ref) => 'foo');
```

Let's say we have a `Repository` class that depends on a `Dependency` class. We can define a dependencyProvider and a repositoryProvider using the `Provider` class. In the create function of the repositoryProvider, we can access the `Dependency` object using the `Ref` object.

```dart
final dependencyProvider = Provider<Dependency>((ref) => Dependency());

final repositoryProvider = Provider<Repository>((ref) {
  final dependency = ref.watch(dependencyProvider);
  return Repository(dependency);
});
```

:::tip

To expose a public api to mutate the state, consider using a [Notifier and NotifierProvider](#notifier-and-notifierprovider) instead.

:::

### FutureProvider

Use `FutureProvider` when the provider is expected to be initialised asynchronously with a `Future`. It is useful for
caching asynchronous operations such as fetching data from an API.

Note that Riverpod will convert the `Future` into an `AsyncValue` to represent the state of the asynchronous operation:

- `AsyncData`: The asynchronous operation has completed successfully and the data is available.
- `AsyncLoading`: The asynchronous operation is in progress.
- `AsyncError`: The asynchronous operation has completed with an error.

Below is an example to define a `FutureProvider` that fetches a list of users from an API using the [http] package:

```dart
final usersProvider = FutureProvider<List<User>>((ref) async {
  final uri = Uri.https('jsonplaceholder.typicode.com', 'users');
  final response = await http.get(uri);
  final json = jsonDecode(response.body) as List<dynamic>;
  return json.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
});

class UsersWidget extends ConsumerWidget {
  const UsersWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Note that ref.watch(usersProvider) returns an AsyncValue<List<User>>.
    final AsyncValue<List<User>> asyncUsers = ref.watch(usersProvider);

    // Here we use a switch expression and pattern matching to
    // build the ui based on the state of the AsyncValue.
    return switch (asyncUsers) {
      AsyncData(value: final users) => Text('Users: $users'),
      AsyncError(:final error) => Text('Error: $error'),
      _ => const CircularProgressIndicator(),
    };
  }
}
```

:::info

Pattern matching is a new feature introduced in Dart 3 that allows you to match a given value with a set of patterns. For more information, check out the [Patterns] documentation.

:::

Sometimes it is useful to combine multiple `FutureProvider`s into a single `FutureProvider`. This can be achieved by obtaining the `Future` from another `FutureProvider` using `await ref.watch(futureProvider.future)`:

```dart
final fooProvider = FutureProvider<Foo>((ref) async { ... });

final barProvider = FutureProvider<Bar>((ref) async {
  final foo = await ref.watch(fooProvider.future);
  return Bar(foo);
});
```

:::tip

To expose a public api to mutate the state, consider using an [AsyncNotifier and AsyncNotifierProvider](#asyncnotifier-and-asyncnotifierprovider) instead.

:::

### StreamProvider

Use `StreamProvider` when the provider is expected to be initialised asynchronously with a `Stream`. It is useful for caching asynchronous operations such as listening to a stream of data from a database.

Similar to `FutureProvider`, Riverpod will convert the `Stream` into an `AsyncValue` to represent the state of the asynchronous operation:

Below is an example to define a `StreamProvider`:

```dart
final timerProvider = StreamProvider<int>((ref) {
  return Stream.periodic(const Duration(seconds: 1), (x) => x);
});
```

:::tip

To expose a public api to mutate the state, consider using a [StreamNotifier and StreamNotifierProvider](#streamnotifier-and-streamnotifierprovider) instead.

:::

### NotifierProvider

`Notifier` is a class to manage a state and centralise the logic of mutating the state.

Below is an example to define a `Notifier` and `NotifierProvider`:

```dart
// Define a Counter class that extends Notifier<int>.
// The Counter class holds a state of type int.
class Counter extends Notifier<int> {
  // Override the build method to return the initial state.
  // The Ref object is available inside the Notifier class.
  @override
  int build() => 0;

  // A public method to mutate the Counter's state.
  void increment() => state++;
}

// Define a NotifierProvider for other providers and widgets to
// interact with the Notifier and its state.
final counterProvider = NotifierProvider<Counter, int>(Counter.new);
```

:::tip

If it is not required to expose a public api to mutate the state, consider using a [Provider](#provider) instead.

:::

### AsyncNotifierProvider

Use `AsyncNotifier` and `AsyncNotifierProvider` to manage the state of an asynchronous operation (Future) and expose public apis to mutate the state. Similar to `FutureProvider`, Riverpod will convert the `Future` into an `AsyncValue` to represent the state of the asynchronous operation.

Below is an example to define an `AsyncNotifier` and `AsyncNotifierProvider`:

```dart
// Define a UsersNotifier class that extends AsyncNotifier<List<User>>.
class UsersNotifier extends AsyncNotifier<List<User>> {
  @override
  Future<List<User>> build() async {
    final uri = Uri.https('jsonplaceholder.typicode.com', 'users');
    final response = await http.get(uri);
    final json = jsonDecode(response.body) as List<dynamic>;
    return json.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
  }

  // A method to mutate the UsersNotifier state.
  Future<void> addUser(User user) async {
    state = const AsyncLoading();
    // Here we assign the updated list of users to the state using
    // AsyncValue.guard.
    state = await AsyncValue.guard(() async {
      final uri = Uri.https('jsonplaceholder.typicode.com', 'users');
      // Suppose the post request returns the updated list of users.
      final response = await http.post(
        uri,
        headers: <String, String>{ 'Content-Type': 'application/json; charset=UTF-8'},
        body: jsonEncode(user.toJson()),
      );
      final json = jsonDecode(response.body) as List<dynamic>;
      return json.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
    });
  }
}

// Define an AsyncNotifierProvider for other providers and widgets to
// interact with the UsersNotifier and its state.
final usersProvider = AsyncNotifierProvider<UsersNotifier, List<User>>(UsersNotifier.new);
```

:::info

`AsyncValue.guard` is a utility function that catches errors thrown by the asynchronous operation and returns an `AsyncError` instead of throwing an exception.

:::

:::tip

If it is not required to expose a public api to mutate the state, consider using a [FutureProvider](#futureprovider) instead.

:::

### StreamNotifierProvider

Use `StreamNotifier` and `StreamNotifierProvider` to manage the state of an asynchronous operation (Stream) and expose public apis to mutate the state. Similar to `StreamProvider`, Riverpod will convert the `Stream` into an `AsyncValue` to represent the state of the asynchronous operation.

Below is an example to define a `StreamNotifier` and `StreamNotifierProvider`:

```dart
// Define a Provider to provide a CollectionReference to the post collection in Firestore.
final postCollectionRefProvider = Provider<CollectionReference<Post>>(
  (ref) => FirebaseFirestore.instance.collection('post').withConverter<Post>(
        fromFirestore: (snapshot, _) => Post.fromJson(snapshot.data()!),
        toFirestore: (post, _) => post.toJson(),
      ),
);

// Define a PostsNotifier that extends StreamNotifier<List<Post>>.
class PostsNotifier extends StreamNotifier<List<Post>> {
  @override
  Stream<List<Post>> build() {
    final postCollectionRef = ref.watch(postCollectionRefProvider);
    return postCollectionRef
        .snapshots()
        .map((snapshot) => snapshot.docs.map((doc) => doc.data()).toList());
  }

  // A method to mutate the PostsNotifier state.
  Future<void> addPost(Post post) async {
    final postCollectionRef = ref.read(postCollectionRefProvider);
    await postCollectionRef.add(post);
  }
}

// Define a StreamNotifierProvider for other providers and widgets to
// interact with the PostsNotifier and its state.
final postsProvider = StreamNotifierProvider<PostsNotifier, List<Post>>(PostsNotifier.new);
```

:::tip

If it is not required to expose a public api to mutate the state, consider using a [StreamProvider](#streamprovider) instead.

:::

### StateProvider

:::warning

You should probably skip this section since it is discouraged to use StateProvider.

:::

`StateProvider` is a simplified version of `NotifierProvider` that doesn't require to define a `Notifier` class. While
`Notifier` exposes public methods to mutate the state, `StateProvider` allows its state to be modified externally which is why its usage is discouraged. It is recommended to use `Notifier` and `NotifierProvider` instead.

Below is an example of using `StateProvider` to define a counter:

```dart
final counterProvider = StateProvider<int>((ref) => 0);

class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final int counter = ref.watch(counterProvider);
    return Column(
      children: [
        Text('Counter: $counter'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).state++,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

Notice that the logic for modifying the counter is defined in the widget itself instead of being centralised in a `Notifier` class.

### ChangeNotifierProvider

:::warning

You should probably skip this section since it is discouraged to use ChangeNotifier and ChangeNotifierProvider.

:::

`ChangeNotifier` is a built-in class in the Flutter framework that provides a simple way to manage state. It is discouraged to use `ChangeNotifier` and `ChangeNotifierProvider` in Riverpod since it promotes **mutability**. Consider using `Notifier` and `NotifierProvider` instead.

Below is an example of using `ChangeNotifier` and `ChangeNotifierProvider` to define a counter with an increment method:

```dart
class Counter extends ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

final counterProvider = ChangeNotifierProvider<Counter>((ref) => Counter());

class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final Counter counter = ref.watch(counterProvider);
    return Column(
      children: [
        Text('Counter: ${counter.count}'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider).increment(),
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

:::info

`ChangeNotifier` is a built-in class in the Flutter framework and thus `ChangeNotifierProvider` is only available in the `flutter_riverpod` and `hooks_riverpod` packages.

:::

### StateNotifierProvider

:::warning

You should probably skip this section since it is discouraged to use StateNotifier and StateNotifierProvider.

:::

`StateNotifier` is a class from the [state_notifier] package. It is designed to replace `ChangeNotifier` and promotes **immutability**. It is recommended to use `Notifier` & `NotifierProvider` instead.

Below is an example of using `StateNotifier` and `StateNotifierProvider` to define a counter with an increment method:

```dart
class Counter extends StateNotifier<int> {
  // Set the initial state to 0.
  Counter() : super(0);

  void increment() => state++;
}

final counterProvider = StateNotifierProvider<Counter, int>((ref) => Counter());

class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final int counter = ref.watch(counterProvider);
    return Column(
      children: [
        Text('Counter: $counter'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).increment(),
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

### Provider Modifiers

#### AutoDispose

By default, providers persist even when they are no longer being watched or listened to. This can be a desirable behaviour when you want to maintain the state of the provider throughout the lifetime of the application.

However, in most cases, it is preferable to dispose of the provider when it is no longer needed. To achieve this, you can use the `autoDispose` modifier, which ensures that the provider is automatically disposed of when it is no longer being subscribed to.

Below is an example of defining an `Notifier` and `NotifierProvider` with the `autoDispose` modifier:

```dart
// Note that the counter extends AutoDisposeNotifier instead of Notifier.
class AutoDisposeCounter extends AutoDisposeNotifier<int> {
  @override
  int build() => 0;

  void increment() => state++;
}

// To apply the autoDispose modifier to the provider, add `.autoDispose` between
// the provider type and the type argument.
final autoDisposeCounterProvider = NotifierProvider.autoDispose<AutoDisposeCounter, int>(AutoDisposeCounter.new);
```

#### Family

The `family` modifier is useful for creating multiple instances of the same provider with unique parameters. Each instance of the provider is identified by the family parameter and its state is isolated from other instances.

Typically, the family parameter would be a simple, primitive type such as `int` or `String`. If multiple parameters are required, consider using code generation or `Record`s.

:::info

Record is a new feature introduced in Dart 3 that allows you to group multiple objects into a single object. For more information, check out the [Records] documentation.

:::

Below is an example of defining a `FutureProvider` with the `family` modifier:

```dart
// To apply the family modifier to the provider, add `.family` between
// the provider type and the type argument.
final userProvider = FutureProvider.family<User, int>((ref, id) async {
  final uri = Uri.https('jsonplaceholder.typicode.com', 'users/$id');
  final response = await http.get(uri);
  final json = jsonDecode(response.body) as Map<String, dynamic>;
  return User.fromJson(json);
});

// Note that we have to specify the family parameter when
// referring to the family provider.
final user1 = ref.watch(userProvider(1));
final user2 = ref.watch(userProvider(2));
```

:::warning

Using `family` without `autoDispose` may lead to memory leaks. Consider using `autoDispose` together to avoid memory leaks.

:::

Below is an example of defining a `FutureProvider` with the `autoDispose` and `family` modifiers:

```dart
// Note that we can add both the autoDispose and family modifiers to the provider.
final userProvider = FutureProvider.autoDispose.family<User, int>((ref, id) async {
  final uri = Uri.https('jsonplaceholder.typicode.com', 'users/$id');
  final response = await http.get(uri);
  final json = jsonDecode(response.body) as Map<String, dynamic>;
  return User.fromJson(json);
});
```

### Which provider and notifier to use?

The table below summarises the different types of providers and notifiers available in Riverpod and when to use them:

| Provider/Notifier                       | Initialisation        | Mutation method |
| --------------------------------------- | --------------------- |:---------------:|
| Provider                                | Synchronous           |       ❌        |
| FutureProvider                          | Asynchronous (Future) |       ❌        |
| StreamProvider                          | Asynchronous (Stream) |       ❌        |
| Notifier & NotifierProvider             | Synchronous           |       ✅        |
| AsyncNotifier & AsyncNotifierProvider   | Asynchronous (Future) |       ✅        |
| StreamNotifier & StreamNotifierProvider | Asynchronous (Stream) |       ✅        |

Note that when using **modifiers** with `NotifierProvider`, `AsyncNotifierProvider` and `StreamNotifierProvider`, you should use the corresponding notifier type. The following table summarises the `NotifierProvider`s and their corresponding `Notifier`s when using modifiers:

| Provider                            | Notifier                  | AutoDispose | Family |
| ----------------------------------- | ------------------------- |:-----------:|:------:|
| NotifierProvider                    | Notifier                  |     ❌      |   ❌   |
| NotifierProvider.autoDispose        | AutoDisposeNotifier       |     ✅      |   ❌   |
| NotifierProvider.family             | FamilyNotifier            |     ❌      |   ✅   |
| NotifierProvider.autoDispose.family | AutoDisposeFamilyNotifier |     ✅      |   ✅   |

:::tip

If you find it confusing to choose between the different providers and notifiers, consider using code generation, which can choose the appropriate provider and notifier for you. Check out the [riverpod_generator] package for more information.

:::

## Widget-Provider interaction

A widget can interact with providers by using a `WidgetRef` object. There are several ways to access `WidgetRef` in a widget:

- `ConsumerWidget`: A `StatelessWidget` that can interact with providers. The `WidgetRef` object is available in the `build` method.
- `ConsumerStatefulWidget` and `ConsumerState`: A `StatefulWidget` that can interact with providers. The `WidgetRef` object is available in the `ConsumerState` class.
- `Consumer`: An utility widget that can interact with providers without defining a `ConsumerWidget` subclass. The `WidgetRef` object is available in the `builder` callback.

Let's say we want to create a simple counter app with the following requirements:

- The counter starts at 0.
- Display the current counter value as a text.
- Increment the counter when a button is pressed.
- Show a snackbar when the counter reaches 10.

We can achieve this by defining a `Counter` class that extends `Notifier<int>`.

```dart
class Counter extends Notifier<int> {
  @override
  int build() => 0;

  void increment() => state++;
}

final counterProvider = NotifierProvider<Counter, int>(Counter.new);
```

And using

- `WidgetRef.watch(counterProvider)` to watch the `counterProvider` and rebuild the widget when the provider's state changes.
- `WidgetRef.read(counterProvider.notifier)` to read the `Notifier` associated with the `counterProvider` and invoke the `increment` method when the button is pressed.
- `WidgetRef.listen(counterProvider)` to listen to the `counterProvider` and show a snackbar when the counter reaches 10.

<Tabs>
<TabItem value="consumer widget" label="Consumer Widget">

```dart
// The WidgetRef object is available in the build method of the ConsumerWidget.
class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Use WidgetRef.watch to watch a provider and
    // rebuild the widget when the provider's state changes.
    final int counter = ref.watch(counterProvider);

    // Use WidgetRef.listen to listen to a provider and
    // perform side effects when the provider's state changes.
    ref.listen<int>(counterProvider, (int? previous, int next) {
      if (next == 10) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Counter reached 10')),
        );
      }
    });

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text('Counter: $counter'),
          ElevatedButton(
            // Use WidgetRef.read to read a provider's notifier and
            // perform side effects when the button is pressed.
            // Note that WidgetRef.read will not rebuild the widget.
            onPressed: () => ref.read(counterProvider.notifier).increment(),
            child: const Text('Increment'),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>

<TabItem value="stateful consumer widget" label="Stateful Consumer Widget">

```dart
// The WidgetRef object is available in the ConsumerState class.
class CounterWidget extends ConsumerStatefulWidget {
  const CounterWidget({super.key});

  @override
  ConsumerState<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends ConsumerState<CounterWidget> {
@override
  Widget build(BuildContext context) {
    // Use WidgetRef.watch to watch a provider and
    // rebuild the widget when the provider's state changes.
    // Note that the WidgetRef object is available in the ConsumerState class.
    final int counter = ref.watch(counterProvider);

    // Use WidgetRef.listen to listen to a provider and
    // perform side effects when the provider's state changes.
    ref.listen<int>(counterProvider, (int? previous, int next) {
      if (next == 10) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Counter reached 10')),
        );
      }
    });

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text('Counter: $counter'),
          ElevatedButton(
            // Use WidgetRef.read to read a provider's notifier and
            // perform side effects when the button is pressed.
            // Note that WidgetRef.read will not rebuild the widget.
            onPressed: () => ref.read(counterProvider.notifier).increment(),
            child: const Text('Increment'),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>
<TabItem value="consumer" label="Consumer">

```dart
class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<int>(counterProvider, (int? previous, int next) {
      if (next == 10) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Counter reached 10')),
        );
      }
    });

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          // The WidgetRef object is available in the builder callback.
          // This will only rebuild the Text widget when
          // the provider's state changes.
          Consumer(
            builder: (BuildContext context, WidgetRef ref, Widget? child) {
              // Note that we are using the WidgetRef object from
              // the Consumer's builder callback.
              final int counter = ref.watch(counterProvider);
              return Text('Counter: $counter');
            },
          ),
          ElevatedButton(
            onPressed: () => ref.read(counterProvider.notifier).increment(),
            child: const Text('Increment'),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>
</Tabs>

:::info

There are also `HookConsumerWidget`, `StatefulHookConsumerWidget` and `HookConsumer` from the `hooks_riverpod` package that allow you to use hooks and interact with providers in a widget.

:::

## Provider-Provider interaction

Provider-Provider interaction is a powerful feature in Riverpod that allows providers to interact with other providers. This is useful when you want to create a provider that depends on another provider. A provider can interact with other providers by using a `Ref` object. The `Ref` object is available in the provider's create function and inside the notifier class.

Suppose we have a `todosProvider` that fetches a list of todos from an API, and we want to show only the completed todos. This can be achieved by filtering the completed todos directly within the widget.

```dart
final todosProvider = FutureProvider<List<Todo>>((ref) async {
  final Uri url = Uri.https('jsonplaceholder.typicode.com', '/todos');
  final http.Response response = await http.get(url);
  final List<dynamic> json = jsonDecode(response.body) as List<dynamic>;
  return json.map((e) => Todo.fromJson(e as Map<String, dynamic>)).toList();
});

class FilteredTodosWidget extends ConsumerWidget {
  const FilteredTodosWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<List<Todo>> asyncTodos = ref.watch(todosProvider);
    switch (asyncTodos) {
      case AsyncData(value: final todos):
        final List<Todo> completedTodos = todos.where((todo) => todo.isCompleted).toList();
        return ListView.builder(
          itemCount: completedTodos.length,
          itemBuilder: (BuildContext context, int index) => TodoCard(completedTodos[index]),
        );
      case AsyncError(:final error):
        return Text('Error: $error');
      case _:
        return const CircularProgressIndicator();
    }
  }
}
```

However, this approach has a few drawbacks:

- Logic coupling: The filter logic is tightly coupled with the widget, which makes it difficult to test and maintain.
- Lack of caching: The filtered todos are not cached, meaning that the filter operation is executed every time the widget rebuilds.
- Code duplication: If we want to show the completed todos in another widget, we have to duplicate the filter logic.

A better approach is to create a `completedTodosProvider` that encapsulates the filtering logic, caches the filtered todos and allows you to reuse it across multiple widgets.

```dart
// Define a completedTodosProvider that encapsulates the filtering logic.
final completedTodosProvider = FutureProvider<List<Todo>>((ref) async {
  final List<Todo> todos = await ref.watch(todosProvider.future);
  return todos.where((todo) => todo.isCompleted).toList();
});

// In the FilteredTodosWidget, we can now watch the completedTodosProvider
// instead of the todosProvider.
final AsyncValue<List<Todo>> asyncCompletedTodos = ref.watch(completedTodosProvider);
```

## Ref

[Ref] is an object that allows providers to interact with other providers and their own lifecycle. It is available in

- The create function of a `Provider`.
- The `Notifier` class.

[AutoDisposeRef] is a subclass of `Ref` and it is available in

- The create function of an `AutoDisposeProvider`.
- The `AutoDisposeNotifier` class.

It has an additional `keepAlive` method that keeps the provider alive even when it is no longer being subscribed to.

### Ref.watch

[Ref.watch] is a method that allows a provider to **depend on** another provider. It returns the current state of the watched provider and automatically recomputes the dependent provider's state whenever the watched provider's state changes. This allows you to create provider compositions and derive new state from existing providers.

Note that `Ref.watch` can only watch **always-alive** providers while `AutoDisposeRef.watch` can watch both **auto-dispose** and **always-alive** providers. This implies that always-alive providers should not depend on auto-dispose providers. This is because auto-dispose providers are designed to be short-lived and automatically disposed of when they are no longer being subscribed to. If an always-alive provider depends on an auto-dispose provider, it would prevent the auto-dispose provider from being disposed which defeats the purpose of using auto-dispose providers.

Typically, you would use the `Ref.watch` method to access the state of another provider in:

- The create function of a provider.
- The `build` method of a notifier.

```dart title="Using Ref.watch in a Provider"
final todosProvider = Provider<List<Todo>>((ref) { ... });

final completedTodosProvider = Provider<List<Todo>>((ref) {
  final List<Todo> todos = ref.watch(todosProvider);
  return todos.where((todo) => todo.isCompleted).toList();
});
```

### Ref.read

[Ref.read] is a method that allows a provider to **access** the state of another provider without subscribing to it. Unlike `Ref.watch`, `Ref.read` does not automatically recompute the provider's state when the read provider's state changes. This is useful when you only need to access the state of another provider once and do not need to listen to changes.

Usually, you would use the `Ref.read` method within the mutation methods of a notifier to access the necessary dependencies without triggering unnecessary recomputation within

```dart title="Using Ref.read in a Notifier"
class TodosNotifier extends AsyncNotifier<List<Todo>> {
  @override
  Future<List<Todo>> build() async { ... }

  Future<void> addTodo(Todo todo) async {
    final TodoRepository repository = ref.read(todoRepositoryProvider);
    final List<Todo> updatedTodos = await repository.add(todo);
    state = AsyncData(updatedTodos);
  }
}
```

### Ref.listen

[Ref.listen] is a method that allows a provider to **monitor** another provider. It is similar to `Ref.watch`, but it only triggers a callback function when the watched provider's state changes, rather than automatically recomputing the dependent provider's state. This is useful when you need to perform side effects based on the watched provider's state without updating the dependent provider's state.

Similar to `Ref.watch`, `Ref.listen` can only listen to **always-alive** providers while [AutoDisposeRef.listen] can listen to both **auto-dispose** and **always-alive** providers.

In general, it is recommended to use `Ref.watch` instead of `Ref.listen` to promote declarative over imperative programming.

Similarly, you would use the `Ref.listen` method to perform side effects based on the watched provider's state in:

- The create function of a provider.
- The `build` method of a notifier.

```dart title="Using Ref.listen in a provider"
final fooProvider = Provider<String>((ref) {
  ref.listen<int>(barProvider, (int? previous, int next) {
    // Perform side effects based on the watched provider's state.
    print('Bar provider value changed from $previous to $next');
  });

  ...
});
```

### Ref.invalidate

[Ref.invalidate] is a method that allows a provider to trigger the disposal of another provider and force it to recompute its state in the next frame (if it is being subscribed to) or the next time it is accessed (if it is not being subscribed to). This can be useful in certain scenarios, but it is generally recommended to avoid using `Ref.invalidate` as it promotes a more imperative and less declarative approach to managing state. Instead, consider using `Ref.watch` to automatically recompute the dependent provider's state when the watched provider's state changes.

Note that you can invalidate all the family providers by calling `Ref.invalidate` on the family provider without specifying the family parameter.

```dart title="Using Ref.invalidate to invalidate family providers"
final userProvider = FutureProvider.family<User, int>((ref, id) async { ....});

class FooNotifier extends Notifier<Foo> {
  @override
  Foo build() { ... }

  void method() {
    // Invalidate the family provider with family parameter 1.
    ref.invalidate(userProvider(1));
    // Invalidate all the family providers.
    ref.invalidate(userProvider);
  }
}
```

### Ref.refresh

[Ref.refresh] is similar to `Ref.invalidate` except it immediately invoke `Ref.read` and return the new state after the invalidation. This can be useful when you want to force a provider to recompute its state and immediately access the new state.

```dart title="Using Ref.refresh in a notifier"
class FooNotifier extends Notifier<Foo> {
  @override
  Foo build() { ... };

  void method() {
    final int newBar = ref.refresh(barProvider);
    state = newBar;
  }
}
```

:::tip

Consider using `Ref.invalidate` instead of `Ref.refresh` unless you need to access the new state immediately after the invalidation.

:::

### Ref.exists

[Ref.exists] is a method that allows a provider to check if another provider exists in the current scope. This can be useful when you want the provider to behave differently based on the presence of another provider. Although this can be useful in certain scenarios, it is generally recommended to avoid using `Ref.exists`.

### Ref.listenSelf

[Ref.listenSelf] is similar to `Ref.listen` but it listens to the provider itself.

### Ref.invalidateSelf

[Ref.invalidateSelf] is similar to `Ref.invalidate` but it invalidates the provider itself.

### Ref.notifyListeners

[Ref.notifyListeners] is a method that allows a provider to manually notify its listeners. This can be useful when you want to manually trigger a rebuild of the dependent providers or widgets. Typically, you would use `notifyListeners` when working with providers that manage mutable state, such as the built-in `List` in Dart.

```dart title="Using Ref.notifyListeners in a provider"
class TodosNotifier extends Notifier<List<Todo>> {
  @override
  List<Todo> build() { ... }

  void add1(Todo todo) {
    // This will not notify the listeners.
    state.add(todo);
  }

  void add2(Todo todo) {
    state.add(todo);
    // Manually notify the listeners.
    ref.notifyListeners();
  }

  void add3(Todo todo) {
    // Alternatively, you can assign a new list to the state to notify the listeners.
    state = [...state, todo];
  }
}
```

### Lifecycle methods

There are several lifecycle methods available in the `Ref` class that allow you to perform side effects at different stages of the provider's lifecycle:

- [Ref.onAddListener]: Called when a new listener is added to the provider.
- [Ref.onRemoveListener]: Called when a listener is removed from the provider.
- [Ref.onCancel]: Called when the last listener is removed from the provider.
- [Ref.onResume]: Called when the provider is re-listened to after being cancelled (Paused).
- [Ref.onDispose]: Called when the provider is disposed.

### AutoDisposeRef.keepAlive

[AutoDisposeRef.keepAlive] is a method that allows an `AutoDisposeProvider` to preserve its state even when it is no longer being subscribed to. Note that `keepAlive` returns a `KeepAliveLink` object, which can be used to later invoke the `close` method to cancel the keep-alive behaviour and trigger the disposal of the provider if it is no longer being subscribed to and has on other active `KeepAliveLink`s. This can be particularly useful when you want to customise the disposal behaviour of an `AutoDisposeProvider`.

```dart title="Using AutoDisposeRef.keepAlive in a auto-dispose provider to delay its disposal when it is no longer being subscribed to"
final fooProvider = AutoDisposeProvider<Foo>((ref) {
  // Keep the provider alive even when it is no longer being subscribed to.
  final KeepAliveLink link = ref.keepAlive();
  Timer? timer;

  // When the last listener is removed, restart the timer and
  // close the link after 1 hour.
  ref.onCancel(() {
    timer?.cancel();
    timer = Timer(const Duration(hours: 1), link.close);
  });

  // When the provider is re-subscribed to, cancel the timer.
  ref.onResume(() {
    timer?.cancel();
  });

  // When the provider is disposed, cancel the timer.
  ref.onDispose(() {
    timer?.cancel();
  });

  return Foo();
});
```

To reuse the logic, we can extract it into an extension method:

```dart
extension DelayDispose<T> on AutoDisposeRef<T> {
  void delayDispose(Duration duration) {
    final KeepAliveLink link = keepAlive();
    Timer? timer;

    onCancel(() {
      timer?.cancel();
      timer = Timer(duration, link.close);
    });

    onResume(() {
      timer?.cancel();
    });

    onDispose(() {
      timer?.cancel();
    });
  }
}

// Usage
final fooProvider = AutoDisposeProvider<Foo>((ref) {
  ref.delayDispose(const Duration(hours: 1));
  return Foo();
});
```

:::info

Extension methods are a powerful feature in Dart that allows you to add new functionality to existing classes without modifying their source code. For more information, check out the [Extension Methods] documentation.

:::

## WidgetRef

[WidgetRef] is an object that allows widgets to interact with providers. It is accessible in

- The `build` method of a `ConsumerWidget` or `HookConsumerWidget`.
- The `ConsumerState` class of a `ConsumerStatefulWidget` or `StatefulHookConsumerWidget`.
- The `builder` callback of a `Consumer` or `HookConsumer`.

### WidgetRef.watch

[WidgetRef.watch] is a method that allows a widget to **depend on** a provider. It returns the current state of the watched provider and automatically rebuilds the widget when the watched provider's state changes. This allows you to create reactive widgets that update in response to changes in the provider's state.

It's generally recommended to use `WidgetRef.watch` within the widget's build method or the builder callback of a `Consumer` to create reactive widgets.

- Widget's `build` method.
- `Consumer`'s `builder` callback.

```dart title="Using WidgetRef.watch in a ConsumerWidget"
class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final int counter = ref.watch(counterProvider);
    return Text('Counter: $counter');
  }
}
```

### WidgetRef.read

[WidgetRef.read] is a method that allows a widget to **access** the state of a provider without subscribing to it. Unlike `WidgetRef.watch`, which creates a dependency between the widget and the provider's state, `WidgetRef.read` provides a way to retrieve the provider's state without triggering automatic widget rebuilds when the state changes.

A common use case for `WidgetRef.read` is to perform side effects inside an event handler, such as the onPressed callback of a button.

```dart title="Using WidgetRef.read inside the onPressed callback of a button"
class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final int counter = ref.watch(counterProvider);
    return Column(
      children: [
        Text('Counter: $counter'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).increment(),
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

### WidgetRef.listen

[WidgetRef.listen] is a method that allows a widget to **monitor** to a provider without automatically rebuilding the widget. Unlike `WidgetRef.watch`, which triggers a rebuild when the watched provider's state changes, `WidgetRef.listen` only triggers a callback function when the state changes.

This can be useful when you need to perform side effects in response to changes in the provider's state without updating the widgets.

Similar to `WidgetRef.watch`, `WidgetRef.listen` should be used within

- The widget's `build` method.
- The `builder` callback of a `Consumer`.

```dart title="Using WidgetRef.listen in a ConsumerWidget"
class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<int>(counterProvider, (int? previous, int next) {
      if (next == 10) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Counter reached 10')),
        );
      }
    });

    final int counter = ref.watch(counterProvider);
    return Text('Counter: $counter');
  }
}
```

### WidgetRef.listenManual

[WidgetRef.listenManual] is a method that allows a widget to listen to a provider. Unlike `WidgetRef.listen`, `WidgetRef.listenManual` should be used
outside of the widget's build method.

### WidgetRef.invalidate

[WidgetRef.invalidate] is a method that allows a widget to trigger the disposal of a provider and force it to recompute its state in the next frame (if it is being subscribed to) or the next time it is accessed (if it is not being subscribed to).

Similar to `Ref.invalidate`, you can invalidate all the family providers by calling `WidgetRef.invalidate` on the family provider without specifying the family parameter.

```dart title="Using WidgetRef.invalidate to invalidate family providers"
final userProvider = FutureProvider.family<User, int>((ref, id) async { ....});

class FooWidget extends ConsumerWidget {
  const FooWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Invalidate the family provider with family parameter 1.
    ref.invalidate(userProvider(1));
    // Invalidate all the family providers.
    ref.invalidate(userProvider);
    return ...
  }
}
```

### WidgetRef.refresh

[WidgetRef.refresh] is similar to `WidgetRef.invalidate` except it immediately invoke `WidgetRef.read` and return the new state after the invalidation. This can be useful when you want to force a provider to recompute its state and immediately access the new state.

:::tip

Consider using `WidgetRef.invalidate` instead of `WidgetRef.refresh` unless you need to access the new state immediately after the invalidation.

:::

### WidgetRef.exists

[WidgetRef.exists] is a method that allows a widget to check if a provider exists in the current scope. This can be useful when you want the widget to behave differently based on the presence of a provider. Although this can be useful in certain scenarios, it is generally recommended to avoid using `WidgetRef.exists`.

## Ref vs WidgetRef

The table below summarises the methods available in `Ref`, `AutoDisposeRef` and `WidgetRef`:

| Method           | Ref | AutoDisposeRef | WidgetRef |
| ---------------- |:---:|:--------------:|:---------:|
| watch            | ✅  |       ✅       |    ✅     |
| read             | ✅  |       ✅       |    ✅     |
| listen           | ✅  |       ✅       |    ✅     |
| invalidate       | ✅  |       ✅       |    ✅     |
| refresh          | ✅  |       ✅       |    ✅     |
| exists           | ✅  |       ✅       |    ✅     |
| listenSelf       | ✅  |       ✅       |    ❌     |
| invalidateSelf   | ✅  |       ✅       |    ❌     |
| notifyListeners  | ✅  |       ✅       |    ❌     |
| onAddListener    | ✅  |       ✅       |    ❌     |
| onRemoveListener | ✅  |       ✅       |    ❌     |
| onCancel         | ✅  |       ✅       |    ❌     |
| onResume         | ✅  |       ✅       |    ❌     |
| onDispose        | ✅  |       ✅       |    ❌     |
| keepAlive        | ❌  |       ✅       |    ❌     |
| listenManual     | ❌  |       ❌       |    ✅     |

## Conclusion

In this article, we have explored the basic concepts of Riverpod. We have learned about

- The different packages of Riverpod.
- The different types of providers and notifiers in Riverpod.
- How to interact with providers in widgets.
- How to interact between providers.
- The different methods available in `Ref`, `AutoDisposeRef` and `WidgetRef`.

If you want to learn more about Riverpod, visit the [official website][Riverpod].

<!-- Links -->

[Riverpod]: https://riverpod.dev/
[riverpod]: https://pub.dev/packages/riverpod
[flutter_riverpod]: https://pub.dev/packages/flutter_riverpod
[hooks_riverpod]: https://pub.dev/packages/hooks_riverpod
[riverpod_annotation]: https://pub.dev/packages/riverpod_annotation
[riverpod_generator]: https://pub.dev/packages/riverpod_generator
[build_runner]: https://pub.dev/packages/build_runner
[riverpod_lint]: https://pub.dev/packages/riverpod_lint
[custom_lint]: https://pub.dev/packages/custom_lint
[flutter_hooks]: https://pub.dev/packages/flutter_hooks
[http]: https://pub.dev/packages/http
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
[state_notifier]: https://pub.dev/packages/state_notifier
[Flutter Riverpod Snippets]: https://marketplace.visualstudio.com/items?itemName=robert-brunhage.flutter-riverpod-snippets
[Patterns]: https://dart.dev/language/patterns
[Records]: https://dart.dev/language/records
[AsyncValue]: https://pub.dev/documentation/riverpod/latest/riverpod/AsyncValue-class.html
[ProviderContainer]: https://pub.dev/documentation/riverpod/latest/riverpod/ProviderContainer-class.html
[ProviderScope]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/ProviderScope-class.html
[Ref]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref-class.html
[AutoDisposeRef]: https://pub.dev/documentation/riverpod/latest/riverpod/AutoDisposeRef-class.html
[WidgetRef]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef-class.html
[Ref.watch]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/watch.html
[AutoDisposeRef.watch]: https://pub.dev/documentation/riverpod/latest/riverpod/AutoDisposeRef/watch.html
[Ref.read]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/read.html
[Ref.listen]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/listen.html
[AutoDisposeRef.listen]: https://pub.dev/documentation/riverpod/latest/riverpod/AutoDisposeRef/listen.html
[Ref.invalidate]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/invalidate.html
[Ref.refresh]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/refresh.html
[Ref.exists]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/exists.html
[Ref.listenSelf]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/listenSelf.html
[Ref.invalidateSelf]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/invalidateSelf.html
[Ref.notifyListeners]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/notifyListeners.html
[Ref.onAddListener]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/onAddListener.html
[Ref.onRemoveListener]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/onRemoveListener.html
[Ref.onCancel]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/onCancel.html
[Ref.onResume]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/onResume.html
[Ref.onDispose]: https://pub.dev/documentation/riverpod/latest/riverpod/Ref/onDispose.html
[AutoDisposeRef.keepAlive]: https://pub.dev/documentation/riverpod/latest/riverpod/AutoDisposeRef/keepAlive.html
[Extension methods]: https://dart.dev/language/extension-methods
[WidgetRef.watch]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef/watch.html
[WidgetRef.read]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef/read.html
[WidgetRef.listen]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef/listen.html
[WidgetRef.listenManual]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef/listenManual.html
[WidgetRef.invalidate]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef/invalidate.html
[WidgetRef.refresh]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef/refresh.html
[WidgetRef.exists]: https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/WidgetRef/exists.html
