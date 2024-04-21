<script lang="ts">
    import { onMount } from 'svelte';

    const API_KEY = '1e2d34fb8ce0c0b1a05a38ea';
    const API_URL_CODES = `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`;
    const API_URL_RATE = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

    // Создаем переменную для хранения списка валют
    let currencies: [string, string][] = [];

    let inputLeftActive = false;
    let visibleLeft = true;

    let leftSelectValue: string;
    let rightSelectValue: string;

    let leftInputValue: string = '';
    let rightInputValue: string = '';

    let isError: boolean = false;

    // Функция для запроса списка валют
    async function fetchCurrencies() {
        try {
            const response = await fetch(API_URL_CODES);

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json();
            currencies = data.supported_codes;

            leftSelectValue = currencies[0][0];
            rightSelectValue = currencies[0][0];
        } catch (error) {
            console.error('Ошибка при запросе списка валют:', error);
        }
    }

    // Функция для получения курса валют
    async function getExchangeRates() {
        try {
            const currence = inputLeftActive ? leftSelectValue : rightSelectValue;
            const response = await fetch(API_URL_RATE + currence);

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json();
            const rate = data.conversion_rates[!inputLeftActive ? leftSelectValue : rightSelectValue];

            return rate;
        } catch (error) {
            console.error('Ошибка при запросе курсов валют:', error);
        }
    }

    const changeInputValue = (inputValue:string) => {

        if (inputValue === ''){
            leftInputValue = '';
            rightInputValue = '';
        }

        isError = inputValue === '' ? false : isNaN(Number(inputValue));

        if (isError && inputLeftActive){
            rightInputValue = '';
        }
        if (isError && !inputLeftActive){
            leftInputValue = '';
        }

        if (inputValue)
            getExchangeRates().then(
                (rate)=> {
                    if (!isError){
                        if(inputLeftActive)
                            rightInputValue = (rate * Number(inputValue)).toString();
                        else
                        leftInputValue = (rate * Number(inputValue)).toString();
                    }
                }
            );
    }

    const handleInput = (event: InputEvent) => {

        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;
        const inputClassList = inputElement.classList;

        if (inputClassList.contains("left-input")){
            inputLeftActive = true;
            visibleLeft = true;
            leftInputValue = inputValue;
        }

        if (inputClassList.contains("right-input")){
            inputLeftActive = false;
            visibleLeft = false;
            rightInputValue = inputValue;
        }

        changeInputValue(inputValue);
    }

    const handleChangeSelect = (event: Event) => {
        const selectElement = event.target as HTMLSelectElement;
        const selectClassList = selectElement.classList;
        const selectValue = selectElement.value;

        const inputValue =  inputLeftActive ? leftInputValue: rightInputValue;

        if (selectClassList.contains("left-select")){
            leftSelectValue = selectValue;
        }
        if (selectClassList.contains("right-select")){
            rightSelectValue = selectValue;
        }

        changeInputValue(inputValue);
    }

    // Запускаем функцию fetchCurrencies при монтировании компонента
    onMount(() => {
        fetchCurrencies();
    });

</script>

<main>
    <h2>Выберите валюту:</h2>
    <select id="left-select" class="left-select" on:change={handleChangeSelect}>
        {#each currencies as [code, name]}
            <option value={code}>{name}</option>
        {/each}
    </select>
    <input id="left-input" class="left-input" on:input={handleInput} value={leftInputValue}/>
    <i id="fa-arrow-right"
       class={`icon fa fa-arrow-right ${inputLeftActive ? "icon--red" : ""} ${visibleLeft ? "visible" : ""}`}
       aria-hidden="true"></i>
    <i id="fa-arrow-left" class={`icon fa-solid fa-arrow-left ${!inputLeftActive ? "icon--red" : ""} ${!visibleLeft ? "visible" : ""}`}></i>
    <select id="right-select" class="right-select" on:change={handleChangeSelect}>
        {#each currencies as [code, name]}
            <option value={code}>{name}</option>
        {/each}
    </select>
    <input id="right-input" class="right-input" on:input={handleInput} value={rightInputValue}/>
    <h2>{ isError ? 'Ошибка ввода!' : ''}</h2>
</main>

<style>

.icon {
    display: none;
}

.visible{
    display: inline-block;
}

.icon--red{
    color: red;
}
  </style>