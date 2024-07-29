


document.addEventListener('DOMContentLoaded', function() {
    // Function to set the theme
    function setTheme(theme) {
        // set a data attribute on the root element with the theme name
        document.documentElement.setAttribute('data-theme', theme);
        // save the theme to the localStorage so it persists across sessions
        localStorage.setItem('theme', theme);
    }

    // Attaching event listeners to theme buttons.
    // When the light mode button is clicked, we'll set the theme to light
    document.getElementById('light-mode-toggle').addEventListener('click', function() {
        setTheme('light');
    });

    // // When the dark mode button is clicked, we'll set the theme to dark
    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        setTheme('dark');
    });



    // Load theme from local storage
    // This line checks if there is a saved theme in localStorage
    // If it exists, we use it; if not, we default to light, which is light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);



    // Toggle Menu
    // Select the menu icon
    const menuIcon = document.querySelector('.menu-icon');
    // This attaches a function to the onclick event of the menuIcon. This means that whenever the menuIcon is clicked, the code inside this function will run.
    menuIcon.onclick = function() {
        const menu = document.getElementById('menu');
        // Check if the menu is currently displayed (block means visible)
        if (menu.style.display === 'block') {
            // If it is visible, hide it
            menu.style.display = 'none';
        } else {
            // show it
            menu.style.display = 'block';
        }
    };
});
