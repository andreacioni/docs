---
title: "Override HTTP Client Adapter"
date: 2021-12-09T23:10:10-03:00
---

An example on how to override and use a more advanced HTTP client.

Here the `connectionTimeout` is increased, and an HTTP proxy enabled.

```dart
mixin HttpProxyAdapter<T extends DataModel<T>> on RemoteAdapter<T> {
  HttpClient? _httpClient;
  IOClient? _ioClient;

  @override
  http.Client get httpClient {
    _httpClient ??= HttpClient();
    _ioClient ??= IOClient(_httpClient);

    // increasing the timeout
    _httpClient!.connectionTimeout = const Duration(seconds: 5);

    // using a proxy
    _httpClient!.badCertificateCallback =
        ((X509Certificate cert, String host, int port) => true);
    _httpClient!.findProxy = (uri) => 'PROXY (proxy url)';

    return _ioClient!;
  }

  @override
  Future<void> dispose() async {
    _ioClient?.close();
    _ioClient = null;
    _httpClient = null;
    super.dispose();
  }
}
```
