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
title: 'Update, Upgrade and Clean WSL'
subtitle: 'Update, Upgrade and Clean WSL'
summary: 'Update, Upgrade and Clean WSL'
authors:
- sujith
tags:
- WSL
categories:
- Development
date: "2022-04-29 09:00:00Z"
lastmod: "2022-04-29 09:00:00Z"
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

When you are using WSL, once in a while you get this message at start up stating your environment is out of date:

```text
Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.10.102.1-microsoft-standard-WSL2 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com      
 * Support:        https://ubuntu.com/advantage

  System information as of Thu Apr 28 08:26:12 CEST 2022

  System load:  0.0                 Processes:             8
  Usage of /:   11.0% of 250.98GB   Users logged in:       0
  Memory usage: 1%                  IPv4 address for eth0: 172.31.68.164
  Swap usage:   0%


0 updates can be applied immediately.


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


This message is shown once a day. To disable it please create the
/home/<username>/.hushlogin file.
```

You could run this set of commands or this one line to update your WSL

Set

```shell
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get autoremove -y
sudo apt-get clean -y
```

One line

```shell
sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get clean -y
```

You can actually create a script **wsl-update.sh** in the user's root folder and just execute it using `sh ~/wsl-update.sh`

Use this script to create wsl-update.sh and make it executable.

```shell
cat <<EOT >> ~/wsl-update.sh
#!/bin/sh
sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get clean -y
EOT
chmod +X ~/wsl-update.sh
```
