document.getElementById('screenshotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
        const url = e.target.url.value;
        const res = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'url=' + encodeURIComponent(url),
        });
        const blob = await res.blob();
        const img = document.getElementById('result');
        img.src = URL.createObjectURL(blob);
        img.style.display = 'block';
        img.style.minHeight = '600px';
    } finally {
        btn.disabled = false;
    }
});
