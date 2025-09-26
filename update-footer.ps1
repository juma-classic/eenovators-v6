# Footer Update Script for Eenovators Website
# This script updates all main pages with navigation links and custom social media icons

$pages = @(
    @{
        Name = "services"
        Path = "c:\My Web Sites\eenovators-v6\eenovators-v6\eenovators.com\services\index.html"
        AboutLink = "../about-us/index.html"
        ContactLink = "../contact/index.html"
    },
    @{
        Name = "solutions"  
        Path = "c:\My Web Sites\eenovators-v6\eenovators-v6\eenovators.com\solutions\index.html"
        AboutLink = "../about-us/index.html"
        ContactLink = "../contact/index.html"
    },
    @{
        Name = "training"
        Path = "c:\My Web Sites\eenovators-v6\eenovators-v6\eenovators.com\training\index.html"
        AboutLink = "../about-us/index.html"
        ContactLink = "../contact/index.html"
    }
)

Write-Host "Starting footer update process for remaining main pages..."

foreach ($page in $pages) {
    Write-Host "Processing $($page.Name) page..."
    
    try {
        # Read the file content
        $content = Get-Content $page.Path -Raw -Encoding UTF8
        
        # Update 1: Add CSS file if not already present
        if ($content -notmatch 'custom-social-icons\.css') {
            Write-Host "  Adding custom CSS file to $($page.Name)..."
            $content = $content -replace '</head>', "	<!-- Custom Social Media Icons -->`r`n	<link rel=`"stylesheet`" href=`"../assets/css/custom-social-icons.css`" />`r`n</head>"
        }
        
        # Update 2: Convert navigation text to links
        Write-Host "  Updating navigation links in $($page.Name)..."
        
        # Solutions/Services/Training section
        $content = $content -replace 'Solutions<br />\s*Services<br />\s*Training', '<a href="../solutions/index.html">Solutions</a><br />
<a href="../services/index.html">Services</a><br />
<a href="../training/index.html">Training</a>'
        
        # Yeep/WED section  
        $content = $content -replace 'Yeep<br />\s*WED', '<a href="../yeep-2/index.html">Yeep</a><br />
<a href="../world-energy-day/index.html">WED</a>'
        
        # About us/Resources/Contact section
        $aboutLink = $page.AboutLink
        $contactLink = $page.ContactLink
        $content = $content -replace 'About us<br />\s*Resources<br />\s*Contact', "<a href=`"$aboutLink`">About us</a><br />
<a href=`"../case-studies/index.html`">Resources</a><br />
<a href=`"$contactLink`">Contact</a>"
        
        Write-Host "  Navigation links updated for $($page.Name)"
        Write-Host "  Content prepared for $($page.Name). Manual social media update needed."
        
        # Save the updated content
        Set-Content -Path $page.Path -Value $content -Encoding UTF8
        
        Write-Host "  $($page.Name) page updated successfully!"
        
    } catch {
        Write-Host "  Error processing $($page.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Footer update process completed!" -ForegroundColor Green