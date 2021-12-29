---
title: "Initialization"
weight: 55
menu: docs
---

## In Flutter with Riverpod

The setup involves two parts: setting up local storage via `configureRepositoryLocalStorage`, and then waiting for Flutter Data initialization in the entry point widget.

```dart {hl_lines=[3 5 6 12 "23-29"]}
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:flutter_data/flutter_data.dart';

import 'main.data.dart';
import 'models/task.dart';

void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
      overrides: [configureRepositoryLocalStorage()],
    ),
  );
}

class MyApp extends HookConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: ref.watch(repositoryInitializerProvider()).when(
                error: (error, _) => Text(error.toString()),
                loading: () => const CircularProgressIndicator(),
                data: (_) => Text('Flutter Data is ready: ${ref.tasks}'),
              ),
        ),
      ),
    );
  }
}
```

Let's have a closer look at `configureRepositoryLocalStorage`'s arguments:

- `FutureFn<String>? baseDirFn`: Optional. Takes a function that returns a future `String` with a directory path where to initialize [Hive](https://hivedb.dev) local storage. Defaults to the default returned by `path_provider` (only if it is a dependency). Not needed for Flutter Web. See below for an example.
- `bool? clear`: Optional. Whether to delete all local storage upon restart. Defaults to `false`.
- `List<int>? encryptionKey`: Optional. If this 256-bit key is supplied, all internal Hive boxes will be AES encrypted. Optional, defaults to `null`.

And now at `repositoryInitializerProvider()`'s arguments:

- `bool? remote`: Optional. Overrides all repositories' `remote` setting.
- `bool? verbose`: Optional. Overrides all repositories' `verbose` setting.

## Re-initializing

It is possible to re-initialize Flutter Data, for example to perform a restart with [Phoenix](https://pub.dev/packages/flutter_phoenix) or simply a Riverpod `ref.refresh`:

```dart {hl_lines=[6]}
class MyApp extends HookConsumerWidget {
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
                  data: (_) => Text('Flutter Data is ready: ${ref.tasks}'),
                ),
          ),
        ),
      ),
    );
  }
}
```

## In Dart

```dart
// lib/main.dart

late final Directory _dir;

final container = ProviderContainer(
  overrides: [
    // baseDirFn MUST be provided
    configureRepositoryLocalStorage(baseDirFn: () => _dir.path),
  ],
);

try {
  _dir = await Directory('tmp').create();
  _dir.deleteSync(recursive: true);

  await container.read(repositoryInitializerProvider().future);

  final usersRepo = container.read(usersRepositoryProvider);
  await usersRepo.findOne(1);
  // ...
}
```

## Other

- [Provider](/articles/configure-provider/)
- [GetIt](/articles/configure-get-it/)

{{< contact >}}