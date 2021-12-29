---
title: "Override Default Headers and Query Parameters"
date: 2021-12-09T23:07:40-03:00
---

Custom headers and query parameters can be passed into all finders and watchers (`findAll`, `findOne`, `save`, `watchOne` etc) but sometimes defaults are necessary.

Here is how:

```dart
mixin BaseAdapter<T extends DataModel<T>> on RemoteAdapter<T> {
  final _localStorageService = read(localStorageProvider);

  @override
  String get baseUrl => "http://my.remote.url:8080/";

  @override
  FutureOr<Map<String, String>> get defaultHeaders async {
    final token = _localStorageService.getToken();
    return await super.defaultHeaders & {'Authorization': token};
  }

  @override
  FutureOr<Map<String, dynamic>> get defaultParams async {
    return await super.defaultParams & {'v': 1};
  }
}
```

{{< contact >}}