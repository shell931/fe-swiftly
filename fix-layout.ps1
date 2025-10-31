$files = @(
    "src/app/Layouts/Header/HeaderOne/HeaderOne.module.new.ts",
    "src/app/Layouts/Header/HeaderOne/HeaderOne.module.ts", 
    "src/app/Pages/Home/Home.module.ts",
    "src/app/AdminPanel/Store/Store.module.ts",
    "src/app/AdminPanel/Widget/Widget.module.ts",
    "src/app/AdminPanel/Transfers/Transfers.module.ts",
    "src/app/AdminPanel/Transactions/Transactions.module.ts",
    "src/app/AdminPanel/Products/Products.module.ts",
    "src/app/AdminPanel/Reports/Reports.module.ts",
    "src/app/AdminPanel/Invoices/Invoices.module.ts",
    "src/app/AdminPanel/AdminProducts/AdminProducts.module.ts",
    "src/app/AdminPanel/AdminAccount/AdminAccount.module.ts",
    "src/app/AdminPanel/admin-panel.module.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing: $file"
        $content = Get-Content $file -Raw
        $content = $content -replace "import { FlexLayoutModule } from '@ngbracket/ngx-layout';", "import { LayoutModule } from '@angular/cdk/layout';"
        $content = $content -replace "FlexLayoutModule", "LayoutModule"
        Set-Content -Path $file -Value $content
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "All files processed!"
