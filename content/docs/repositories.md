---
title: "Repositories"
weight: 10
menu: docs
---

Flutter Data is organized around the concept of [models](/docs/models) which are data classes mixing in `DataModel`.

```dart
@DataRepository([TaskAdapter])
class Task with DataModel<Task> {
  @override
  final int? id;
  final String title;
  final bool completed;

  Task({this.id, required this.title, this.completed = false});

  // ...
}
```

When annotated with `@DataRepository` (and [adapters](/docs/adapters) as arguments, as we'll see later) a model gets its own fully-fledged repository. Repository is the API used to interact with models – whether they are local or remote.

Assuming a `Task` model and its corresponding `Repository<Task>`, let's first see how to retrieve a collection of resources from an API.

## findAll

```dart
Repository<Task> repository = ref.tasks;
final tasks = await repository.findAll();

// GET http://base.url/tasks
```

This async call triggered an HTTP request to `GET http://base.url/tasks`.

There are multiple ways to obtain a Repository: `ref.tasks` will work in a typical Flutter Riverpod app (essentially a shortcut to `ref.watch(tasksRepositoryProvider)`).

{{< notice >}}
  {{< partial "magic1.md" >}}
{{< /notice >}}

We can include query parameters (in this case used for pagination and resource inclusion):

```dart
final tasks = await repository.findAll(params: {'include': 'comments', 'page': { 'limit': 20 }});

// GET http://base.url/tasks?include=comments&page[limit]=20
```

Or headers:

```dart
final tasks = await repository.findAll(headers: { 'Authorization': 't0k3n' });
```

We can also request _only_ for models in local storage:

```dart
final tasks = await repository.findAll(remote: false);
```

{{< notice >}}
In addition to adapters, the `@DataRepository` annotation can take a `remote` boolean argument which will make it the default for the repository.

```dart
@DataRepository([TaskAdapter], remote: false)
class Task with DataModel<Task> {
  // by default no operation hits the remote endpoint
}
```

{{< /notice >}}

And `syncLocal` which synchronizes local storage with the exact resources returned from the remote source (for example, to reflect server-side resource deletions).

```dart
final tasks = await repository.findAll(syncLocal: true);
```

Example:

If a first call to `findAll` returns data for task IDs `1`, `2`, `3` and a second call updated data for `2`, `3`, `4` you will end up in your local storage with: `1`, `2` (updated), `3` (updated) and `4`.

Passing `syncLocal: true` to the second call will leave the local storage state with `2`, `3` and `4`.

## watchAll

Watches all models of a given type in local storage through a [Riverpod](https://riverpod.dev/) `ref.watch`, wrapping the [watchAllNotifier](#watchallnotifier).

For updates to any model of type `Task` to prompt a rebuild we can use:

```dart
class TasksScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll();
    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    // use state.model which is a List<Task>
  }
);
```

## watchAllNotifier

Returns a [`DataState`](#datastate) [StateNotifier](https://pub.dev/packages/state_notifier) which notifies changes on all models of a given type in local storage.

Will invoke `findAll` in the background with `remote`, `params`, `headers` and `syncLocal`.

## findOne

Finds a resource by ID and saves it in local storage.

```dart
Repository<Task> repository;
final task = await repository.findOne(1);

// GET http://base.url/tasks/1
```

{{< notice >}}

As explained above in [findAll](#findall), Flutter Data resolves the URL by using the `urlForFindOne` function. We can override this in an [adapter](/docs/adapters).

For example, use path `/tasks/something/1`:

```dart
mixin TaskURLAdapter on RemoteAdapter<Task> {
  @override
  String urlForFindOne(id, params) => '$type/something/$id';
}
```

{{< /notice >}}

Takes `remote`, `params` and `headers` as named arguments.

## watchOne

Watches a model of a given type in local storage through a [Riverpod](https://riverpod.dev/) `ref.watch`, wrapping the [watchOneNotifier](#watchonenotifier).

For updates to a given model of type `Task` to prompt a rebuild we can use:

```dart
class TaskScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchOne(3);
    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    // use state.model which is a Task
  }
);
```

## watchOneNotifier

Returns a [`DataState`](#datastate) [StateNotifier](https://pub.dev/packages/state_notifier) which notifies changes on a model of a given type in local storage.

Will invoke `findOne` in the background with `remote`, `params` and `headers`.

It can additionally react to selected relationships of this model via `alsoWatch`:

```dart
watchOneNotifier(3, alsoWatch: (task) => [task.user]);
```

## save

Saves a model to local storage and remote.

```dart
final savedTask = await repository.save(task);
```

Takes `remote`, `params` and `headers` as named arguments.

{{< notice >}}

Want to use the `PUT` verb instead of `PATCH`? Use this [adapter](/docs/adapters):

```dart
mixin TaskURLAdapter on RemoteAdapter<Task> {
  @override
  String methodForSave(id, params) => id != null ? DataRequestMethod.PUT : DataRequestMethod.POST;
}
```

{{< /notice >}}

## delete

Deletes a model from local storage and sends a `DELETE` HTTP request.

```dart
await repository.delete(model);
```

Takes `remote`, `params` and `headers` as named arguments.

## DataState

`DataState` is a class that holds state related to resource fetching and is practical in UI applications. It is returned in all Flutter Data watchers.

It has the following attributes:

```dart
T model;
bool isLoading;
DataException? exception;
StackTrace? stackTrace;
```

And it's typically used in a Flutter `build` method like:

```dart
class MyApp extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll();
    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    if (state.hasException) {
      return ErrorScreen(state.exception, state.stackTrace);
    }
    return ListView(
      children: [
        for (final task in state.model)
          Text(task.title),
    // ...
  }
}
```

## Custom endpoints

Awful APIs also supported 😄

As we saw, CRUD endpoints can be customized via `urlFor*` methods.

But ad-hoc endpoints? They are not a rare finding in most REST APIs.

We'll see how to to implement these in the next section, **[Adapters](/docs/adapters)**.

## Architecture overview

This is the dependency graph for an app with models `User` and `Task`:

<p class="py-6">
  <img src="/images/deps.png" style="max-width: 500px">
</p>

Clients will only interact with providers and repositories, while using the [Adapter API](/docs/adapters) to customize behavior. As a matter of fact, Flutter Data itself extends this API internally to add serialization, watchers and offline features.

`LocalAdapter`, `GraphNotifier` and the usage of `Hive` are internal concerns. Do not use `LocalAdapter`s for local storage capabilities; these are all exposed via the `Repository` and `RemoteAdapter` APIs.

{{< internal >}}
GRAPHVIZ

```
digraph g {
  rankdir="TB"
  "RemoteAdapter<Task>" -> "LocalAdapter<Task>" -> "Hive"
  "RemoteAdapter<Task>" -> "LocalAdapter<Task>" -> "Hive"
  "LocalAdapter<Task>" -> "GraphNotifier"
  "LocalAdapter<Task>" -> "GraphNotifier"
  "GraphNotifier" -> "Hive"
  "Repository<Task>" -> "RemoteAdapter<Task>"
  "Repository<Task>" -> "RemoteAdapter<Task>"
  "Repository<Task>" -> "RemoteAdapter<Task>"
  "Repository<Task>" -> "RemoteAdapter<Task>"
  "tasksRepositoryProvider" -> "Repository<Task>"
  "tasksRepositoryProvider" -> "Repository<Task>"
  "tasksProvider" -> "tasksRepositoryProvider"
  "tasksProvider" -> "tasksRepositoryProvider"
}
```

{{< /internal >}}
