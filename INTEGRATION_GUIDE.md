# TrueBlock API - Guía de Integración

Esta guía explica cómo integrar y usar la API de TrueBlock que está corriendo en `trust.cloudycoding.com`.

## 🚀 Configuración Rápida

### Instalación del Cliente

```bash
# En tu proyecto Next.js
npm install
```

### Importar el Cliente

```typescript
import { trueBlockAPI } from "@/lib/trueblock-api";
import {
  useValidation,
  useNewsFeed,
  useHealthCheck,
} from "@/hooks/use-trueblock-api";
```

## 📋 Ejemplos de Uso

### 1. Health Check de la API

```typescript
// Usando el hook
function HealthStatus() {
  const { status, loading, error, refetch } = useHealthCheck();

  if (loading) return <div>Verificando estado...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Estado: {status?.data?.status}</p>
      <p>Versión: {status?.data?.version}</p>
      <button onClick={refetch}>Actualizar</button>
    </div>
  );
}

// Usando el cliente directamente
async function checkAPIHealth() {
  const response = await trueBlockAPI.healthCheck();

  if (response.success) {
    console.log("API Status:", response.data.status);
    console.log("Services:", response.data.services);
  } else {
    console.error("Health check failed:", response.error);
  }
}
```

### 2. Enviar Noticia para Validación

```typescript
// Usando el hook
function ValidationForm() {
  const { loading, error, submitValidation } = useValidation();

  const handleSubmit = async (formData) => {
    const result = await submitValidation({
      url: formData.url,
      content: formData.content,
      title: formData.title,
    });

    if (result) {
      console.log("Content Hash:", result.contentHash);
      console.log("Transaction Hash:", result.transactionHash);
    }
  };

  // Renderizar formulario...
}

// Usando el cliente directamente
async function submitNewsForValidation() {
  const response = await trueBlockAPI.submitValidation({
    url: "https://ejemplo.com/noticia",
    title: "Título de la noticia",
  });

  if (response.success) {
    console.log("Validación enviada:", response.data);
    return response.data.contentHash;
  } else {
    console.error("Error:", response.error);
  }
}
```

### 3. Obtener Estado de Validación

```typescript
async function getValidationStatus(contentHash: string) {
  const response = await trueBlockAPI.getValidationStatus(contentHash);

  if (response.success) {
    const validation = response.data;
    console.log("Estado:", validation.status);
    console.log("Score:", validation.score);
    console.log("Validaciones totales:", validation.validations.total_votes);

    // Breakdown detallado
    console.log("Fake news score:", validation.breakdown.fake_news_score);
    console.log("Credibility score:", validation.breakdown.credibility_score);
  }
}
```

### 4. Votar en una Validación

```typescript
async function submitVote(
  contentHash: string,
  vote: boolean,
  walletAddress: string
) {
  // Primero necesitas generar la firma
  const signature = await generateSignature(contentHash, vote, walletAddress);

  const response = await trueBlockAPI.submitVote({
    contentHash,
    walletAddress,
    vote, // true = real, false = fake
    confidence: 85, // 1-100
    evidence: "https://evidencia.com/prueba",
    signature,
  });

  if (response.success) {
    console.log("Voto registrado:", response.data.voteId);
    console.log("Recompensa:", response.data.reward);
    console.log("Nueva reputación:", response.data.newReputation);
  }
}

// Función auxiliar para generar firma (ejemplo con ethers.js)
async function generateSignature(
  contentHash: string,
  vote: boolean,
  walletAddress: string
) {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const message = `TrueBlock Community Vote: ${contentHash}:${vote}`;
    const signature = await signer.signMessage(message);

    return signature;
  }
  throw new Error("Wallet no disponible");
}
```

### 5. Feed de Noticias

```typescript
// Usando el hook
function NewsFeed() {
  const { news, meta, loading, error } = useNewsFeed({
    page: 1,
    limit: 10,
    status: "validated",
    minScore: 75,
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {news.map((article) => (
        <div key={article.contentHash}>
          <h3>{article.title}</h3>
          <p>Score: {article.score}%</p>
          <p>Estado: {article.status}</p>
        </div>
      ))}
    </div>
  );
}

// Usando el cliente directamente
async function getNewsFeed() {
  const response = await trueBlockAPI.getNewsFeed({
    page: 1,
    limit: 20,
    status: "validated",
    category: "politics",
    minScore: 80,
  });

  if (response.success) {
    console.log("Noticias:", response.data.data);
    console.log("Metadata:", response.data.meta);
  }
}
```

