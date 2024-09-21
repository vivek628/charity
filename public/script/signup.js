const submitbtn = document.getElementById('submitbtn');
submitbtn.addEventListener('click', () => {
   
    event.preventDefault();
    const type=document.getElementById('usertype').value
    if(type=='user')
    {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(username,email,password)
    
        axios.post('http://localhost:8000/postsignup', {
            username,
            email,
            password,
           
        }).then(response => {
            alert(`${response.data.message}`);
            window.location.href = 'http://localhost:8000'; 
        }).catch(error => {
            console.error('There was a problem with the Axios request:', error);
        });
    }
    else if(type=='ngo')
    {
        const orgname=document.getElementById('name').value
        const email=document.getElementById('email').value
        const password=document.getElementById('password').value
        console.log(orgname,email,password)
        axios.post('http://localhost:8000/register',{
            orgname,email,password
        }).then((resposne)=>{
            alert(`${resposne.data.msg}`)
            window.location.href = 'http://localhost:8000'; 
        }).catch(e=>{
            alert("something went wrong")
        })

    }
   
 
});
