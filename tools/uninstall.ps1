[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$GameRoot)
$ErrorActionPreference = 'Stop'
function Get-Sha256([string]$Path) {
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash([IO.File]::ReadAllBytes($Path)))).Replace('-', '').ToLowerInvariant() }
    finally { $sha.Dispose() }
}
$gameRoot = [IO.Path]::GetFullPath($GameRoot)
$backupRoot = Join-Path $gameRoot '.cnpatch_backup'
$statePath = Join-Path $backupRoot 'state.json'
if (-not (Test-Path -LiteralPath $statePath)) { Write-Host '未找到汉化补丁安装记录，无需卸载。'; exit 0 }
$state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
$rootPrefix = $gameRoot.TrimEnd('\') + '\'
foreach ($entry in @($state.files)) {
    $relative = [string]$entry.file
    if ([IO.Path]::IsPathRooted($relative) -or $relative.Contains('..')) { throw "不安全的补丁路径: $relative" }
    $destination = [IO.Path]::GetFullPath((Join-Path $gameRoot $relative))
    if (-not $destination.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw "补丁路径越界: $relative" }
    $backup = Join-Path $backupRoot $relative
    if (Test-Path -LiteralPath $backup) {
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
        Copy-Item -LiteralPath $backup -Destination $destination -Force
    } elseif (Test-Path -LiteralPath $destination) {
        $hash = Get-Sha256 $destination
        if ($hash -eq ([string]$entry.patchSha256).ToLowerInvariant()) { Remove-Item -LiteralPath $destination -Force }
    }
}
Remove-Item -LiteralPath $backupRoot -Recurse -Force
Write-Host '汉化补丁已卸载，原文件已恢复。'
