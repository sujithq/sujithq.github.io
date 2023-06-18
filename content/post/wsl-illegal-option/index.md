---
#layout: post
#current: post
#cover: img/cover.jpg
#navigation: True
#title: 
#date: 2022-04-28 09:00:00Z
#tags: [azure, azure-functions, visual-studio, teamcity, octopus-deploy]
#class: post-template
#subclass: 'post'
#author: sujith
#disqus: False
title: 'Illegal option when executing a script'
subtitle: 'Illegal option when executing a script'
summary: 'Illegal option when executing a script'
authors:
- sujith
tags:
- WSL
categories:
- Development
date: "2022-04-29 10:00:00Z"
lastmod: "2022-04-29 10:00:00Z"
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Placement options: 1 = Full column width, 2 = Out-set, 3 = Screen-width
# Focal point options: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight
image:
  placement: 1
  caption: ''
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Sometimes when you run a script, you get this this error like `set: Illegal option -`:

Run

```shell
sh filename
```

Error

```console
: not found: 2:
: not found: 4:
filename: 6: set: Illegal option -
```

This means there is something wrong with the line endings in your script. This can easily be resolved by running this:

Run

```shell
sed -i 's/\r$//' filename
```

After that rerun your script.
