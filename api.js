const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const path = require("path");

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000
app.use(cors({
  origin: ["http://localhost:4200", "https://meu-site-theta-gilt.vercel.app/login"],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// Esta linha 'express.static' pode causar problemas no Vercel para servir arquivos estáticos
// se não houver uma pasta 'img' na raiz do seu deploy ou se o Vercel não for configurado
// para servir arquivos estáticos junto com a função serverless.
// Por enquanto, vamos manter, mas se o 404 persistir, pode ser um ponto a investigar.
app.use(express.static(path.join(__dirname)));

class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

app.get("/", (req, res) => {
  res.send("Sua API está no ar! Use as rotas /login, /vehicles ou /vehicleData.");
});

app.post("/login", async (req, res, next) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      throw new ApiError("O campo de usuário ou senha não foi preenchido!", 400);
    }

    if (nome !== "admin" || senha !== "123456") {
      throw new ApiError("O nome de usuário ou senha está incorreto ou não foi cadastrado!", 401);
    }

    return res.status(200).json({
      id: 1,
      nome: "admin",
      email: "admin@email.com",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/vehicles", (req, res, next) => {
  try {
    const vehicles = [
      {
        id: 1,
        vehicle: "Ranger",
        volumetotal: 145760,
        connected: 70000,
        softwareUpdates: 27550,
        img: "https://api-ford-gqoj.onrender.com/img/ranger.png",
      },
      {
        id: 2,
        vehicle: "Mustang",
        volumetotal: 1500,
        connected: 500,
        softwareUpdates: 750,
        img: "https://api-ford-gqoj.onrender.com/img/mustang.png",
      },
      {
        id: 3,
        vehicle: "Territory",
        volumetotal: 4560,
        connected: 4000,
        softwareUpdates: 3050,
        img: "https://api-ford-gqoj.onrender.com/img/territory.png",
      },
      {
        id: 4,
        vehicle: "Bronco Sport",
        volumetotal: 7560,
        connected: 4060,
        softwareUpdates: 2050,
        img: "https://api-ford-gqoj.onrender.com/img/broncoSport.png",
      },
    ];

    return res.status(200).json({ vehicles });
  } catch (error) {
    next(error);
  }
});

app.post("/vehicleData", (req, res, next) => {
  try {
    const { vin } = req.body;

    switch (vin) {
      case "2FRHDUYS2Y63NHD22454":
        return res.status(200).json({
          id: 1,
          odometro: 23344,
          nivelCombustivel: 76,
          status: "on",
          lat: -12.2322,
          long: -35.2314,
        });

      case "2RFAASDY54E4HDU34874":
        return res.status(200).json({
          id: 2,
          odometro: 130000,
          nivelCombustivel: 19,
          status: "off",
          lat: -12.2322,
          long: -35.2314,
        });

      case "2FRHDUYS2Y63NHD22455":
        return res.status(200).json({
          id: 3,
          odometro: 50000,
          nivelCombustivel: 90,
          status: "on",
          lat: -12.2322,
          long: -35.2314,
        });

      case "2RFAASDY54E4HDU34875":
        return res.status(200).json({
          id: 4,
          odometro: 10000,
          nivelCombustivel: 25,
          status: "off",
          lat: -12.2322,
          long: -35.2314,
        });

      case "2FRHDUYS2Y63NHD22654":
        return res.status(200).json({
          id: 5,
          odometro: 23544,
          nivelCombustivel: 76,
          status: "on",
          lat: -12.2322,
          long: -35.2314,
        });

      case "2FRHDUYS2Y63NHD22854":
        return res.status(200).json({
          id: 6,
          odometro: 23574,
          nivelCombustivel: 76,
          status: "on",
          lat: -12.2322,
          long: -35.2314,
        });

      default:
        throw new ApiError("Código VIN utilizado não foi encontrado!", 400);
    }
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Falha na comunicação com o servidor!";

  console.error(err);

  res.status(statusCode).json({
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log("API running on http://localhost:3001/");
});

// ADICIONE ESTA LINHA NO FINAL DO ARQUIVO:
module.exports = app;