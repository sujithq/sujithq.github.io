---
#layout: post
#current: post
#cover: img/cover.jpg
#navigation: True
#title: 
#date: 2022-05-24 09:00:00Z
#tags: [azure, azure-functions, visual-studio, teamcity, octopus-deploy]
#class: post-template
#subclass: 'post'
#author: sujith
#disqus: False
title: 'Draft 2'
subtitle: 'Draft 2'
summary: 'Draft 2'
authors:
- sujith
tags:
- Draft
categories:
- Draft
date: "2022-06-06 06:00:00Z"
lastmod: "2022-06-06 06:00:00Z"
featured: true
draft: true

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

> Work in progress

Draft makes it easier for developers to get started building apps that run on Kubernetes by taking a non-containerized application and generating the Dockerfiles, Kubernetes manifests, Helm charts, Kustomize configuration, and other artifacts associated with a containerized application. Draft can also generate a GitHub Action workflow file to quickly build and deploy applications onto any Kubernetes cluster.

install Go

```shell
sudo -i

# remove older installation
rm -rf /usr/local/go*
rm -rf /usr/local/go

# get latest version (1.18.3)
wget https://go.dev/dl/go1.18.3.linux-amd64.tar.gz
tar -xvf go1.18.3.linux-amd64.tar.gz
mv go /usr/local

```

Add Go to our environment profile so that it can get picked up by our command line. Open ~/.bashrc

```shell
code ~/.bashrc

```

Update the settings are per below:

```shell
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

```

Restart your command line/terminal and verify that the latest version has been installed correctly by typing

```shell
go version

```