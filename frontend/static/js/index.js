document.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:5000/menu') // Fetch data from your Flask backend
        .then(response => response.json())
        .then(menuData => {
            const menuContainer = document.getElementById('menu-container');
            menuContainer.innerHTML = ''; // Clear the "Loading" message

            if (menuData.length === 0) {
                menuContainer.innerHTML = '<p>No menu available at the moment.</p>';
                return;
            }

            // Group menu items by day of the week
            const menuByDay = menuData.reduce((acc, item) => {
                if (!acc[item.day_of_week]) {
                    acc[item.day_of_week] = [];
                }
                acc[item.day_of_week].push(item);
                return acc;
            }, {});

            // Display menu by day
            for (const day in menuByDay) {
                const dayElement = document.createElement('h2');
                dayElement.textContent = day;
                menuContainer.appendChild(dayElement);

                const dayMenuList = document.createElement('ul');
                menuByDay[day].forEach(item => {
                    const dishDetails = `
                        <li>
                            <strong>${item.dish_name}</strong>: ${item.description} (Allergens: ${item.allergen_names || 'None'})
                        </li>
                    `;
                    dayMenuList.innerHTML += dishDetails;
                });
                menuContainer.appendChild(dayMenuList);
            }
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
            document.getElementById('menu-container').innerHTML = '<p>Error loading menu.</p>';
        });
});