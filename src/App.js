import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [priceExt, setPriceExt] = useState(null);
  const [priceHome, setPriceHome] = useState(null);
  const duesOptions = [3, 6, 9, 12, 18];
  const [inflation, setInflation] = useState(0);
  const [dolarCard, setDolarCard] = useState(0);
  const [priceWithDues, setPriceWithDues] = useState(0);
  const [selectedDuesQty, setSelectedDuesQty] = useState(null);
  const [oficialDolarValue, setOficialDolarValue] = useState(null);

  const getPriceWithDolarCard = () => setDolarCard(oficialDolarValue * priceExt);

  const getPriceWithDues = () => {
    const inflationSum = Math.pow(inflation / 100, 1 / 12) - 1;
    const duesValue = priceHome / selectedDuesQty;
    const sum = Array.from({length:  selectedDuesQty}, (_, i) => i + 1)
      .reduce((previous, due) => previous + duesValue / Math.pow(1 + inflationSum, due + 1), 0);
    setPriceWithDues(sum);
  };

  const getInflation = () => fetch("/inflacion")
      .then((res) => res.json())
      .then(data => setInflation(data.value));

  const getOficialDolarValue = () => {
    fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
      .then(res => res.json())
      .then(data => {
        // const dolar = data.filter(item => item?.casa?.nombre === "Dolar Turista");
        data.forEach(({ casa }) => {
          if (casa.nombre.toLowerCase() === 'dolar turista') {
            console.log(casa);
            setOficialDolarValue(parseFloat(casa.venta))
          }
        });
    });
  };

  useEffect(() => {
    getOficialDolarValue();
    getInflation();
  }, []);

  return (
    <div className="App">
      <div className="form">
        <label className="label">Precio en USD:</label>
        <input
          className="priceInput"
          type="number"
          value={priceExt}
          onChange={(e) => setPriceExt(e.target.value)}
        />
        <label className="label">Precio en ARS:</label>
        <input
          className="priceInput"
          type="number"
          value={priceHome}
          onChange={(e) => setPriceHome(e.target.value)}
        />
      </div>
      <div>
        <p>
          Esta es la cantidad de ARS que te costaría comprar el producto con
          tarjeta de crédito en el exterior en UNA cuota
        </p>
        <button
          className="button"
          disabled={!priceExt}
          onClick={getPriceWithDolarCard}
        >
          Dolar tarjeta
        </button>
        <p className="price">${Number(dolarCard).toLocaleString()}</p>
      </div>
      <div>
        <p>
          Esta es la cantidad de ARS que te costaría comprar el producto con
          tarjeta de crédito en Argentina, en pesos y con las cuotas
          seleccionadas.
        </p>
        <div className="select">
          <select
            className="selectInput"
            onChange={(e) => setSelectedDuesQty(e.target.value)}
            placeholder="Elegí la cantidad de cuotas sin interés"
          >
            <option disabled selected>
              Selecciona una opción
            </option>
            {duesOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <button
            className="button"
            disabled={!selectedDuesQty || !priceHome}
            onClick={getPriceWithDues}
          >
            Valor en cuotas traído a hoy
          </button>
          <p className="price">${Number(priceWithDues).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
