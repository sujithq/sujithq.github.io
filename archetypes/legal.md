+++
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
slug = '{{ .File.ContentBaseName }}'
url = '/'
date = '{{ .Date.Format "2006-01-02" }}'
lastmod = '{{ .Date.Format "2006-01-02" }}'
draft = true
toc = false
description = ""
type = 'legal'
layout = 'legal'
+++
