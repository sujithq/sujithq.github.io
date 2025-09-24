# .NET 10.0 Upgrade Report

## Project target framework modifications

| Project name          | Old Target Framework | New Target Framework | Commits                   |
|:----------------------|:-------------------:|:-------------------:|---------------------------|
| Crawler\Crawler.csproj |   net9.0            | net10.0             | 842664a0, bcc12c40, dd9b345e |

## NuGet Packages

| Package Name                                           | Old Version | New Version              | Commit Id                                 |
|:-------------------------------------------------------|:-----------:|:------------------------:|-------------------------------------------|
| Microsoft.Extensions.Configuration                     |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Configuration.EnvironmentVariables|   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Configuration.Json                |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Configuration.UserSecrets         |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Hosting                           |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Http                              |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Logging.Console                   |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Options                           |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |
| Microsoft.Extensions.Options.ConfigurationExtensions   |   9.0.8     | 10.0.0-rc.1.25451.107   | bcc12c40                                  |

## All commits

| Commit ID              | Description                                                                      |
|:-----------------------|:---------------------------------------------------------------------------------|
| 842664a0               | Commit upgrade plan                                                              |
| bcc12c40               | Update Microsoft.Extensions packages to v10 RC1                                 |
| dd9b345e               | Update Crawler.csproj to .NET 10.0                                             |

## Project feature upgrades

Contains summary of modifications made to the project assets during different upgrade stages.

### Crawler\Crawler.csproj

Here is what changed for the project during upgrade:

- Target framework successfully upgraded from .NET 9.0 to .NET 10.0
- All Microsoft.Extensions packages upgraded from version 9.0.8 to 10.0.0-rc.1.25451.107 (Release Candidate 1)
- Project configuration updated to use preview features of .NET 10.0
- No breaking changes detected during the upgrade process

## Next steps

- Test your application thoroughly with .NET 10.0 to ensure all functionality works as expected
- Monitor for any runtime differences between .NET 9.0 and .NET 10.0
- Consider updating any other dependencies that may have .NET 10.0 specific versions
- Keep track of the .NET 10.0 release schedule as it's currently in preview/RC stage