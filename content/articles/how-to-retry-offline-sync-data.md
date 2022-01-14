---
title: "How to Retry Offline Calls to Sync Data"
date: 2021-12-05T23:12:05-03:00
---

Flutter Data does not implement the logic to handle retries after offline failures. It does expose, however, useful primitives.

The `pendingOfflineTypesProvider` provides a notifier which triggers a set of types with pending offline operations. This happens anytime a request fails with an `OfflineException`.

```dart
final notifier = ref.read(pendingOfflineTypesProvider.notifier);

final _dispose = notifier.addListener((Set<String> types) async {
  // check offline operations for all these types
});
```

For performance reasons it can be throttled in an exponential backoff manner by combining a few utilities:

```dart
final notifier = ref.read(pendingOfflineTypesProvider.notifier);

final _dispose = notifier.throttle(() {
  final n = backoffFn(ref.read(counterProvider).state);
  return Duration(seconds: n);
}).addListener((types) async {
  // check offline operations for all these types
  // types is now a List<Set<String>> because of the throttle
});

//

final backoffFn = (int i) => [2, 5, 8, 8, 8, 13, 13, 18, 18].getSafe(i) ?? 20;
final counterProvider = StateProvider<int>((_) => 0);
```

So here's an implementation example that can be placed in a initialization callback:

```dart
final notifier = ref.read(pendingOfflineTypesProvider.notifier);

final _dispose = notifier.throttle(() {
  final n = backoffFn(ref.read(counterProvider).state);
  return Duration(seconds: n);
}).addListener((types) async {
  // check offline operations for all these types
  // types is now a List<Set<String>> because of the throttle

  types = types.expand((e) => e).toSet();

  if (types.isNotEmpty) {
    for (final type in types) {
      final provider = repositoryProviders[type];
      if (provider != null) {
        final operations = ref.read(provider).offlineOperations;
        print('== Retrying $type (${operations.length} operations) ==');
        await operations.retry();
      }
    }
    ref.read(counterProvider).state++;
  } else {
    print('== No operations, reset ==');
    ref.read(counterProvider).state = 0;
  }
});

// remember to call _dispose
```

{{< contact >}}