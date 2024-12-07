document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createPoolForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const poolData = {
            name: document.getElementById('name').value,
            ticker: document.getElementById('ticker').value,
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('imageUrl').value,
            network: document.getElementById('network').value,
            socialLinks: {
                website: document.getElementById('website').value,
                twitter: document.getElementById('twitter').value,
                github: document.getElementById('github').value
            }
        };

        // Basic form validation
        if (!poolData.name || !poolData.ticker || !poolData.description || !poolData.network) {
            alert('Please fill out all required fields.');
            return;
        }

        // Here you would typically send the data to a server
        // For this example, we'll just log it to the console
        console.log('Pool Data:', poolData);

        // Simulating a successful pool creation
        alert('Pool created successfully!');
        form.reset();
    });

    // Optional: Add input validation and formatting
    document.getElementById('ticker').addEventListener('input', function(e) {
        this.value = this.value.toUpperCase();
    });

    document.getElementById('twitter').addEventListener('input', function(e) {
        if (!this.value.startsWith('@') && this.value !== '') {
            this.value = '@' + this.value;
        }
    });
});