---
date: "2019-12-18"
draft: false
title: "Why Is My Future/Async Called Multiple Times?"
author: Frank Treacy
versions: "1.12.13"
---

Why is `FutureBuilder` firing **multiple** times? My future should be called just once!

It appears that this `build` method is rebuilding unnecessarily:

```dart
@override
Widget build(context) {
  return FutureBuilder<String>(
    future: callAsyncFetch(), // called all the time!!! 😡
    builder: (context, snapshot) {
      // rebuilding all the time!!! 😡
    }
  );
}
```

This causes unintentional network refetches, recomputes and rebuilds – which can also be an expensive problem if using Firebase, for example.

Well, let me tell you something...

**This is not a bug 🐞, it's a feature ✅!**

Let's quickly see why... and how to fix it!

## Understanding the problem

Imagine the `FutureBuilder`'s parent is a `ListView`. This is what happens:

- 🧻 User scrolls list
- 🔥 `build` fires many times per second to update the screen
- ⁑ `callAsyncFetch()` gets invoked once per `build` returning new `Future`s every time
- = `didUpdateWidget` in the `FutureBuilder` compares old and new `Future`s; if different it calls the `builder` again
- 😩 Since instances are always new (always different to the old one) the `builder` refires once for every call to the parent's `build`... that is, A LOT

_(Remember: Flutter is a *declarative* framework. This means it will paint the screen as many times as needed to reflect the UI you declared, based on the latest state)_

## A quick fix 🔧

We clearly must take the `Future` out of this `build` method!

A simple approach is by introducing a `StatefulWidget` where we stash our `Future` in a variable. Now every rebuild will make reference to the same `Future` instance:

```dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  Future<String> _future;

  @override
  void initState() {
    _future = callAsyncFetch();
    super.initState();
  }

  @override
  Widget build(context) {
    return FutureBuilder<String>(
      future: _future,
      builder: (context, snapshot) {
        // ...
      }
    );
  }
}
```

We're caching a value (in other words, [memoizing](https://en.wikipedia.org/wiki/Memoization)) such that the `build` method can now call our code a million times without problems.

## Live example

Here we have a sample parent widget that rebuilds every 3 seconds. It's meant to represent _any widget_ that triggers rebuilds like, for example, a user scrolling a `ListView`.

The screen is split in two:

- **Top**: a `StatelessWidget` containing a `FutureBuilder`. It's fed a new `Future` that resolves to the current date in seconds
- **Bottom**: a `StatefulWidget` containing a `FutureBuilder`. A new `Future` (that also resolves to the current date in seconds) is cached in the `State` object. This _cached_ `Future` is passed into the `FutureBuilder`

Hit _Run_ and see the difference (wait at least 3 seconds). Rebuilds are also logged to the console.

{{< dartpad 8fff93d3dafe16a98ce203e3e3a8295d 65 500 >}}

The top future (stateless) gets called and triggered all the time (every 3 seconds in this example).

The bottom (stateful) can be called any amount of times without changing.

## Cleaner ways 🛀

Are you using [Provider](https://pub.dev/packages/provider) by any chance? You can simply use a `FutureProvider` instead of the `StatefulWidget` above:

```dart
class MyWidget extends StatelessWidget {
  // Future<String> callAsyncFetch() => Future.delayed(Duration(seconds: 2), () => "hi");
  @override
  Widget build(BuildContext context) {
    // print('building widget');
    return FutureProvider<String>(
      create: (_) {
        // print('calling future');
        return callAsyncFetch();
      },
      child: Consumer<String>(
        builder: (_, value, __) => Text(value ?? 'Loading...'),
      ),
    );
  }
}
```

Much nicer, if you ask me.

{{< notice >}}
**Tip!** It's a fully functional example. Comment out those lines and try it out in your own editor!
{{< /notice >}}

Another option is using the fantastic [Flutter Hooks](https://pub.dev/packages/flutter_hooks) library with the `useMemoized` hook for the memoization (caching):

```dart
class MyWidget extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final future = useMemoized(() {
      // Future<String> callAsyncFetch() => Future.delayed(Duration(seconds: 2), () => "hi");
      callAsyncFetch(); // or your own async function
    });
    return FutureBuilder<String>(
      future: future,
      builder: (context, snapshot) {
        return Text(snapshot.hasData ? snapshot.data : 'Loading...');
      }
    );
  }
}
```

## Takeaway

Your `build` methods should always be _pure_, that is, **never** have side-effects (like updating state, calling async functions).

Remember that `builder`s are ultimately called by `build`!