### 6. Búsqueda de Noticias

```typescript
async function searchNews() {
  const response = await trueBlockAPI.searchNews({
    query: "elecciones 2024",
    filters: {
      status: "validated",
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
      minScore: 70,
    },
    page: 1,
    limit: 20,
  });

  if (response.success) {
    console.log("Resultados:", response.data.data.results);
    console.log("Tiempo de búsqueda:", response.data.data.searchTime);
  }
}
```

### 7. Registrar Oráculo

```typescript
async function registerOracle(walletAddress: string) {
  const signature = await generateOracleSignature(walletAddress, "fake_news");

  const response = await trueBlockAPI.registerOracle({
    walletAddress,
    specialization: "fake_news", // fake_news, deepfake, image_manipulation, text_analysis
    stake: "10.0", // ETH
    signature,
  });

  if (response.success) {
    console.log("Oráculo registrado:", response.data.oracleId);
    console.log("Transaction:", response.data.transactionHash);
  }
}

async function generateOracleSignature(
  walletAddress: string,
  specialization: string
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const message = `TrueBlock Oracle Registration: ${specialization}`;
  return await signer.signMessage(message);
}
```

### 8. TruthBoard (Periodismo Anónimo)

```typescript
async function publishAnonymousNews() {
  const response = await trueBlockAPI.publishAnonymous({
    content: "Contenido de la investigación periodística...",
    title: "Investigación sobre corrupción",
    region: "latam",
    publisherIdentity: {
      zkProof: "proof_data_here...",
      commitment: "commitment_hash...",
      nullifier: "nullifier_hash...",
    },
  });

  if (response.success) {
    console.log("Artículo publicado anónimamente:", response.data.articleId);
    console.log("Anonymity score:", response.data.anonymityScore);
  }
}

async function getTruthBoardStats() {
  const response = await trueBlockAPI.getTruthBoardStats();

  if (response.success) {
    console.log("Total de artículos:", response.data.totalArticles);
    console.log("Validadores activos:", response.data.activeValidators);
    console.log("Donaciones totales:", response.data.totalDonations);
  }
}
```

### 9. Almacenamiento en Filecoin

```typescript
async function archiveValidatedNews(contentHash: string) {
  const response = await trueBlockAPI.archiveNews({
    contentHash,
    title: "Noticia validada para archivo",
    content: "Contenido completo...",
    validationScore: 85,
    validators: [{ address: "0x123...", vote: true, confidence: 90 }],
  });

  if (response.success) {
    console.log("CID de Filecoin:", response.data.filecoinCid);
    console.log("Deal ID:", response.data.dealId);
    console.log("URL de recuperación:", response.data.retrievalUrl);
  }
}

async function getStorageStats() {
  const response = await trueBlockAPI.getStorageStatistics();

  if (response.success) {
    console.log("Total almacenado:", response.data.totalStored);
    console.log("Deals activos:", response.data.activeDeals);
    console.log("Salud de la red:", response.data.networkHealth);
  }
}
```

### 10. Validación Confidencial (FHE)

```typescript
async function initializeConfidentialValidation() {
  const response = await trueBlockAPI.initializeFHE({
    contractAddress: "0x345E4DB2fa4E615842D51DAf6D2ae4a831220876",
    relayerConfig: {
      endpoint: "https://relayer.zama.ai",
      apiKey: "your_zama_api_key",
    },
  });

  if (response.success) {
    console.log("FHE inicializado:", response.stats.encryptionReady);
  }
}

async function submitConfidentialValidation() {
  const response = await trueBlockAPI.submitConfidentialValidation({
    contentHash: "QmXYZ123...",
    validatorAddress: "0x123...",
    encryptedVote: {
      vote: "encrypted_boolean_data...",
      confidence: "encrypted_score_data...",
      evidence: "encrypted_evidence_hash...",
    },
    zkProof: "proof_of_valid_vote...",
  });

  if (response.success) {
    console.log("Validación confidencial enviada:", response.data.validationId);
    console.log("Privacidad preservada:", response.data.anonymityPreserved);
  }
}
```

