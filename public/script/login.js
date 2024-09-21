const submitbtn= document.getElementById('loginForm')

submitbtn.addEventListener('submit',(e)=>{
    e.preventDefault()
  
    const password=document.getElementById('password').value
    const email=document.getElementById('email').value
    const type=document.getElementById('typeof').value

    console.log(password,email)
        axios.post('http://localhost:8000/postlogin',{
            password,
            email,
            type
          
        })  .then(response => {
            
           alert('Login successful!');
           
           const token=response.data.token
           console.log(token)
           localStorage.setItem('token',token)
           if(type=='user')
           {
            window.location.href = 'http://localhost:8000/userdisplay';
           }
           else if(type=='ngo')
           {
            window.location.href = 'http://localhost:8000/ngodisplay';
           }
          
        })
        .catch(error => {
            console.error('There was a problem with the Axios request:', error);
            alert('Login failed. Please try again.');
        });
       
})
    
