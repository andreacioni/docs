---
title: "Intercept Logout Adapter"
date: 2021-12-09T23:15:11-03:00
---

The global `onError` handler will call `logout` if certain conditions are met:

```dart
mixin BaseAdapter<T extends DataModel<T>> on RemoteAdapter<T> {
  @override
  FutureOr<Null?> onError<Null>(DataException e) async {
    // Automatically logout user if a 401/403 is returned from any API response.
    if (e.statusCode == 401 || e.statusCode == 403) {
      await read(sessionProvider).logOut();
      return null;
    }

    throw e;
  }
}
```

{{< contact >}}