[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$GameRoot)
$ErrorActionPreference = 'Stop'
function Get-Sha256([string]$Path) {
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash([IO.File]::ReadAllBytes($Path)))).Replace('-', '').ToLowerInvariant() }
    finally { $sha.Dispose() }
}
$packageRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $packageRoot 'patch_manifest.json'
$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$gameRoot = [IO.Path]::GetFullPath($GameRoot)
$backupRoot = Join-Path $gameRoot '.cnpatch_backup'
$statePath = Join-Path $backupRoot 'state.json'
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
$state = @{ format = 1; installedAt = (Get-Date).ToString('o'); files = @() }
$rootPrefix = $gameRoot.TrimEnd('\') + '\'
foreach ($entry in @($manifest.files)) {
    $relative = [string]$entry.file
    if ([IO.Path]::IsPathRooted($relative) -or $relative.Contains('..')) { throw "不安全的补丁路径: $relative" }
    $destination = [IO.Path]::GetFullPath((Join-Path $gameRoot $relative))
    if (-not $destination.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw "补丁路径越界: $relative" }
    $source = Join-Path $packageRoot (Join-Path 'patch' $relative)
    $backup = Join-Path $backupRoot $relative
    if (Test-Path -LiteralPath $destination) {
        $hash = Get-Sha256 $destination
        if ($entry.originalSha256 -and $hash -ne ([string]$entry.originalSha256).ToLowerInvariant()) { throw "原文件版本不匹配，已停止: $relative" }
        if (-not (Test-Path -LiteralPath $backup)) {
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backup) | Out-Null
            Copy-Item -LiteralPath $destination -Destination $backup
        }
    }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Force
    $state.files += [pscustomobject]@{ file = $relative; patchSha256 = ([string]$entry.patchSha256).ToLowerInvariant(); hadOriginal = (Test-Path -LiteralPath $backup) }
}
$state | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statePath -Encoding UTF8
if (@($manifest.files).Count -eq 0) { Write-Host '当前翻译表还没有已完成的目标文本，未写入游戏文件。' } else { Write-Host ("汉化补丁已安装，共处理 {0} 个文件。" -f @($manifest.files).Count) }
