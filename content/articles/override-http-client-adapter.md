---
title: "Override HTTP Client Adapter"
date: 2022-04-06T18:38:10-01:00
---

An example on how to override and use a more advanced HTTP client.

Here the `connectionTimeout` is increased, and an HTTP proxy enabled.

```dart
mixin HttpProxyAdapter<T extends DataModel<T>> on RemoteAdapter<T> {

  @override
  http.Client get httpClient {
    _httpClient = HttpClient();
    _ioClient = IOClient(_httpClient);

    // increasing the timeout
    _httpClient!.connectionTimeout = const Duration(seconds: 5);

    // using a proxy
    _httpClient!.badCertificateCallback =
        ((X509Certificate cert, String host, int port) => true);
    _httpClient!.findProxy = (uri) => 'PROXY (proxy url)';

    return _ioClient!;
  }
}
```

{{< contact >}}
