const fastify = require('fastify');
const axios = require('axios');
const app = fastify();

app.get('/inflacion', async (req, res) => {
    return axios.get('https://api.estadisticasbcra.com/inflacion_esperada_oficial', {
        mode: "no-cors",
        headers: {
            Authorization:
                "BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODc1NTk3MTUsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJjdWYudmFyZWxhQGdtYWlsLmNvbSJ9.FLeri1B4SnG-PZyjB2Al-RTjRNpSGECyyKV-zY3Ith2WylmbFBkrd7MRB6v7pG1qDYbi-kGkRShRZdozGEjR9w",
        },
    })
    .then(response => {
        const last = (response.data || []).pop();
        res.send({
            error: !!(last?.v || true),
            inflation: last?.v || 0,
        })
    });
});

app.listen(3001).then(res => console.log('Running at 3001'));