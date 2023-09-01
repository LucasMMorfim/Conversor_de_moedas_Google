export async function fetchDataFromApi() {
  const urlAPI = 'https://v6.exchangerate-api.com/v6/abf4ae678a0240726fff9d7c/latest/USD'

    try {
      const response = await fetch(urlAPI)
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da API')
      }
      const data = await response.json();
      return data;
    } catch (error) {
        alert('Erro ao buscar dados da API')
        console.log('Erro ao buscar dados da API', error)
        throw error;
    }
}