---
title: "How to Reinitialize Flutter Data"
date: 2021-12-18T17:08:28-03:00
---

By calling `repositoryInitializerProvider()` again with Riverpod's `refresh` we can reinitialize Flutter Data.

```dart {hl_lines=[5 6]}
class TasksApp extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      home: RefreshIndicator(
        onRefresh: () async => ref.refresh(repositoryInitializerProvider()),
        child: Scaffold(
          body: Center(
            child: ref.watch(repositoryInitializerProvider()).when(
                  error: (error, _) => Text(error.toString()),
                  loading: () => const CircularProgressIndicator(),
                  data: (_) => TasksScreen(),
                ),
          ),
        ),
      ),
    );
  }
}
```