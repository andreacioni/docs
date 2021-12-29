---
date: "2019-12-18"
draft: false
title: "How to Build Widgets with an Async Method Call"
author: Frank Treacy
versions: "1.12.13"
---

You want to return a widget in a `build` method...

**But your data comes from an async function!**

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(context) {
    callAsyncFetch().then((data) {
      return Text(data);  // doesn't work
    });
  }
}
```

The `callAsyncFetch` function could be an HTTP call, a Firebase call, or a call to SharedPreferences or SQLite, etc. Anything that returns a `Future` 🔮.

**So, can we make the `build` method async? 🤔**

```dart
class MyWidget extends StatelessWidget {
  @override
  Future<Widget> build(context) async {
    var data = await callAsyncFetch();
    return Text(data);  // doesn't work either
  }
}
```

Not possible! A widget's `build` "sync" method will NOT wait for you while you fetch data 🙁

(You might even get a `type 'Future' is not a subtype of type` kind of error.)

## 🛠 How do we fix this with Flutter best practices?

Meet `FutureBuilder`:

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(context) {
    return FutureBuilder<String>(
      future: callAsyncFetch(),
      builder: (context, AsyncSnapshot<String> snapshot) {
        if (snapshot.hasData) {
          return Text(snapshot.data);
        } else {
          return CircularProgressIndicator();
        }
      }
    );
  }
}
```

It takes our `Future` as argument, as well as a `builder` (it's basically a delegate called by the widget's `build` method). The builder will be called immediately, and again when our future resolves with either data or an error.

An `AsyncSnapshot<T>` is simply a representation of that data/error state. This is actually a useful API!

If we get a new snapshot with:

- 📭 **no data**... we show a progress indicator
- ✅ **data from our future**... we use it to feed any widgets for display!
- ❌ **error from our future**... we show an appropriate message

{{< notice >}}
Do you think the answer to this problem is a `StatefulWidget`? Yes, it's a possible solution but not an ideal one. Keep on reading and we'll see why.
{{< /notice >}}

Click _Run_ and see it for yourself!

{{< dartpad f85195d247d9854446a4a736d67debf2 70 500 >}}

It will show a circular progress indicator while the future resolves (about 2 seconds) and then display data. **Problem solved!**

## 🎩 Under the hood: FutureBuilder

`FutureBuilder` itself is built on top of `StatefulWidget`! Attempting to solve this problem with a `StatefulWidget` is not _wrong_ but simply lower-level and more tedious.

Check out the _simplified and commented-by-me_ source code:

(I removed bits and pieces for illustration purposes)

```dart {hl_lines=[2 6 7 21 "31-35"]}
// FutureBuilder *is* a stateful widget
class FutureBuilder<T> extends StatefulWidget {

  // it takes in a `future` and a `builder`
  const FutureBuilder({
    this.future,
    this.builder
  });

  final Future<T> future;

  // the AsyncWidgetBuilder<T> type is a function(BuildContext, AsyncSnapshot<T>) which returns Widget
  final AsyncWidgetBuilder<T> builder;

  @override
  State<FutureBuilder<T>> createState() => _FutureBuilderState<T>();
}

class _FutureBuilderState<T> extends State<FutureBuilder<T>> {
  // keeps state in a local variable (so far there's no data)
  AsyncSnapshot<T> _snapshot = null;

  @override
  void initState() {
    super.initState();

    // wait for the future to resolve:
    //  - if it succeeds, create a new snapshot with the data
    //  - if it fails, create a new snapshot with the error
    // in both cases `setState` will trigger a new build!
    widget.future.then<void>((T data) {
      setState(() { _snapshot = AsyncSnapshot<T>(data); });
    }, onError: (Object error) {
      setState(() { _snapshot = AsyncSnapshot<T>(error); });
    });
  }

  // builder is called with every `setState` (so it reacts to any event from the `future`)
  @override
  Widget build(BuildContext context) => widget.builder(context, _snapshot);

  @override
  void didUpdateWidget(FutureBuilder<T> oldWidget) {
    // compares old and new futures!
  }

  @override
  void dispose() {
    // ...
    super.dispose();
  }
}
```

Very simple, right? This is likely similar to what you tried when using a `StatefulWidget`. Of course, for the real, battle-tested source code see [FutureBuilder](https://github.com/flutter/flutter/blob/27321ebbad/packages/flutter/lib/src/widgets/async.dart#L566).

Before wrapping up... 🎁

From the [docs](https://api.flutter.dev/flutter/widgets/FutureBuilder-class.html)

> If the future is created at the same time as the FutureBuilder, then every time the FutureBuilder's parent is rebuilt, the asynchronous task will be restarted.

```dart {hl_lines=[3]}
Widget build(context) {
  return FutureBuilder<String>(
    future: callAsyncFetch(),
```

Does this mean `callAsyncFetch()` will be called many times?

In this small example, there is no reason for the parent to rebuild (nothing changes) but _in general_ you should assume it does. See [Why is my Future/Async Called Multiple Times?](/articles/future-async-called-multiple-times).

{{< contact >}}