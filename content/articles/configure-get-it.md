---
title: "Configure Flutter Data to Work with GetIt"
date: 2021-12-05T23:12:05-03:00
---

This is an example of how we can configure Flutter Data to use [GetIt](https://pub.dev/packages/get_it) as a dependency injection framework.

**Important**: Make sure to replicate `ProxyProvider`s for other models than `Todo`.

```dart
class GetItTodoApp extends StatelessWidget {
  @override
  Widget build(context) {
    GetIt.instance.registerRepositories();
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: FutureBuilder(
            future: GetIt.instance.allReady(),
            builder: (context, snapshot) {
              if (!snapshot.hasData) {
                return const CircularProgressIndicator();
              }
              final repository = GetIt.instance.get<Repository<Todo>>();
              return GestureDetector(
                onDoubleTap: () async {
                  print((await repository.findOne(1, remote: false))?.title);
                  final todo = await Todo(id: 1, title: 'blah')
                      .init(_)
                      .save(remote: false);
                  print(keyFor(todo));
                },
                child: Text('Hello Flutter Data with GetIt! $repository'),
              );
            },
          ),
        ),
      ),
    );
  }
}

// we can do this as this function will never be called
T _<T>(ProviderBase<T> provider) => null as T;

extension GetItFlutterDataX on GetIt {
  void registerRepositories(
      {FutureFn<String>? baseDirFn,
      List<int>? encryptionKey,
      bool clear = false,
      bool? remote,
      bool? verbose}) {
    final i = GetIt.instance;

    final _container = ProviderContainer(
      overrides: [
        configureRepositoryLocalStorage(
            baseDirFn: baseDirFn, encryptionKey: encryptionKey, clear: clear),
      ],
    );

    if (i.isRegistered<RepositoryInitializer>()) {
      return;
    }

    i.registerSingletonAsync<RepositoryInitializer>(() async {
      final init = _container.read(
          repositoryInitializerProvider(remote: remote, verbose: remote)
              .future);
      internalLocatorFn =
          <T extends DataModel<T>>(Provider<Repository<T>> provider, _) =>
              _container.read(provider);
      return init;
    });
    i.registerSingletonWithDependencies<Repository<Todo>>(
        () => _container.read(todosRepositoryProvider),
        dependsOn: [RepositoryInitializer]);
  }
}
```

See this in action with the [Flutter Data setup app](https://github.com/flutterdata/flutter_data_setup_app)!
