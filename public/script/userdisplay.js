document.addEventListener('DOMContentLoaded', async () => {
    const name = document.getElementById('username');
    const email = document.getElementById('useremail');
    const donated=document.getElementById('amountdonated')


    const token = localStorage.getItem('token');
    try {
        const userDetail = await axios.get('http://localhost:8000/getuser', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(userDetail)
        name.textContent = userDetail.data.User.name;
        email.textContent = userDetail.data.User.email;
        donated.textContent=userDetail.data.donor
        
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
});

document.getElementById('donate').addEventListener('click', async () => {
    const donationTableContainer = document.getElementById('donationTableContainer');
    const donationFormContainer = document.getElementById('donationFormContainer');
    
    
    document.getElementById('upper').style.display = 'none';
    document.getElementById('totaldonation').style.display = 'none';
    
    
    donationTableContainer.innerHTML = '';
    donationFormContainer.style.display = 'none'; 

    try {
        
        const organizations = await axios.get('http://localhost:8000/getorg');
        const table = document.createElement('table');

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Organization Name</th>
                    <th>Goals</th>
                    <th>Projects</th>
                    <th>Website</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${organizations.data.data.map(org => `
                    <tr>
                        <td>${org.name}</td>
                        <td>${org.goals}</td>
                        <td>${org.projects}</td>
                        <td><a href="${org.website}" target="_blank">Visit</a></td>
                        <td><button class="action-button" data-id="${org.Email}">Donate</button></td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML += `
            <style>
                table, th, td {
                    border: 1px solid black;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                }
                tr:hover {
                    background-color: #f1f1f1;
                }
            </style>
        `;

        donationTableContainer.appendChild(table);
        donationTableContainer.style.display = 'block'; 

        const actionButtons = document.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                
                donationTableContainer.style.display = 'none';
                donationFormContainer.style.display = 'block';

              
                const orgName = button.closest('tr').children[0].innerText; 
                document.getElementById('orgName').value = orgName; 
            });
        });
    } catch (error) {
        console.error("Error fetching organizations:", error);
    }
});


document.getElementById('donationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const orgName = document.getElementById('orgName').value;
    const amount = (document.getElementById('amount').value)*100;
    console.log(typeof(amount),amount)

    try {
       
        const response = await axios.post('http://localhost:8000/donate', {
            orgName,
            amount
        });

       
        const order = response.data;
        console.log(order)
         console.log(order.order.currency)
        
         const razorpay_id=order.razorpay_key
       
        console.log(razorpay_id)
        console.log(order.order.id)
        const options = {
            key: razorpay_id, 
            amount: order.order.amount, 
            currency: order.order.currency,
            name: 'Donation to ' + orgName,
            description: 'Donation for ' + orgName,
            order_id: order.order.id, 
            handler: async function (response) {
            
                console.log("Payment Successful:", response);
                alert('Payment successful: ' + response.razorpay_payment_id);
                const paymentId=response.razorpay_payment_id
                const amount=order.order.amount
                const org=orgName
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:8000/savepayment', {
                    paymentId,
                    amount,
                    org
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                window.location.href = 'http://localhost:8000/userdisplay'; 
                
            },
            theme: {
                color: '#3399cc'
            }
        };

      
        const paymentObject = new Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.error('Error processing donation:', error);
        alert('Donation failed: ' + error.message); 
    }
});
document.getElementById('history').addEventListener('click',async()=>{
    console.log("j")
    try{
        const token = localStorage.getItem('token');
        const data=await axios.get('http://localhost:8000/alldonation',{
            headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log(data.data)
    }
   catch(e)
   {
    console.log("err in getting history",e)
   }
})
