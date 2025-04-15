const payButtons = document.querySelectorAll('.payButton');
if (payButtons.length > 0) {
    payButtons.forEach(payButton=>{
        payButton.addEventListener('click', async(e) => {
            e.preventDefault();
            const parent = e.target.closest('.makePayment');
            const country = parent.getAttribute('data-country');
            const phoneNumber = parent.querySelector('#phoneNumber').value;
            const network = parent.querySelector('#network').value;
            const paying = parent.querySelector('#paying');
            const paymentProcessed = parent.querySelector('#paymentProcessed');
            const payButton = parent.querySelector('.payButton');
            try {
                if (!currentUser) {
                    window.location.href = '/login';
                    return;
                    
                }
                paying.style.display = 'block';
                await fetch('/makepayment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phoneNumber,
                        network,
                        country,
                        ...currentUser
                    })
                }).then((res) => res.json()).then((data) => {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data.status === 'success') {
                        paying.style.display = 'none';
                        paymentProcessed.style.display = 'block';
                        payButton.setAttribute('disabled', 'true');
                        window.location.href = data.meta.authorization.redirect;
                      
                    }
                    if (data.status === 'error') {
                        window.location.href = '/makepayment';
                    }
                })
                
            } catch (error) {
                const errorMessage = error.message;
                alert(errorMessage);
            }

    })
})
}
 
  



    // try {
    //     sendPayment.addEventListener('submit', async(e) => {
    //         console.log(e.target.data-country);
    //         e.preventDefault();
    //         if (!currentUser) {
    //             window.location.href = '/login';
    //             return;
    //         }
    //         const phoneNumber  = document.getElementById('phoneNumber').value;
    //         const network  = document.getElementById('network').value;
    //         paying.style.display = 'block';
    //         await fetch('/makepayment', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 phoneNumber,
    //                 network,
    //                 ...currentUser
    //             })
    //         }).then((res) => res.json()).then((data) => {
    //             data = JSON.parse(data);
    //             if (data.status === 'success') {
    //                 paying.style.display = 'none';
    //                 paymentProcessed.style.display = 'block';
    //                 payButton.setAttribute('disabled', 'true');
    //                 window.location.href = data.meta.authorization.redirect;
                  
    //             }
    //             if (data.status === 'error') {
    //                 window.location.href = '/makepayment';
    //             }
    //         })

           
    //     });
        
    // } catch (error) {
        
    // }