---
title: Reloading the list
weight: 30
menu: tutorial
---

Let's make the number of tasks more manageable via the `_limit` server query param, which in this case will return a maximum of `5` resources.

```dart {hl_lines=[4]}
class TasksScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll(params: {'_limit': 5});
  // ...
}
```

Hot restarting the app we should only see five tasks, but...

{{< iphone "../w4.png" >}}

It's exactly the same as before. **Why isn't this working? 🤔**

Turns out `watchAll` is wired to show _all_ tasks in local storage. If the server responds with some tasks, this won't affect older tasks stored locally.

To fix this, `watchAll` takes a `syncLocal` argument which forces local storage to mirror exactly the resources returned from the remote source. This can be useful to reflect server-side resource deletions, too.

Let's try this out:

```dart {hl_lines=[4]}
class TasksScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll(params: {'_limit': 5}, syncLocal: true);
  // ...
}
```

And it works like a charm:

{{< iphone "../w5.png" >}}

{{< notice >}}
With a real-world API we would still see all tasks marked as done. We went back to default as our dummy JSON backend does not store data.

Another useful trick is to use `clear: true` on local storage configuration:

```dart {hl_lines=[5]}
void main() {
  runApp(
    ProviderScope(
      child: TasksApp(),
      overrides: [configureRepositoryLocalStorage(clear: true)],
    ),
  );
}
```

For more on initialization [see here](/docs/initialization).
{{< /notice >}}

### Replacing the manual reload

Instead of manually reloading/restarting we will now integrate `RefreshIndicator`. In the event handler we simply use [`findAll`](/docs/repositories#findall) and pass the same arguments:

```dart {hl_lines=[10 11 12]}
class TasksScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll(params: {'_limit': 5}, syncLocal: true);
    final _newTaskController = useTextEditingController();

    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    return RefreshIndicator(
      onRefresh: () =>
          ref.tasks.findAll(params: {'_limit': 5}, syncLocal: true),
      child: ListView(
        children: [
          TextField(
            controller: _newTaskController,
            onSubmitted: (value) async {
              Task(title: value, completed: false).init(ref.read).save();
              _newTaskController.clear();
            },
          ),
          for (final task in state.model)
            ListTile(
              leading: Checkbox(
                value: task.completed,
                onChanged: (value) => task.toggleCompleted().save(),
              ),
              title: Text('${task.title} [id: ${task.id}]'),
            ),
        ],
      ),
    );
  }
}
```

Now simply pull to refresh!

{{< iphone "../w6.png" >}}

{{< notice >}}
A similar method can be used to [fully re-initialize Flutter Data](/articles/how-to-reinitialize-flutter-data/).
{{< /notice >}}

**NEXT: [Deleting tasks](/tutorial/deleting)**