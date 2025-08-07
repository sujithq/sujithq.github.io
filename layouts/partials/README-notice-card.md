# Notice Card Partial

A reusable partial component that provides consistent notice styling throughout Hugo templates, aligned with the `notice-card` shortcode.

## Usage

```go
{{ partial "notice-card.html" (dict 
  "type" "warning" 
  "title" "Custom Title" 
  "icon" "custom-icon" 
  "content" "Your notice content here") }}
```

## Parameters

- **type** (string, optional): The notice type/style. Default: `"info"`
- **title** (string, optional): Custom title text. Default: capitalized type name
- **icon** (string, optional): Custom Font Awesome icon name. Default: auto-selected based on type
- **content** (string, required): The notice content/message

## Supported Types

### Primary
```go
{{ partial "notice-card.html" (dict 
  "type" "primary" 
  "title" "Primary Notice" 
  "content" "Important primary information") }}
```

### Secondary  
```go
{{ partial "notice-card.html" (dict 
  "type" "secondary" 
  "title" "Secondary Notice" 
  "content" "Secondary information") }}
```

### Success
```go
{{ partial "notice-card.html" (dict 
  "type" "success" 
  "title" "Success!" 
  "content" "Operation completed successfully") }}
```

### Danger
```go
{{ partial "notice-card.html" (dict 
  "type" "danger" 
  "title" "Error" 
  "content" "Something went wrong") }}
```

### Warning
```go
{{ partial "notice-card.html" (dict 
  "type" "warning" 
  "title" "Warning" 
  "content" "Please be careful") }}
```

### Info
```go
{{ partial "notice-card.html" (dict 
  "type" "info" 
  "title" "Information" 
  "content" "Useful information") }}
```

### Light
```go
{{ partial "notice-card.html" (dict 
  "type" "light" 
  "title" "Light Notice" 
  "content" "Light themed notice") }}
```

### Dark
```go
{{ partial "notice-card.html" (dict 
  "type" "dark" 
  "title" "Dark Notice" 
  "content" "Dark themed notice") }}
```

## Default Icons by Type

- **primary**: `star`
- **secondary**: `info-circle`
- **success**: `check-circle`
- **danger**: `exclamation-triangle`
- **warning**: `exclamation-triangle`
- **info**: `info-circle`
- **light**: `info-circle`
- **dark**: `info-circle`

## Custom Icons

Override the default icon with any Font Awesome icon:

```go
{{ partial "notice-card.html" (dict 
  "type" "info" 
  "title" "Custom Icon" 
  "icon" "rocket"
  "content" "Using a custom rocket icon") }}
```

## Examples

### Unlisted Post Notice
```go
{{ partial "notice-card.html" (dict 
  "type" "warning" 
  "title" "Unlisted Post" 
  "icon" "eye-slash" 
  "content" "This post is not publicly listed and is only accessible via direct link.") }}
```

### Update Notice
```go
{{ partial "notice-card.html" (dict 
  "type" "info" 
  "title" "Update Available" 
  "icon" "download"
  "content" "A new version of this content is available.") }}
```

### Security Alert
```go
{{ partial "notice-card.html" (dict 
  "type" "danger" 
  "title" "Security Alert" 
  "icon" "shield-alt"
  "content" "This action requires elevated permissions.") }}
```
