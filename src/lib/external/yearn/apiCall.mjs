import axios from 'axios';

async function fetchData() {
    const apiUrl = 'https://api.yexporter.io/v1/chains/1/vaults/all';
    try {
        const response = await axios.get(apiUrl);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();
