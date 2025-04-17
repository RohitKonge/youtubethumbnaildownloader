document.addEventListener('DOMContentLoaded', () => {
    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const getThumbnailBtn = document.getElementById('getThumbnailBtn');
    const resultsSection = document.getElementById('results');
    
    // Image elements
    const hdImage = document.getElementById('hdImage');
    const sdImage = document.getElementById('sdImage');
    const normalImage1 = document.getElementById('normalImage1');
    const normalImage2 = document.getElementById('normalImage2');
    const normalImage3 = document.getElementById('normalImage3');
    
    // Download buttons
    const hdDownload = document.getElementById('hdDownload');
    const sdDownload = document.getElementById('sdDownload');
    const normalDownload1 = document.getElementById('normalDownload1');
    const normalDownload2 = document.getElementById('normalDownload2');
    const normalDownload3 = document.getElementById('normalDownload3');
    
    // Function to force download image
    const forceDownload = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error downloading image:', error);
                alert('Failed to download image. Please try again.');
            });
    };
    
    // Add click handlers for download buttons
    const setupDownloadButton = (button, url, filename) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if(!button.classList.contains('disabled')) {
                forceDownload(url, filename);
            }
        });
    };
    
    getThumbnailBtn.addEventListener('click', () => {
        const youtubeUrl = youtubeUrlInput.value.trim();
        
        if (!youtubeUrl) {
            alert('Please enter a YouTube URL');
            return;
        }
        
        const videoId = extractVideoId(youtubeUrl);
        
        if (!videoId) {
            alert('Invalid YouTube URL. Please enter a valid URL.');
            return;
        }
        
        // Set thumbnail URLs for different sizes
        const hdThumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const sdThumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
        const normalThumbnailUrl1 = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const normalThumbnailUrl2 = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        const normalThumbnailUrl3 = `https://img.youtube.com/vi/${videoId}/default.jpg`;
        
        // Set images
        hdImage.src = hdThumbnailUrl;
        sdImage.src = sdThumbnailUrl;
        normalImage1.src = normalThumbnailUrl1;
        normalImage2.src = normalThumbnailUrl2;
        normalImage3.src = normalThumbnailUrl3;
        
        // Reset button states
        const downloadButtons = [hdDownload, sdDownload, normalDownload1, normalDownload2, normalDownload3];
        downloadButtons.forEach(button => {
            button.classList.remove('disabled');
            button.style.backgroundColor = '#4285f4';
            button.style.cursor = 'pointer';
        });
        
        // Set up download buttons
        hdDownload.textContent = 'Download HD Thumbnail Image';
        setupDownloadButton(hdDownload, hdThumbnailUrl, `${videoId}_hd_thumbnail.jpg`);
        
        sdDownload.textContent = 'Download SD Thumbnail Image';
        setupDownloadButton(sdDownload, sdThumbnailUrl, `${videoId}_sd_thumbnail.jpg`);
        
        normalDownload1.textContent = 'Download Normal Thumbnail Image(480x360)';
        setupDownloadButton(normalDownload1, normalThumbnailUrl1, `${videoId}_normal_480x360_thumbnail.jpg`);
        
        normalDownload2.textContent = 'Download Normal Thumbnail Image(320x180)';
        setupDownloadButton(normalDownload2, normalThumbnailUrl2, `${videoId}_normal_320x180_thumbnail.jpg`);
        
        normalDownload3.textContent = 'Download Normal Thumbnail Image(120x90)';
        setupDownloadButton(normalDownload3, normalThumbnailUrl3, `${videoId}_normal_120x90_thumbnail.jpg`);
        
        // Show results
        resultsSection.classList.remove('hidden');
    });
    
    // Function to extract video ID from YouTube URL
    function extractVideoId(url) {
        // Regular YouTube URL (youtube.com/watch?v=VIDEO_ID)
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        
        return (match && match[7].length === 11) ? match[7] : null;
    }
    
    // Handle download error for non-existing thumbnails
    const allImages = [hdImage, sdImage, normalImage1, normalImage2, normalImage3];
    
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            // If image fails to load, set a placeholder or default image
            this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18973f46e2c%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18973f46e2c%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332276%22%3EThumbnail%20Not%20Available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
            // Disable corresponding download button
            const index = allImages.indexOf(this);
            const downloadButtons = [hdDownload, sdDownload, normalDownload1, normalDownload2, normalDownload3];
            
            if (index !== -1) {
                downloadButtons[index].textContent = 'Thumbnail Not Available';
                downloadButtons[index].classList.add('disabled');
                downloadButtons[index].style.backgroundColor = '#cccccc';
                downloadButtons[index].style.cursor = 'not-allowed';
            }
        });
    });
}); 