## 🔧 Utilidades y Helpers

### Verificar Conectividad

```typescript
async function testAPIConnection() {
  try {
    const health = await trueBlockAPI.healthCheck();
    const info = await trueBlockAPI.getApiInfo();

    console.log("✅ API disponible");
    console.log("Servicios activos:", Object.keys(health.data?.services || {}));
    console.log(
      "Plataformas disponibles:",
      Object.keys(info.data?.platforms || {})
    );

    return true;
  } catch (error) {
    console.error("❌ API no disponible:", error);
    return false;
  }
}
```

### Manejar Errores

```typescript
function handleAPIError(response: any) {
  if (!response.success) {
    switch (response.error) {
      case "No autorizado":
        console.error("Firma inválida o expirada");
        break;
      case "Demasiadas solicitudes":
        console.error("Rate limit excedido, espera antes de intentar de nuevo");
        break;
      case "Parámetros inválidos":
        console.error("Revisa los datos enviados:", response.message);
        break;
      default:
        console.error("Error de API:", response.message);
    }
  }
}
```

### Rate Limiting

```typescript
class RateLimitedAPIClient {
  private lastRequest = 0;
  private minInterval = 100; // ms entre requests

  async makeRequest(apiCall: () => Promise<any>) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;

    if (timeSinceLastRequest < this.minInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }

    this.lastRequest = Date.now();
    return await apiCall();
  }
}

const rateLimitedAPI = new RateLimitedAPIClient();

// Uso
const result = await rateLimitedAPI.makeRequest(() =>
  trueBlockAPI.getNewsFeed({ page: 1 })
);
```

## 🎯 Casos de Uso Completos

### Dashboard de Validación

```typescript
function ValidationDashboard() {
  const [contentHash, setContentHash] = useState("");
  const [validationData, setValidationData] = useState(null);

  const checkValidation = async () => {
    if (!contentHash) return;

    const response = await trueBlockAPI.getValidationStatus(contentHash);
    if (response.success) {
      setValidationData(response.data);
    }
  };

  return (
    <div>
      <input
        value={contentHash}
        onChange={(e) => setContentHash(e.target.value)}
        placeholder="Content Hash"
      />
      <button onClick={checkValidation}>Verificar Estado</button>

      {validationData && (
        <div>
          <p>Estado: {validationData.status}</p>
          <p>Score: {validationData.score}%</p>
          <p>Validaciones: {validationData.validations.total_votes}</p>
        </div>
      )}
    </div>
  );
}
```

### Integración con Wallet

```typescript
function WalletIntegration() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
    }
  };

  const submitVoteWithWallet = async (contentHash: string, vote: boolean) => {
    if (!walletConnected) {
      alert("Conecta tu wallet primero");
      return;
    }

    const signature = await generateSignature(contentHash, vote, walletAddress);

    const response = await trueBlockAPI.submitVote({
      contentHash,
      walletAddress,
      vote,
      confidence: 85,
      signature,
    });

    if (response.success) {
      alert("Voto enviado exitosamente!");
    }
  };

  return (
    <div>
      {!walletConnected ? (
        <button onClick={connectWallet}>Conectar Wallet</button>
      ) : (
        <p>Conectado: {walletAddress}</p>
      )}
    </div>
  );
}
```

## 📚 Referencias

- **Base URL de la API**: `https://trust.cloudycoding.com`
- **Rate Limits**: 100 requests por 15 minutos por IP
- **Documentación completa**: Ver archivo API-DOCS.md
- **Soporte**: La API está corriendo 24/7 en trust.cloudycoding.com

## 🚨 Notas Importantes

1. **Signatures**: Todos los endpoints que modifican estado requieren firmas criptográficas
2. **Rate Limiting**: Respeta los límites para evitar bloqueos temporales
3. **Error Handling**: Siempre verifica `response.success` antes de usar los datos
4. **Testnet**: La API está configurada para redes de testnet (Sepolia, etc.)
5. **CORS**: La API está configurada para permitir requests desde dominios web

¡Listo para integrar con tu aplicación Next.js! 🚀
