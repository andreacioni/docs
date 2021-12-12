---
date: "2019-08-27T12:43:48-05:00"
draft: false
title: "How to Upgrade Flutter"
author: Frank Treacy
versions: "1.7.8"
tags: ['pub', 'vscode']
---

Type in your terminal:

```bash
flutter upgrade
```

This will update Flutter to the latest version in the current channel. Most likely you have it set in `stable`.

```bash
flutter channel
# Flutter channels:
#   beta
#   dev
#   master
# * stable
```

Do you want to live in the cutting edge? Switching channels is easy:

```bash
flutter channel dev
# Switching to flutter channel 'dev'...
# ...
```

And run upgrade again: 

```bash
flutter upgrade
```