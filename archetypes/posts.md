+++
title = '{{ replace (replaceRE "^[0-9]{4}-[0-9]{2}-[0-9]{2}-" "" (path.Base (path.Clean .File.Dir))) "-" " " | title }}'
slug = '{{ replaceRE "^[0-9]{4}-[0-9]{2}-[0-9]{2}-" "" (path.Base (path.Clean .File.Dir)) }}'
date = '{{ .Date.Format "2006-01-02 15:04:05-07:00" }}'
lastmod = '{{ .Date.Format "2006-01-02 15:04:05-07:00" }}'
draft = true
tags = []
categories = []
series = []

layout = "single"
audio = false
[params]
    cover = true
    author = "sujith"

description = ""
+++
