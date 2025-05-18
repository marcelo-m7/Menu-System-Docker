document.addEventListener('DOMContentLoaded', function() {
    // Fetch menu data from the API
    fetch('/menu') // Fetch data from the backend API endpoint
        .then(response => response.json())
        .then(menuData => {
            // Assuming there's an element with ID 'menu-container' in index.html
            const menuContainer = document.getElementById('menu-container');
            menuContainer.innerHTML = ''; // Clear the "Loading" message

            if (menuData.length === 0) {
                // Display a message if no menu data is available
                menuContainer.innerHTML = '<p>No menu available at the moment.</p>';
                return;
            }

            // Group menu items by day of the week
            const menuByDay = menuData.reduce((acc, item) => {
                // Use day_of_week as the key for grouping
                if (!acc[item.day_of_week]) {
                    acc[item.day_of_week] = [];
                }
                acc[item.day_of_week].push(item);
                return acc;
            }, {});
            
            // Define the desired order of days
            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; // Adjust if your day names are different

            // Display menu by day
            daysOrder.forEach(day => {
                if (menuByDay[day]) { // Only process days that have menu items
                const dayEntry = menuByDay[day];
                const dayElement = document.createElement('h2');
                dayElement.textContent = day;
                menuContainer.appendChild(dayElement);

                const dayMenuList = document.createElement('ul');
                menuByDay[day].forEach(item => {
                    const dishDetails = `
                        <li>
                            <strong>${item.dish_name}</strong>: ${item.description} (Allergens: ${item.allergen_names || 'None'})
                            <p><em>Week of ${item.week_start_date} to ${item.week_end_date}</em></p>
                        </li>
                    `;
                    dayMenuList.innerHTML += dishDetails;
                });
                menuContainer.appendChild(dayMenuList);
            }
        });
        
        }) // Added missing closing parenthesis for the second then() block
        .catch(error => {
            // Handle errors during the fetch process
            console.error('Error fetching menu:', error);
            document.getElementById('menu-container').innerHTML = '<p>Error loading menu.</p>';
        });
});