---
title: "Configure Flutter Data to Work with Provider"
date: 2021-12-05T23:12:05-03:00
---

This is an example of how we can configure Flutter Data to use [Provider](https://pub.dev/packages/provider) as a dependency injection framework.

**Important**: Make sure to replicate `ProxyProvider`s for other models than `Todo`.

```dart
class ProviderTodoApp extends StatelessWidget {
  @override
  Widget build(context) {
    return MultiProvider(
      providers: [
        ...providers(clear: true),
        ProxyProvider<Repository<Todo>?, SessionService?>(
          lazy: false,
          create: (_) => SessionService(),
          update: (context, repository, service) {
            if (service != null && repository != null) {
              return service..initialize(repository);
            }
            return service;
          },
        ),
      ],
      child: MaterialApp(
        home: Scaffold(
          body: Center(
            child: Builder(
              builder: (context) {
                if (context.watch<RepositoryInitializer?>() == null) {
                  // optionally also check
                  // context.watch<SessionService>.repository != null
                  return const CircularProgressIndicator();
                }
                final repository = context.watch<Repository<Todo>?>();
                return GestureDetector(
                  onDoubleTap: () async {
                    print((await repository!.findOne(1, remote: false))?.title);
                    final todo = await Todo(id: 1, title: 'blah')
                        .init(context.read<ProviderContainer>().read)
                        .save(remote: false);
                    print(keyFor(todo));
                  },
                  child: Text('Hello Flutter Data with Provider! $repository'),
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}

List<SingleChildWidget> providers(
    {FutureFn<String>? baseDirFn,
    List<int>? encryptionKey,
    bool? clear,
    bool? remote,
    bool? verbose}) {
  return [
    Provider(
      create: (_) => ProviderContainer(
        overrides: [
          configureRepositoryLocalStorage(
              baseDirFn: baseDirFn, encryptionKey: encryptionKey, clear: clear),
        ],
      ),
    ),
    FutureProvider<RepositoryInitializer?>(
      initialData: null,
      create: (context) async {
        return await Provider.of<ProviderContainer>(context, listen: false)
            .read(
          repositoryInitializerProvider(remote: remote, verbose: verbose)
              .future,
        );
      },
    ),
    ProxyProvider<RepositoryInitializer?, Repository<Todo>?>(
      lazy: false,
      update: (context, i, __) => i == null
          ? null
          : Provider.of<ProviderContainer>(context, listen: false)
              .read(todosRepositoryProvider),
      dispose: (_, r) => r?.dispose(),
    ),
  ];
}
```

See this in action with the [Flutter Data setup app](https://github.com/flutterdata/flutter_data_setup_app)!
