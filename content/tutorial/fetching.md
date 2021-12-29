---
title: Fetching tasks
weight: 10
menu: tutorial
---

{{< notice >}}
**Before you continue:**

Make sure you went through the **[Quickstart](/docs/quickstart)** and got Flutter Data up and running!

Also, you can check out the full source code for this tutorial at **https://github.com/flutterdata/tutorial**
{{< /notice >}}

We now have access to our `Repository<Task>` through `ref.tasks`, with an API base URL set to `https://my-json-server.typicode.com/flutterdata/demo/`.

Inspecting the `/tasks` endpoint we see:

```json
[
  {
    "id": 1,
    "title": "Laundry 🧺",
    "completed": false,
    "userId": 1
  },
  {
    "id": 2,
    "title": "Groceries 🛒",
    "completed": true,
    "userId": 1
  },
  {
    "id": 3,
    "title": "Reservation at Malloys",
    "completed": true,
    "userId": 1
  },
  // ...
]
```

To bring these tasks into our app we'll use the `watchAll` method. (It internally makes a remote `findAll` call to `/tasks` and keeps watching local storage for any further changes in these models.)

```dart {hl_lines=["10-20"]}
class TasksApp extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: ref.watch(repositoryInitializerProvider()).when(
            error: (error, _) => Text(error.toString()),
            loading: () => const CircularProgressIndicator(),
            data: (_) {
              final state = ref.tasks.watchAll();
              if (state.isLoading) {
                return CircularProgressIndicator();
              }
              return ListView(
                children: [
                  for (final task in state.model) Text(task.title),
                ],
              );
            },
          ),
        ),
      ),
      debugShowCheckedModeBanner: false,
    );
  }
}
```

Bam 💥!

{{< iphone "../w1.png" >}}

**Whoa,** how did that happen?


{{< notice >}}
{{< partial "magic1.md" >}}

For more information see the [Repository docs](/repository).
{{</ notice >}}

**NEXT: [Marking tasks as done](/tutorial/updating)**

{{< contact >}}