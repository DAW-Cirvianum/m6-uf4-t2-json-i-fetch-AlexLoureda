const getData = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error: ', error);
    }
};

//const url = "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/9663?nult=10";

const getRentPrices = async () => {
    const url = "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=10";
    try {
        const data = await getData(url)

        const catalunya = data.filter((element) =>
            element.Nombre.includes('Cataluña. Total'))

        return catalunya
    } catch (error) {
        console.error('Error: ', error);
        return []
    }
};

getRentPrices().then((data) => console.log(data))

const showRentPrices = (data) => {
    const divs = document.querySelectorAll('.contenidor > div');

    const ulElVar = document.createElement('ul');
    const ulElIn = document.createElement('ul');
    
    data.forEach((element) => {
        element.Data.forEach((item) =>{
            const liEl = document.createElement('li');

            if(element.Nombre.includes('Índice')){
                liEl.innerHTML = `<b>${item.Anyo} - ${item.Valor}</b>`;
                ulElIn.appendChild(liEl);
            }
            else if (element.Nombre.includes('Variación')){
                liEl.innerHTML = `<b>${item.Anyo} - ${item.Valor}</b>`;
                ulElVar.appendChild(liEl);
            }
        });
    });

    divs[0].appendChild(ulElIn);
    divs[1].appendChild(ulElVar);
};

const getIPC = async () => {
    const url = "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/50934?nult=10";
    try {
        const data = await getData(url);

        const selector = document.getElementById('ipc-selector');

        data.forEach((element) => {
            const option = document.createElement('option');
            const nameParts = element.Nombre.split(".");
            const nameAfFiDot = nameParts.slice(1).join(".")
            option.value = nameAfFiDot;
            option.text = nameAfFiDot;

            selector.appendChild(option);
        });
        return data;
    } catch (error) {
        console.error('Error: ', error);
        return []
    }
}

getIPC();

const showIPC = async () => {
    try {
        const data = await getIPC();
        const select = document.getElementById('ipc-selector');

        const ipcSel = select.value;
        let filData = data.find((element) =>
            element.Nombre.includes(ipcSel)
        );

        const labels = [];
        const values = [];

        filData.Data.forEach((item) => {
            labels.push(item.Anyo);
            values.push(item.Valor);
        });

        labels.reverse();
        values.reverse();

        myChart(labels, values);
    } catch (error) {
        
    }
}

let chart = null; // Declarem una variable global per a guardar el gràfic

const myChart = (labels, data) => {
    console.log(labels, data)
    const ctx = document.getElementById('myChart').getContext('2d');
    if (chart) { // If a chart exists
        chart.destroy(); // Destroy it
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Índex de Preus',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data
            }]
        },
        options: {}
    });
}

const main = async () => {
    try {
        const data = await getRentPrices();
        showRentPrices(data);

        showIPC();
        const select = document.getElementById('ipc-selector');
        select.addEventListener('change', showIPC);

    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}

main();