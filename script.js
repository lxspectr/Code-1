let dStart = document.querySelector('#dStart');
let dEnd = document.querySelector('#dEnd');
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1;
let yyyy = today.getFullYear();
let textMax = document.querySelector('#max');
let textMin = document.querySelector('#min');
const button = document.querySelector('BUTTON');
const container = document.querySelector('.dates');
today = yyyy+'-'+correct(mm)+'-'+correct(dd);

function correct(q){
    if(q<10){
        q='0'+q;
        return q
    }
    return q
}

dEnd.setAttribute('max', today);

container.addEventListener('change',(evt)=> {
        if (dStart.value && dEnd.value && (dEnd.value >= dStart.value)) {
            button.removeAttribute("disabled");
        } else {
            button.setAttribute('disabled', 'true')
        }
});

let dates = [];
Date.prototype.addDays = function(days) {
    let dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

function getDates(startDate, stopDate) {

    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dates.push(`${currentDate.getFullYear()}-${correct(currentDate.getMonth()+1)}-${correct(currentDate.getDate())}`);
        currentDate = currentDate.addDays(1);
    }
}

button.addEventListener('click',()=>{
    dates = [];
    textMin.innerHTML = '';
    textMax.innerHTML = '';
    getDates(new Date(dStart.value.replace('-', ',')), new Date(dEnd.value.replace('-', ',')));
    Promise.all(dates.map(date => fetch(`https://www.nbrb.by/api/exrates/rates/USD?parammode=2&ondate=${date}`)))
        .then(results => Promise.all(results.map(res=>res.json())))
        .then(result => {
            let maxValue = 0;
            let minValue=0;
            result.forEach((elem)=>{
                if (maxValue < elem['Cur_OfficialRate'] || !maxValue){
                    maxValue = elem['Cur_OfficialRate']
                }
                if (minValue > elem['Cur_OfficialRate']|| !minValue){
                    minValue = elem['Cur_OfficialRate']
                }
            });
            const maxRes = result.filter(data=>{ return data['Cur_OfficialRate']===maxValue});
            const minRes = result.filter(data=>{ return data['Cur_OfficialRate']===minValue});
            let cur1 = document.createElement('DIV');
            cur1.innerHTML = `Курс ${maxValue}`;
            textMax.prepend(cur1);
            let cur2 = document.createElement('DIV');
            cur2.innerHTML = `Курс ${minValue}`;
            textMin.prepend(cur2);
            maxRes.forEach((elem)=>{

                let li = document.createElement('LI');
                li.innerHTML = elem['Date'].slice(0,-9);
                textMax.append(li)
            });
            minRes.forEach((elem)=>{

                let li = document.createElement('LI');
                li.innerHTML = elem['Date'].slice(0,-9);
                textMin.append(li)
            })
})
});


