---
title: Creating a new task
weight: 20
menu: tutorial
---

Let's add a `TextField` and turn the input into a new `Task`. This time around we initialize the model via [`init`](/docs/models#init) (passing a Riverpod `ref.read`) and immediately saving it.

```dart {hl_lines=[5 "12-18"]}
class TasksScreen extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.tasks.watchAll();
    final _newTaskController = useTextEditingController();

    if (state.isLoading) {
      return CircularProgressIndicator();
    }
    return ListView(
      children: [
        TextField(
          controller: _newTaskController,
          onSubmitted: (value) async {
            Task(title: value).init(ref.read).save();
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
    );
  }
}
```

Remember to import `flutter_hooks`!

Hot-reloading once again we see our `TextField` ready to create new tasks:

{{< iphone "../w4.gif" >}}

It was that easy!

{{< notice >}}
You may have noticed that there was a flash with `[id: null]` (we didn't supply any ID upon model creation), until the server responds with one (in this case `11`) triggering an update.

Be aware that our [dummy JSON backend](https://my-json-server.typicode.com/flutterdata/demo) does not actually save new resources so **it will always respond with ID `11`**, causing a confusing situation if you keep adding tasks!

Finally, remember to check out the debug console where you can find some Flutter Data activity logs!
{{< /notice >}}

**NEXT: [Reloading the list](/tutorial/reloading)**

{{< contact >}}