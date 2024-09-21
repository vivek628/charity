document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userdetail = await axios.get('http://localhost:8000/getngo', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(userdetail.data.detail);
    const detail = userdetail.data.detail;

    const charityData = {
        CharityId: 1,
        name: detail.name,
        email: detail.Email,
        mission: detail.mission, // Fixed typo from 'mession' to 'mission'
        goals: detail.goals,
        projects: detail.projects,
        website: detail.website,
    };

    // Check if any data is empty
    const hasEmptyFields = Object.values(charityData).some(value => value === null || value === '');

    if (hasEmptyFields) {
        // Create form fields dynamically
        const formFields = [
            { label: 'Name', key: 'name', type: 'text', required: true },
            { label: 'Email', key: 'email', type: 'email', required: true },
            { label: 'Mission', key: 'mission', type: 'text', required: true },
            { label: 'Goals', key: 'goals', type: 'text', required: true },
            { label: 'Projects', key: 'projects', type: 'text', required: true },
            { label: 'Website', key: 'website', type: 'url', required: true },
        ];

        formFields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;

            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.key;
            input.name = field.key;
            if (field.required) {
                input.required = true;
            }
            input.value = charityData[field.key] || ''; // Pre-fill value or empty string
            label.appendChild(input);
            document.getElementById('charityForm').appendChild(label);
        });

        const btn = document.createElement('button');
        btn.textContent = 'Save';
        btn.style.marginLeft = '160px';
        btn.style.padding = '15px';
        document.getElementById('charityForm').appendChild(btn);

        btn.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent form submission

            const mission = document.getElementById('mission').value;
            const goals = document.getElementById('goals').value;
            const projects = document.getElementById('projects').value;
            const website = document.getElementById('website').value;

            console.log(mission, goals, projects, website);

            await axios.post('http://localhost:8000/ngodetails', {
                mission,
                goals,
                projects,
                website
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert("Data saved");
            window.location.href = 'http://localhost:8000/ngodisplay';
        });

        document.getElementById('charityForm').style.display = 'block';
    }
});

// Profile button event listener
document.getElementById('profile').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const userdetail = await axios.get('http://localhost:8000/getngo', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // Assuming you want to display user details
    document.getElementById('totaldonation').style.display = 'none';
    document.getElementById('pro').style.display = 'block';

    // Make sure the element IDs correspond to your HTML
    const detail = userdetail.data.detail;
    document.getElementById('orgname').textContent = detail.name;
    document.getElementById('orgemail').textContent = detail.Email;
    document.getElementById('goals').textContent = detail.goals;
    document.getElementById('mission').textContent = detail.mission;
    document.getElementById('website').textContent = detail.website;
});
