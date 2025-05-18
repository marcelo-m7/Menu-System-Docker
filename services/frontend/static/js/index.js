export function renderPublicMenu(appElement) {
    appElement.innerHTML = ''; // Clear previous content

    // Add a title and a container for the menu
    const title = document.createElement('h1');
    title.textContent = 'Weekly Menu';
    appElement.appendChild(title);

    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';
    menuContainer.innerHTML = '<p>Loading menu...</p>'; // Initial loading message
    appElement.appendChild(menuContainer);

    fetch('/menu') // Fetch data from the backend API endpoint
        .then(response => response.json())
        .then(menuData => {
            menuContainer.innerHTML = ''; // Clear the "Loading" message

            if (menuData.length === 0) {
                menuContainer.innerHTML = '<p>No menu available at the moment.</p>';
                return;
            }

            const menuByDay = menuData.reduce((acc, item) => {
                if (!acc[item.day_of_week]) {
                    acc[item.day_of_week] = [];
                }
                acc[item.day_of_week].push(item);
                return acc;
            }, {});

            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            daysOrder.forEach(day => {
                if (menuByDay[day]) { // Only process days that have menu items
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
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
            document.getElementById('menu-container').innerHTML = '<p>Error loading menu.</p>';
        });
});