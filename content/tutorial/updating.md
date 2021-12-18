---
title: Marking tasks as done
weight: 15
menu: tutorial
---

A read-only tasks app is not very practical! Let's add the ability to update the `completed` state and mark/unmark our tasks as done.

First, though, we'll extract the tasks-specific code to a separate screen named `TasksScreen`:

```dart
class TasksScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll();
    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    return ListView(
      children: [
        for (final task in state.model) Text(task.title),
      ],
    );
  }
}
```

Remember to return this new widget from `TasksApp`:

```dart {hl_lines=[10]}
class TasksApp extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: ref.watch(repositoryInitializerProvider()).when(
                error: (error, _) => Text(error.toString()),
                loading: () => const CircularProgressIndicator(),
                data: (_) => TasksScreen(),
              ),
        ),
      ),
      debugShowCheckedModeBanner: false,
    );
  }
}
```

Back to our `TasksScreen` we are going to wrap our title text widget in a `ListTile` prefixing it with a checkbox which, upon clicking, will toggle task completion:


```dart {hl_lines=["11-17"]}
class TasksScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll();
    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    return ListView(
      children: [
        for (final task in state.model)
          ListTile(
            leading: Checkbox(
              value: task.completed,
              onChanged: (value) => task.toggleCompleted().save(),
            ),
            title: Text('${task.title} [id: ${task.id}]'),
          ),
      ],
    );
  }
}
```

If only the `toggleCompleted()` method existed... 🙂

Since `Task` is immutable and provides no way to update fields, we return a new `Task` object with the inverse boolean value of `completed`, initialized via the [was](/docs/models/#was) method.

```dart {hl_lines=["11-13"]}
@JsonSerializable()
@DataRepository([JSONServerAdapter])
class Task with DataModel<Task> {
  @override
  final int? id;
  final String title;
  final bool completed;

  Task({this.id, required this.title, this.completed = false});

  Task toggleCompleted() {
    return Task(id: this.id, title: this.title, completed: !this.completed).was(this);
  }
}
```

Hot-reload and check all boxes...

{{< iphone "../w2.gif" >}}

Done!

{{< notice >}}
Remember to check out the debug console where you can find some Flutter Data activity logs.
{{< /notice >}}

**NEXT: [Creating a new task](/tutorial/creating)**