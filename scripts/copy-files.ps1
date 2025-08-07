# List of vendors and files to copy
$filesToCopy = @(
    @{ Vendor = "aos"; FileName = "dist/aos.js"; Destination = "assets/vendor/aos/js" ; Source = "node_modules" }
    @{ Vendor = "aos"; FileName = "dist/aos.css"; Destination = "assets/vendor/aos/css" ; Source = "node_modules" }
    @{ Vendor = "bootstrap"; FileName = "dist/js/bootstrap.bundle.min.js"; Destination = "assets/vendor/bootstrap/js" ; Source = "node_modules" }
    @{ Vendor = "swiper"; FileName = "swiper-bundle.min.js"; Destination = "assets/vendor/swiper/js" ; Source = "node_modules" }
    @{ Vendor = "swiper"; FileName = "swiper-bundle.min.css"; Destination = "assets/vendor/swiper/css" ; Source = "node_modules" }
    @{ Vendor = "bootstrap-icons"; FileName = "font/fonts/bootstrap-icons.woff"; Destination = "static/scss/fonts" ; Source = "node_modules" }
    @{ Vendor = "bootstrap-icons"; FileName = "font/fonts/bootstrap-icons.woff2"; Destination = "static/scss/fonts" ; Source = "node_modules" }
)

# Import the function
function Copy-NodeModuleFile {
    param (
        [string]$Source,
        [string]$Vendor,
        [string]$FileName,
        [string]$Destination
    )


    # Ensure vendor and filename are provided
    if (-not $Vendor -or -not $FileName -or -not $Source -or -not $Destination) {
        Write-Host "Source, Vendor FileName and Destination parameters are required." -ForegroundColor Red
        return
    }
    else {
        Write-Host "Copying $Source/$Vendor/$FileName to $Destination ..." -ForegroundColor Yellow
    }

    # Ensure the source exists
    $VendorPath = Join-Path -Path $Source -ChildPath $Vendor
    if (-not (Test-Path -Path $VendorPath)) {
        Write-Host "Vendor path '$VendorPath' does not exist." -ForegroundColor Red
        return
    }
    else {
        Write-Host "Vendor path '$VendorPath' exists." -ForegroundColor Yellow
    }

    $sourcefile = Join-Path -Path $Source -ChildPath $Vendor
    $sourcefile = Join-Path -Path $sourcefile -ChildPath $FileName

    if (-not (Test-Path -Path $sourcefile)) {
        Write-Host "Source file '$sourcefile' does not exist." -ForegroundColor Red
        return
    }
    else {
        Write-Host "Source file '$sourcefile' exists." -ForegroundColor Yellow
    }

    # Ensure the destination exists
    if (-not (Test-Path -Path $Destination)) {
        New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    }
    # Copy the file
    Copy-Item -Path $sourcefile -Destination $Destination -Force

    Write-Host "Copied '$sourcefile' to '$Destination'." -ForegroundColor Green

}


    # Prism.js language files (all available) - destination updated for autoloader compatibility
    @{ Vendor = "prismjs"; FileName = "components/prism-abap.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-abap.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-abnf.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-abnf.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-actionscript.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-actionscript.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-ada.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-ada.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-agda.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-agda.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-al.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-al.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-antlr4.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-antlr4.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-apacheconf.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-apacheconf.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-apex.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-apex.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-apl.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-apl.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-applescript.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-applescript.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-aql.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-aql.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-arduino.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-arduino.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-arff.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-arff.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-armasm.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-armasm.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-arturo.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-arturo.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-asciidoc.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-asciidoc.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-asm6502.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-asm6502.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-asmatmel.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-asmatmel.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-aspnet.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-aspnet.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-autohotkey.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-autohotkey.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-autoit.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-autoit.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-avisynth.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-avisynth.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-avro-idl.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-avro-idl.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-awk.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-awk.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bash.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bash.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-basic.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-basic.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-batch.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-batch.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bbcode.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bbcode.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bbj.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bbj.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bicep.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bicep.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-birb.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-birb.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bison.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bison.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bnf.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bnf.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bqn.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bqn.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-brainfuck.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-brainfuck.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-brightscript.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-brightscript.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bro.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bro.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bsl.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-bsl.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-c.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-c.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cfscript.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cfscript.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-chaiscript.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-chaiscript.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cil.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cil.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cilkc.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cilkc.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cilkcpp.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cilkcpp.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-clike.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-clike.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-clojure.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-clojure.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cmake.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cmake.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cobol.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cobol.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-coffeescript.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-coffeescript.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-concurnas.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-concurnas.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cooklang.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cooklang.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-coq.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-coq.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-core.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-core.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cpp.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cpp.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-crystal.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-crystal.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-csharp.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-csharp.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cshtml.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cshtml.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-csp.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-csp.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-css-extras.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-css-extras.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-css.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-css.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-csv.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-csv.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cue.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cue.min.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cypher.js"; Destination = "static/components" ; Source = "node_modules" }
    @{ Vendor = "prismjs"; FileName = "components/prism-cypher.min.js"; Destination = "static/components" ; Source = "node_modules" }
