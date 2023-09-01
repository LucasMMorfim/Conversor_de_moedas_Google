import styles from './ConversorDeMoedas.module.css'
import { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../services/fetchDataFromApi';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

export function ConversorDeMoedas() {
  const [isMoedaAconverterClicked, setIsMoedaAconverterClicked] = useState(false);
  const [isMoedaConvertidaClicked, setIsMoedaConvertidaClicked] = useState(false);
  const [apiData, setApiData] = useState<{ conversion_rates: { [key: string]: number } }>({ conversion_rates: {} });
  const [moedaOrigem, setMoedaOrigem] = useState('USD');
  const [moedaDestino, setMoedaDestino] = useState('BRL');
  const [valorAConverter, setValorAConverter] = useState(1);
  const [valorConvertido, setValorConvertido] = useState(0);
  const [horaAtual, setHoraAtual] = useState('');

  useEffect(() => {
    fetchDataFromApi()
      .then(data => {
        setApiData(data)
        atualizarValorConvertido(data.conversion_rates);
        atualizarDataHoraAtual();
      })
      .catch(err => {
        console.error('Erro ao buscar dados da API', err);
      })
  }, [])

  useEffect(() => {
    atualizarValorConvertido(apiData.conversion_rates);
  }, [valorAConverter, moedaOrigem, moedaDestino, apiData]);

  const atualizarValorConvertido = (rates: { [key: string]: number }) => {
    const taxaOrigem = rates[moedaOrigem];
    const taxaDestino = rates[moedaDestino];
    const valorConvertido = (valorAConverter / taxaOrigem) * taxaDestino;
    setValorConvertido(valorConvertido);
  }

  const atualizarDataHoraAtual = () => {
    const dataAtual = new Date();
    const zonaHorariaUTC = 'Etc/UTC';
    const horaEmUTC = utcToZonedTime(dataAtual, zonaHorariaUTC);
    
    const horaFormatada = format(horaEmUTC, "dd 'de' MMM., HH:mm", { locale: ptBR });
    setHoraAtual(horaFormatada + ' UTC');
  }

  const handleMoedaAconverterClick = () => {
    setIsMoedaAconverterClicked(true);
  };

  const handleMoedaConvertidaClick = () => {
    setIsMoedaConvertidaClicked(true);
  };

  const handleInputBlur = () => {
    setIsMoedaAconverterClicked(false);
    setIsMoedaConvertidaClicked(false);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.nomeMoeda}>{valorAConverter} {moedaOrigem} igual a</div>
      <div className={styles.valorFinal}>{valorConvertido.toFixed(2)} {moedaDestino}</div>
      <div className={styles.dataAtual}>{horaAtual} - Fontes</div>
      <div className={`${styles.moedaAconverter} ${isMoedaAconverterClicked ? styles.clicked : ''}`} onClick={handleMoedaAconverterClick} tabIndex={0}>
        <div className={styles.currencyContainer}>
          <input 
            onBlur={handleInputBlur} 
            defaultValue={1}
            type="number"
            onChange={e => setValorAConverter(parseInt(e.target.value))}
          />
          <span className={styles.icon}>|</span>
          <select
            onBlur={handleInputBlur} 
            value={moedaOrigem} 
            onChange={e => setMoedaOrigem(e.target.value)}
          >
            {Object.keys(apiData.conversion_rates).map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}          
          </select>
        </div>
      </div>
      <div className={`${styles.moedaConvertida} ${isMoedaConvertidaClicked ? styles.clicked : ''}`} onClick={handleMoedaConvertidaClick} tabIndex={0}>
        <div className={styles.currencyContainer}>
          <input
            onBlur={handleInputBlur}
            value={valorConvertido.toFixed(2)}
            onChange={(e) => setValorConvertido(parseFloat(e.target.value))}
          />
          <span className={styles.icon}>|</span>
          <select onBlur={handleInputBlur} value={moedaDestino} onChange={e => setMoedaDestino(e.target.value)}>
            {Object.keys(apiData.conversion_rates).map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}      
          </select>
        </div>
      </div>
    </div>
  );
}