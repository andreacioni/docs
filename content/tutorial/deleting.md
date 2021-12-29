---
title: Deleting tasks
weight: 40
menu: tutorial
---

There's stuff we just don't want to do!

We can delete a `Task` on dismiss by wrapping the tile with a `Dismissible` and calling its `delete` method:

```dart {hl_lines=["23-26"]}
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
              Task(title: value).init(ref.read).save();
              _newTaskController.clear();
            },
          ),
          for (final task in state.model)
            Dismissible(
              key: ValueKey(task),
              direction: DismissDirection.endToStart,
              onDismissed: (_) => task.delete(),
              child: ListTile(
                leading: Checkbox(
                  value: task.completed,
                  onChanged: (value) => task.toggleCompleted().save(),
                ),
                title: Text('${task.title} [id: ${task.id}]'),
              ),
            ),
        ],
      ),
    );
  }
}
```

Hot-reload, swipe left and... they're gone!

{{< iphone "../w7.gif" >}}

{{< notice >}}
Remember to check out the debug console where you can find some Flutter Data activity logs.
{{< /notice >}}

{{< contact >}}