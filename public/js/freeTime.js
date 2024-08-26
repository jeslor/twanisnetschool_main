const clearAllTimers =  document.getElementById('clearAllTimers');
if (clearAllTimers) {
    clearAllTimers.addEventListener('click', async (e) => {
        await fetch('/platformadmin/clearFreeTime',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(data => {
            window.location.reload();
            
        })
    });
}

window.addEventListener('load', () => {
const timmerOutputs = document.querySelectorAll('.timmerOutputs');
if (timmerOutputs) {
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
    timmerOutputs.forEach(output => {
        const currRemainingTimeHolder = output.querySelector('.secret');
        if (currRemainingTimeHolder) {
            let currTime = currRemainingTimeHolder.textContent;
            if (parseInt(currTime) <= 0) {
                currRemainingTimeHolder.textContent = 'No time set';
                
            }else{
                let secondsRemainingTime = parseInt(currTime/1000);
                let secondsInterval = setInterval(() => {
                    if (secondsRemainingTime <= 0) {
                        clearInterval(secondsInterval);
                        watchClock.textContent = '';
                        return; 
                    }
                    secondsRemainingTime -= 1;
                    watchClock.textContent = `${secondsRemainingTime}`;
                }, 1000);
                
                let currenttRemainingTime = parseInt(currTime/60000);
                let mysetInterval = setInterval(() => {
                    if (currenttRemainingTime <= 0) {
                        clearInterval(mysetInterval);
                        output.textContent = 'No time set';
                        return; 
                    }
                    currenttRemainingTime -= 1;
                    output.textContent = `Remaining ${currenttRemainingTime} minutes`;
                }, 60000);

                const watchClock = output.parentElement.querySelector('.watchClock');
            }
            
        }
    })
}
} );


const timmerButtons = document.querySelectorAll('.timmerButtons');
if (timmerButtons) {
    let remainingTime = 0;
    timmerButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            alert('You are about to set a free time');
            const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
            for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);            
            }
            const timmerId = e.target.dataset.timmerid;
            await fetch('/platformadmin/setFreeTime',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({timmerId})
            }).then(res => res.json()).then(data => {
                timmerButtons.forEach(button => {
                    const parent  = button.parentElement;
                    const outputParagraph = parent.querySelector('h3');
                    const watchClock = parent.querySelector('.watchClock');
                    watchClock.textContent = '';
                    outputParagraph.textContent = 'No time set';
                });
                const parent  = e.target.parentElement;
                const outputParagraph = parent.querySelector('h3');
                remainingTime = Math.floor((data.endTime - new Date().getTime())/(1000 *60 ));

                if (remainingTime <= 0) {
                    outputParagraph.textContent = 'No time set';
                }else{
                    let secondsRemainingTime = remainingTime*60;
                     let secondsInterval = setInterval(() => {
                        if (secondsRemainingTime <= 0) {
                            clearInterval(secondsInterval);
                            watchClock.textContent = '';
                            return; 
                        }
                        secondsRemainingTime -= 1;
                        watchClock.textContent = `${secondsRemainingTime}`;
                    }, 1000);
                    
                    let currenttRemainingTime = remainingTime;
                    let mysetInterval = setInterval(() => {
                        if (currenttRemainingTime <= 0) {
                            clearInterval(mysetInterval);
                            outputParagraph.textContent = 'No time set';
                            return; 
                        }
                        currenttRemainingTime -= 1;
                        outputParagraph.textContent = `Remaining ${currenttRemainingTime} minutes`;
                    }, 60000);


                    const watchClock = parent.querySelector('.watchClock');
                  
                }
                outputParagraph.textContent = `Remaining ${remainingTime} minutes`;
               
            }).catch(err => {
                console.log(err);
            });
            
           
        });
    });
}









