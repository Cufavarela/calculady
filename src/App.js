import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [priceExt, setPriceExt] = useState(null);
  const [priceHome, setPriceHome] = useState(null);
  const duesOptions = [3, 6, 9, 12, 18];
  const inflation = 0.05;
  const [dolarTrjt, setDolarTrjt] = useState(0);
  const [priceWithDues, setpriceWithDues] = useState(0);
  const [selectedDuesQty, setSelectedDuesQty] = useState(null);
  const [oficialDolarValue, setOficialDolaralue] = useState(null);

  const getPriceWithDolarTrjt = (dolarValue, price) => {
    setDolarTrjt(dolarValue * price);
  };

  const getPriceWithDues = (price, duesQty, inflation) => {
    let sumArray = [];
    let duesValue = price / duesQty;
    for (let i = 0; i < duesQty; i++) {
      sumArray.push(duesValue / Math.pow(1 + inflation, i + 1));
    }
    let sum = sumArray.reduce((previous, current) => {
      return previous + current;
    });
    setpriceWithDues(sum);
  };

  const getInflation = () => {
    let BCRAInf = 0;
    fetch("https://api.estadisticasbcra.com/inflacion_esperada_oficial", {
      mode: "cors",
      headers: {
        Authorization:
          "BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODc1NTk3MTUsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJjdWYudmFyZWxhQGdtYWlsLmNvbSJ9.FLeri1B4SnG-PZyjB2Al-RTjRNpSGECyyKV-zY3Ith2WylmbFBkrd7MRB6v7pG1qDYbi-kGkRShRZdozGEjR9w",
      },
    }).then((res) => (BCRAInf = res[res.lenght - 1].v));
    const algo = Math.pow(1 + BCRAInf / 100, 1 / 12);
    console.log(algo - 1);
  };

  const getOficialDolarValue = () => {
    axios
      .get("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
      .then((res) => {
        res.data.forEach((dolar) => {
          if (dolar.nombre === "Dolar Turista") {
            setOficialDolaralue(dolar.venta);
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
          onClick={() => {
            getPriceWithDolarTrjt(oficialDolarValue, priceExt);
          }}
        >
          Dolar tarjeta
        </button>
        <p className="price">${dolarTrjt.toFixed(2)}</p>
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
            onClick={() => {
              getPriceWithDues(priceHome, selectedDuesQty, inflation);
            }}
          >
            Valor en cuotas traído a hoy
          </button>
          <p className="price">${priceWithDues.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
